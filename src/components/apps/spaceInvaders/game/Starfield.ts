import * as THREE from 'three';

const COUNT = 150;
const SPAWN_Z = -80;
const DESPAWN_Z = 18;
const MIN_SPEED = 40;
const MAX_SPEED = 90;
const STREAK_SECONDS = 0.05;
const FLICKER_PER_STAR = 0.03;
const FLICKER_MAX = 0.12;
const FLICKER_RADIUS = 16;

/**
 * Stars streaming past the camera as short streaks (port of invaders.Starfield).
 * Also reports how many are passing near the play area so the scene light can flicker.
 */
export class Starfield {
  readonly object: THREE.LineSegments;
  brightnessBoost = 0;

  private readonly x = new Float32Array(COUNT);
  private readonly y = new Float32Array(COUNT);
  private readonly z = new Float32Array(COUNT);
  private readonly speed = new Float32Array(COUNT);
  private readonly positions = new Float32Array(COUNT * 2 * 3);
  private readonly colors = new Float32Array(COUNT * 2 * 3);
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material = new THREE.LineBasicMaterial({ vertexColors: true });

  constructor() {
    for (let i = 0; i < COUNT; i++) {
      this.respawn(i);
      this.z[i] = SPAWN_Z + Math.random() * (DESPAWN_Z - SPAWN_Z);
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.object = new THREE.LineSegments(this.geometry, this.material);
    this.object.frustumCulled = false;
    this.writeBuffers();
  }

  private respawn(i: number): void {
    let sx: number;
    let sy: number;
    // Keep the lane in front of the camera clear so stars never cross the play field.
    do {
      sx = -30 + Math.random() * 60;
      sy = -14 + Math.random() * 32;
    } while (Math.abs(sx) < 11 && sy > -3 && sy < 5);
    this.x[i] = sx;
    this.y[i] = sy;
    this.z[i] = SPAWN_Z - Math.random() * 20;
    this.speed[i] = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
  }

  update(dt: number): void {
    let passing = 0;
    for (let i = 0; i < COUNT; i++) {
      this.z[i] += this.speed[i] * dt;
      if (this.z[i] > DESPAWN_Z) this.respawn(i);
      if (this.z[i] > -5 && this.z[i] < 12) {
        const dx = this.x[i];
        const dy = this.y[i] - 1;
        if (dx * dx + dy * dy < FLICKER_RADIUS * FLICKER_RADIUS) passing++;
      }
    }
    this.brightnessBoost = Math.min(FLICKER_MAX, passing * FLICKER_PER_STAR);
    this.writeBuffers();
  }

  private writeBuffers(): void {
    for (let i = 0; i < COUNT; i++) {
      const progress = (this.z[i] - SPAWN_Z) / (DESPAWN_Z - SPAWN_Z);
      const head = 0.35 + 0.65 * Math.min(1, progress * 1.6);
      const tailZ = this.z[i] - this.speed[i] * STREAK_SECONDS;
      const p = i * 6;
      // tail vertex (dim) → head vertex (bright)
      this.positions[p] = this.x[i]; this.positions[p + 1] = this.y[i]; this.positions[p + 2] = tailZ;
      this.positions[p + 3] = this.x[i]; this.positions[p + 4] = this.y[i]; this.positions[p + 5] = this.z[i];
      this.colors[p] = head * 0.25; this.colors[p + 1] = head * 0.28; this.colors[p + 2] = head * 0.4;
      this.colors[p + 3] = head * 0.85; this.colors[p + 4] = head * 0.9; this.colors[p + 5] = head;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
