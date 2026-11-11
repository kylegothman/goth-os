import type { VoxelModel } from './VoxelModel';

/** Axis-aligned box with a velocity (port of invaders.game.Entity). Units are world units / second. */
export class Entity {
  x: number;
  y: number;
  z: number;
  vx = 0;
  vy = 0;
  vz = 0;
  halfWidth = 0.5;
  halfHeight = 0.5;
  halfDepth = 0.5;
  alive = true;
  modelId = '';

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  update(dt: number): void {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;
  }

  intersects(other: Entity): boolean {
    return Math.abs(this.x - other.x) <= this.halfWidth + other.halfWidth
      && Math.abs(this.y - other.y) <= this.halfHeight + other.halfHeight
      && Math.abs(this.z - other.z) <= this.halfDepth + other.halfDepth;
  }
}

export type EnemyType = 'grunt' | 'scout' | 'elite';

export const ENEMY_POINTS: Record<EnemyType, number> = { grunt: 10, scout: 20, elite: 30 };

export class Enemy extends Entity {
  /** Frames the death explosion stays visible before the enemy leaves the render list (~0.5 s at 60 fps). */
  static readonly DEATH_DISPLAY_FRAMES = 30;

  deathTimer = 0;

  constructor(x: number, y: number, z: number, readonly type: EnemyType, readonly row: number, readonly col: number) {
    super(x, y, z);
    this.modelId = `enemy_${type}`;
    this.halfWidth = 0.5;
    this.halfHeight = 0.4;
    this.halfDepth = 0.5;
  }
}

export type ProjectileOwner = 'player' | 'enemy';

export class Projectile extends Entity {
  static readonly PLAYER_SPEED = 14;
  static readonly ENEMY_SPEED = 6;

  private constructor(x: number, y: number, z: number, readonly owner: ProjectileOwner, modelId: string) {
    super(x, y, z);
    this.halfWidth = 0.08;
    this.halfHeight = 0.08;
    this.halfDepth = 0.2;
    this.modelId = modelId;
  }

  static playerShot(x: number, y: number, z: number): Projectile {
    const p = new Projectile(x, y, z, 'player', 'player_bolt');
    p.vz = -Projectile.PLAYER_SPEED; // toward the enemies
    return p;
  }

  /** Elites fire the cross bolt; scouts and grunts fire the zigzag bolt. */
  static enemyShot(x: number, y: number, z: number, shooterType: EnemyType): Projectile {
    const modelId = shooterType === 'elite' ? 'enemy_bolt_cross' : 'enemy_bolt_zigzag';
    const p = new Projectile(x, y, z, 'enemy', modelId);
    p.vz = Projectile.ENEMY_SPEED; // toward the player
    return p;
  }
}

export class Player extends Entity {
  static readonly SPEED = 8;
  static readonly FIRE_COOLDOWN = 0.35;
  static readonly PLAY_AREA_HALF_WIDTH = 10;

  lives = 3;
  moveLeft = false;
  moveRight = false;
  firing = false;
  private fireCooldownRemaining = 0;

  constructor(x: number, y: number, z: number) {
    super(x, y, z);
    this.modelId = 'player_ship';
    this.halfWidth = 0.6;
    this.halfHeight = 0.3;
    this.halfDepth = 0.6;
  }

  /** Moves, clamps to the play field and returns any shot fired this tick. */
  tick(dt: number): Projectile[] {
    this.vx = 0;
    if (this.moveLeft) this.vx -= Player.SPEED;
    if (this.moveRight) this.vx += Player.SPEED;

    this.update(dt);

    if (this.x < -Player.PLAY_AREA_HALF_WIDTH) this.x = -Player.PLAY_AREA_HALF_WIDTH;
    if (this.x > Player.PLAY_AREA_HALF_WIDTH) this.x = Player.PLAY_AREA_HALF_WIDTH;

    if (this.fireCooldownRemaining > 0) this.fireCooldownRemaining -= dt;

    if (this.firing && this.fireCooldownRemaining <= 0) {
      this.fireCooldownRemaining = Player.FIRE_COOLDOWN;
      return [Projectile.playerShot(this.x, this.y, this.z)];
    }
    return [];
  }

  hit(): void {
    this.lives--;
    if (this.lives <= 0) this.alive = false;
  }
}

export class Bunker extends Entity {
  private static readonly MIN_DAMAGE_RADIUS = 0;
  private static readonly MAX_DAMAGE_RADIUS = 1;

  constructor(x: number, y: number, z: number, readonly model: VoxelModel) {
    super(x, y, z);
    this.modelId = 'bunker';
    this.halfWidth = 1.0;
    this.halfHeight = 0.7;
    this.halfDepth = 0.5;
  }

  /**
   * Narrow-phase hit test: true (and voxels destroyed) only if the impact lands on a still-solid cell.
   * A shot passing through an existing hole keeps flying.
   */
  hitAt(worldX: number, worldY: number): boolean {
    if (!this.alive) return false;

    const col = this.model.colForLocalX(worldX - this.x);
    const row = this.model.rowForLocalY(worldY - this.y);
    if (!this.model.isSolid(row, col)) return false;

    const span = Bunker.MAX_DAMAGE_RADIUS - Bunker.MIN_DAMAGE_RADIUS + 1;
    const radius = Bunker.MIN_DAMAGE_RADIUS + Math.floor(Math.random() * span);
    this.model.destroyAt(row, col, radius);
    if (this.model.isFullyDestroyed()) this.alive = false;
    return true;
  }
}
