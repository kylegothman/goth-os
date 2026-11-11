import { Enemy, Projectile, type EnemyType } from './entities';

const FIRE_INTERVAL_MIN = 0.36;
const FIRE_INTERVAL_MAX = 1.08;
const SHOT_X_JITTER = 0.35;
const SHOT_Y_JITTER = 0.3;
const MAX_SPEED_MULTIPLIER = 3.0;

/**
 * The marching grid of invaders (port of invaders.game.EnemyFormation): moves sideways as a block,
 * drops toward the player and reverses at the field edge, speeds up as it thins out, and fires at random.
 */
export class EnemyFormation {
  readonly enemies: Enemy[] = [];

  private currentDirection = 1;
  private dropCount = 0;
  private fireTimer: number;

  constructor(
    rows: number, cols: number,
    spacingX: number, spacingZ: number,
    originX: number, originY: number, originZ: number,
    private readonly fieldHalfWidth: number,
    private readonly baseSpeed: number,
    private readonly dropDistance: number,
  ) {
    for (let r = 0; r < rows; r++) {
      const type = pickTypeForRow(r);
      for (let c = 0; c < cols; c++) {
        this.enemies.push(new Enemy(originX + c * spacingX, originY, originZ + r * spacingZ, type, r, c));
      }
    }
    this.fireTimer = nextFireDelay();
  }

  private currentSpeed(): number {
    const total = this.enemies.length;
    const aliveCount = this.enemies.filter((e) => e.alive).length;
    const countMultiplier = total > 0 ? 1 + 2 * (1 - aliveCount / total) : 1;

    const rampedDrops = Math.max(0, this.dropCount - 3);
    const advanceMultiplier = 1 + 0.08 * Math.floor(rampedDrops / 2);

    return this.baseSpeed * Math.min(countMultiplier * advanceMultiplier, MAX_SPEED_MULTIPLIER);
  }

  /** Advances the formation one tick and returns any enemy shots fired. */
  update(dt: number): Projectile[] {
    const speed = this.currentSpeed();
    const hitEdge = this.enemies.some((e) => {
      if (!e.alive) return false;
      const nextX = e.x + this.currentDirection * speed * dt;
      return nextX > this.fieldHalfWidth || nextX < -this.fieldHalfWidth;
    });

    if (hitEdge) {
      this.currentDirection *= -1;
      this.dropCount++;
      for (const e of this.enemies) if (e.alive) e.z += this.dropDistance;
    } else {
      for (const e of this.enemies) if (e.alive) e.x += this.currentDirection * speed * dt;
    }

    const shots: Projectile[] = [];
    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      const shooter = this.pickRandomShooter();
      if (shooter) {
        const jitterX = (Math.random() * 2 - 1) * SHOT_X_JITTER;
        const jitterY = (Math.random() * 2 - 1) * SHOT_Y_JITTER;
        shots.push(Projectile.enemyShot(shooter.x + jitterX, shooter.y + jitterY, shooter.z, shooter.type));
      }
      this.fireTimer = nextFireDelay();
    }
    return shots;
  }

  private pickRandomShooter(): Enemy | null {
    const alive = this.enemies.filter((e) => e.alive);
    return alive.length ? alive[Math.floor(Math.random() * alive.length)] : null;
  }

  allDead(): boolean {
    return this.enemies.every((e) => !e.alive);
  }

  anyReached(zThreshold: number): boolean {
    return this.enemies.some((e) => e.alive && e.z >= zThreshold);
  }
}

function pickTypeForRow(row: number): EnemyType {
  if (row === 0) return 'elite';
  if (row <= 2) return 'scout';
  return 'grunt';
}

function nextFireDelay(): number {
  return FIRE_INTERVAL_MIN + Math.random() * (FIRE_INTERVAL_MAX - FIRE_INTERVAL_MIN);
}
