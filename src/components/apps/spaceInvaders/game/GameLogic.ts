import { Bunker, Player, type Entity, type Projectile } from './entities';
import { EnemyFormation } from './EnemyFormation';
import { CollisionSystem } from './CollisionSystem';
import { barrier } from './Models';

export interface InputSource {
  isLeftPressed(): boolean;
  isRightPressed(): boolean;
  isFirePressed(): boolean;
  isRestartPressed(): boolean;
}

export type GameState = 'playing' | 'won' | 'lost';

/** Things worth a sound effect. */
export type GameEvent =
  | 'player_shot' | 'enemy_shot' | 'enemy_killed' | 'bunker_hit'
  | 'player_hit' | 'wave_cleared' | 'won' | 'lost';

const FIXED_DT = 1 / 60;
const PLAYER_Z = 9.0;
const ENEMY_DANGER_Z = 6.0;
const PROJECTILE_Z_MIN = -20;
const PROJECTILE_Z_MAX = 20;
const MAX_ACCUMULATED_DT = 0.25;
const WAVE_SPEED_STEP = 0.35;
const BUNKER_COUNT = 4;
const BUNKER_Z = 4.5;
const BUNKER_SPACING_X = 3.0;

/**
 * Fixed-timestep simulation (port of invaders.game.GameLogic): player, formation, bunkers,
 * projectiles, scoring and wave progression. Rendering reads `getRenderables()`.
 */
export class GameLogic {
  static readonly MAX_WAVES = 3;

  player: Player;
  formation: EnemyFormation;
  bunkers: Bunker[] = [];
  projectiles: Projectile[] = [];
  score = 0;
  state: GameState = 'playing';

  private readonly collisions = new CollisionSystem();
  private accumulator = 0;
  private wave = 1;

  constructor(private readonly input: InputSource, private readonly onEvent?: (event: GameEvent) => void) {
    this.player = new Player(0, 0, PLAYER_Z);
    this.formation = this.buildFormation();
    this.buildBunkers();
  }

  getWave(): number { return this.wave; }
  isGameOver(): boolean { return this.state !== 'playing'; }

  update(frameDeltaSeconds: number): void {
    if (this.state !== 'playing') {
      if (this.input.isRestartPressed()) this.restart();
      return;
    }

    this.accumulator = Math.min(this.accumulator + frameDeltaSeconds, MAX_ACCUMULATED_DT);
    while (this.accumulator >= FIXED_DT && this.state === 'playing') {
      this.step(FIXED_DT);
      this.accumulator -= FIXED_DT;
    }
  }

  /** Everything that should be drawn this frame: the player (alive or exploding), enemies alive or still exploding, intact bunkers, live shots. */
  getRenderables(): Entity[] {
    const all: Entity[] = [this.player];
    for (const e of this.formation.enemies) if (e.alive || e.deathTimer > 0) all.push(e);
    for (const b of this.bunkers) if (b.alive) all.push(b);
    for (const p of this.projectiles) if (p.alive) all.push(p);
    return all;
  }

  restart(): void {
    this.wave = 1;
    this.player = new Player(0, 0, PLAYER_Z);
    this.formation = this.buildFormation();
    this.buildBunkers();
    this.projectiles = [];
    this.score = 0;
    this.state = 'playing';
    this.accumulator = 0;
  }

  private step(dt: number): void {
    this.player.moveLeft = this.input.isLeftPressed();
    this.player.moveRight = this.input.isRightPressed();
    this.player.firing = this.input.isFirePressed();

    const playerShots = this.player.tick(dt);
    const enemyShots = this.formation.update(dt);
    if (playerShots.length) this.emit('player_shot');
    if (enemyShots.length) this.emit('enemy_shot');
    this.projectiles.push(...playerShots, ...enemyShots);

    for (const p of this.projectiles) p.update(dt);

    const result = this.collisions.resolve(this.player, this.formation, this.bunkers, this.projectiles);
    this.score += result.scoreGained;
    if (result.enemiesKilled) this.emit('enemy_killed');
    if (result.bunkerHits) this.emit('bunker_hit');
    if (result.playerWasHit && this.player.alive) this.emit('player_hit');

    for (const e of this.formation.enemies) {
      if (!e.alive && e.deathTimer > 0) e.deathTimer--;
    }

    this.projectiles = this.collisions.cullProjectiles(this.projectiles, PROJECTILE_Z_MIN, PROJECTILE_Z_MAX);

    if (!this.player.alive || this.formation.anyReached(ENEMY_DANGER_Z)) {
      this.state = 'lost';
      this.emit('lost');
    } else if (result.formationCleared) {
      if (this.wave < GameLogic.MAX_WAVES) {
        this.startNextWave();
        this.emit('wave_cleared');
      } else {
        this.state = 'won';
        this.emit('won');
      }
    }
  }

  private startNextWave(): void {
    this.wave++;
    this.formation = this.buildFormation();
    this.projectiles = [];
  }

  private buildFormation(): EnemyFormation {
    return new EnemyFormation(
      4, 8,
      2, 1.5,
      -7, 0, -12,
      9,
      1.5 * (1 + WAVE_SPEED_STEP * (this.wave - 1)),
      0.6,
    );
  }

  private buildBunkers(): void {
    const startX = -((BUNKER_COUNT - 1) * BUNKER_SPACING_X) / 2;
    this.bunkers = Array.from({ length: BUNKER_COUNT }, (_, i) => new Bunker(startX + i * BUNKER_SPACING_X, 0, BUNKER_Z, barrier()));
  }

  private emit(event: GameEvent): void {
    this.onEvent?.(event);
  }
}
