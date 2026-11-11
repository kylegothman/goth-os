import { Enemy, ENEMY_POINTS, type Bunker, type Player, type Projectile } from './entities';
import type { EnemyFormation } from './EnemyFormation';

export interface CollisionResult {
  scoreGained: number;
  enemiesKilled: number;
  bunkerHits: number;
  playerWasHit: boolean;
  formationCleared: boolean;
}

/** Port of invaders.game.CollisionSystem. */
export class CollisionSystem {
  resolve(player: Player, formation: EnemyFormation, bunkers: Bunker[], projectiles: Projectile[]): CollisionResult {
    const result: CollisionResult = {
      scoreGained: 0, enemiesKilled: 0, bunkerHits: 0, playerWasHit: false, formationCleared: false,
    };

    for (const p of projectiles) {
      if (!p.alive) continue;

      if (this.hitsBunker(p, bunkers)) {
        result.bunkerHits++;
        continue;
      }

      if (p.owner === 'player') {
        for (const e of formation.enemies) {
          if (!e.alive || !p.intersects(e)) continue;
          e.alive = false;
          e.deathTimer = Enemy.DEATH_DISPLAY_FRAMES; // show the explosion for ~0.5 s
          p.alive = false;
          result.scoreGained += ENEMY_POINTS[e.type];
          result.enemiesKilled++;
          break;
        }
      } else if (player.alive && p.intersects(player)) {
        p.alive = false;
        player.hit();
        result.playerWasHit = true;
      }
    }

    if (formation.allDead()) result.formationCleared = true;
    return result;
  }

  /** Broad-phase box test, then the bunker's own voxel test. Only a solid hit absorbs the shot. */
  private hitsBunker(p: Projectile, bunkers: Bunker[]): boolean {
    for (const b of bunkers) {
      if (!b.alive || !p.intersects(b)) continue;
      if (b.hitAt(p.x, p.y)) {
        p.alive = false;
        return true;
      }
    }
    return false;
  }

  cullProjectiles(projectiles: Projectile[], zMin: number, zMax: number): Projectile[] {
    return projectiles.filter((p) => p.alive && p.z >= zMin && p.z <= zMax);
  }
}
