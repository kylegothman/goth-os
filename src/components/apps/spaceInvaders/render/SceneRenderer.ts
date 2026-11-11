import * as THREE from 'three';
import { Bunker, Enemy, type Entity } from '../game/entities';
import type { VoxelModel } from '../game/VoxelModel';
import type { ModelSet } from '../game/Models';
import type { GameLogic } from '../game/GameLogic';
import { Starfield } from '../game/Starfield';

/** glClearColor(0.03, 0.03, 0.06) */
const CLEAR_COLOR = new THREE.Color(0.03, 0.03, 0.06);
/**
 * Fixed-function GL lit everything with global ambient 0.2 plus one white light, with no 1/π in the
 * diffuse term. three's physically based lights include the 1/π, so intensities are scaled by π.
 */
const AMBIENT_INTENSITY = 0.2 * Math.PI;

type Frame = 0 | 1;

// The Java game ran in a fixed 1024×768 window with vertical FOVs of 48° (play) and 55° (menu).
const ORIGINAL_ASPECT = 1024 / 768;
const GAME_FOV = 48;
const MENU_FOV = 55;
/**
 * The ship may travel to x = ±10 but the original camera only shows |x| < ~4 at the ship's depth,
 * so the camera slides sideways with the ship (fraction of its x) to keep it in frame.
 */
const CAMERA_FOLLOW = 0.7;
const CAMERA_FOLLOW_RATE = 6;

/** Keeps the horizontal field of view of the original 4:3 window when the canvas is narrower. */
const fovForAspect = (baseFov: number, aspect: number): number => {
  if (aspect >= ORIGINAL_ASPECT) return baseFov;
  const halfRad = Math.atan(Math.tan(THREE.MathUtils.degToRad(baseFov / 2)) * ORIGINAL_ASPECT / aspect);
  return THREE.MathUtils.radToDeg(halfRad) * 2;
};

/** One scene object per game entity; the child mesh is swapped when its model/frame changes. */
interface EntityView {
  group: THREE.Group;
  mesh: THREE.Mesh | null;
  key: string;
}

const isBolt = (e: Entity) =>
  e.modelId === 'enemy_bolt_cross' || e.modelId === 'enemy_bolt_zigzag' || e.modelId === 'player_bolt';

export class SceneRenderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly gameCamera = new THREE.PerspectiveCamera(GAME_FOV, 1, 0.1, 200);
  private readonly menuCamera = new THREE.PerspectiveCamera(MENU_FOV, 1, 0.1, 200);
  private cameraX = 0;
  private readonly light = new THREE.PointLight(0xffffff, Math.PI, 0, 0);
  private readonly starfield = new Starfield();
  private readonly entityRoot = new THREE.Group();
  private readonly menuRoot = new THREE.Group();
  private readonly geometries = new Map<VoxelModel, { version: number; geometry: THREE.BufferGeometry }>();
  private readonly materials = new Map<number, THREE.MeshLambertMaterial>();
  private readonly views = new Map<Entity, EntityView>();
  private readonly menuViews: EntityView[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.scene.background = CLEAR_COLOR;

    // gluLookAt(0, 2.5, 15.5 → 0, 0.4, 0) in play; gluLookAt(0, 0.5, 8.5 → 0, 0.3, 0) on the title screen
    this.gameCamera.position.set(0, 2.5, 15.5);
    this.gameCamera.lookAt(0, 0.4, 0);
    this.menuCamera.position.set(0, 0.5, 8.5);
    this.menuCamera.lookAt(0, 0.3, 0);

    this.scene.add(
      new THREE.AmbientLight(0xffffff, AMBIENT_INTENSITY),
      this.light,
      this.starfield.object,
      this.entityRoot,
      this.menuRoot,
    );

    // Three invaders spinning on the title screen
    for (let i = 0; i < 3; i++) {
      const group = new THREE.Group();
      group.position.set((i - 1) * 2.6, -0.2, 0);
      this.menuRoot.add(group);
      this.menuViews.push({ group, mesh: null, key: '' });
    }
  }

  setSize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
    const aspect = width / Math.max(1, height);
    for (const [camera, baseFov] of [[this.gameCamera, GAME_FOV], [this.menuCamera, MENU_FOV]] as const) {
      camera.aspect = aspect;
      camera.fov = fovForAspect(baseFov, aspect);
      camera.updateProjectionMatrix();
    }
  }

  renderMenu(models: ModelSet, spinDegrees: number, flapFrame: Frame, dt: number, timeSec: number): void {
    this.tickEnvironment(dt, timeSec);
    this.entityRoot.visible = false;
    this.menuRoot.visible = true;

    const frames = [models.top, models.mid, models.bottom];
    this.menuViews.forEach((view, i) => {
      view.group.rotation.y = THREE.MathUtils.degToRad(spinDegrees);
      this.showModel(view, frames[i][flapFrame]);
    });

    this.renderer.render(this.scene, this.menuCamera);
  }

  renderGame(logic: GameLogic, models: ModelSet, flapFrame: Frame, boltFrame: Frame, dt: number, timeSec: number): void {
    this.tickEnvironment(dt, timeSec);
    this.menuRoot.visible = false;
    this.entityRoot.visible = true;

    // Ease the camera sideways toward the ship; gluLookAt(0, 2.5, 15.5 → 0, 0.4, 0) when the ship is centred.
    const targetX = logic.player.x * CAMERA_FOLLOW;
    this.cameraX += (targetX - this.cameraX) * (1 - Math.exp(-CAMERA_FOLLOW_RATE * dt));
    this.gameCamera.position.set(this.cameraX, 2.5, 15.5);
    this.gameCamera.lookAt(this.cameraX, 0.4, 0);

    const seen = new Set<Entity>();
    for (const e of logic.getRenderables()) {
      const model = this.modelFor(e, models, flapFrame, boltFrame);
      if (!model) continue;
      seen.add(e);

      let view = this.views.get(e);
      if (!view) {
        view = { group: new THREE.Group(), mesh: null, key: '' };
        this.entityRoot.add(view.group);
        this.views.set(e, view);
      }
      view.group.position.set(e.x, e.y, e.z);
      // Bolts lie along their direction of travel; the ship is tilted back toward the camera.
      view.group.rotation.x = isBolt(e) ? Math.PI / 2 : e.modelId === 'player_ship' ? -Math.PI / 4 : 0;
      this.showModel(view, model);
    }

    for (const [entity, view] of this.views) {
      if (seen.has(entity)) continue;
      this.entityRoot.remove(view.group);
      this.views.delete(entity);
      if (entity instanceof Bunker) this.forgetGeometry(entity.model);
    }

    this.renderer.render(this.scene, this.gameCamera);
  }

  dispose(): void {
    for (const { geometry } of this.geometries.values()) geometry.dispose();
    for (const material of this.materials.values()) material.dispose();
    this.starfield.dispose();
    this.renderer.dispose();
  }

  /** Starfield motion plus the sweeping, star-flickered light from Main.display(). */
  private tickEnvironment(dt: number, timeSec: number): void {
    this.starfield.update(dt);
    const sweep = Math.sin(timeSec * 0.7) * 6;
    const pulse = 0.825 + 0.175 * Math.sin(timeSec * 1.8);
    const lit = Math.min(1, pulse + this.starfield.brightnessBoost);
    this.light.position.set(sweep, 4, 5);
    this.light.intensity = lit * Math.PI;
  }

  private modelFor(e: Entity, models: ModelSet, flapFrame: Frame, boltFrame: Frame): VoxelModel | null {
    switch (e.modelId) {
      case 'enemy_bolt_cross': return models.boltCross[boltFrame];
      case 'enemy_bolt_zigzag': return models.boltZigzag[boltFrame];
      case 'player_bolt': return models.playerBolt;
      case 'player_ship': return e.alive ? models.ship : models.shipExplosion;
      case 'bunker': return e instanceof Bunker ? e.model : null;
      default:
        if (e instanceof Enemy) {
          if (!e.alive) return models.alienExplosion;
          if (e.type === 'elite') return models.top[flapFrame];
          if (e.type === 'scout') return models.mid[flapFrame];
          return models.bottom[flapFrame];
        }
        return null;
    }
  }

  private showModel(view: EntityView, model: VoxelModel): void {
    const key = `${model.id}:${model.version}`;
    if (view.mesh && view.key === key) return;
    if (view.mesh) view.group.remove(view.mesh);
    view.mesh = new THREE.Mesh(this.geometryFor(model), this.materialFor(model));
    view.group.add(view.mesh);
    view.key = key;
  }

  private geometryFor(model: VoxelModel): THREE.BufferGeometry {
    const cached = this.geometries.get(model);
    if (cached && cached.version === model.version) return cached.geometry;
    cached?.geometry.dispose();
    const geometry = model.buildGeometry();
    this.geometries.set(model, { version: model.version, geometry });
    return geometry;
  }

  private forgetGeometry(model: VoxelModel): void {
    this.geometries.get(model)?.geometry.dispose();
    this.geometries.delete(model);
  }

  private materialFor(model: VoxelModel): THREE.MeshLambertMaterial {
    const hex = model.color.getHex();
    let material = this.materials.get(hex);
    if (!material) {
      material = new THREE.MeshLambertMaterial({ color: model.color });
      this.materials.set(hex, material);
    }
    return material;
  }
}
