import * as THREE from 'three';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * A 2-D bitmap ('#' = solid) extruded into a grid of small boxes.
 * Port of invaders.model.VoxelModel: same cell layout, same voxel size (0.46 × unit per side),
 * same local→grid mapping used for bunker damage.
 */
export class VoxelModel {
  private static nextId = 1;

  readonly id = VoxelModel.nextId++;
  readonly rows: number;
  readonly cols: number;
  readonly unit: number;
  readonly color: THREE.Color;
  /** Incremented whenever the grid changes so the renderer rebuilds the geometry. */
  version = 0;

  private readonly grid: boolean[][];
  private readonly voxelHalf: number;
  private readonly depthHalf: number;

  constructor(bitmap: string[], unit: number, depth: number, color: RGB) {
    this.rows = bitmap.length;
    this.cols = Math.max(...bitmap.map((row) => row.length));
    this.grid = bitmap.map((row) => Array.from({ length: this.cols }, (_, col) => row[col] === '#'));
    this.unit = unit;
    this.voxelHalf = unit * 0.46;
    this.depthHalf = depth * 0.5;
    this.color = new THREE.Color(color.r, color.g, color.b);
  }

  width(): number { return this.cols * this.unit; }
  height(): number { return this.rows * this.unit; }

  /** Local x offset (relative to the model centre) → grid column. May be out of range; check with isSolid(). */
  colForLocalX(localX: number): number {
    return Math.round(localX / this.unit + (this.cols - 1) * 0.5);
  }

  /** Local y offset (relative to the model centre) → grid row. May be out of range; check with isSolid(). */
  rowForLocalY(localY: number): number {
    return Math.round((this.rows - 1) * 0.5 - localY / this.unit);
  }

  isSolid(row: number, col: number): boolean {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return false;
    return this.grid[row][col];
  }

  /** Clears every cell within `radius` (Euclidean) of (row, col). */
  destroyAt(row: number, col: number, radius: number): void {
    const r2 = radius * radius;
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (dr * dr + dc * dc > r2) continue;
        const rr = row + dr;
        const cc = col + dc;
        if (rr < 0 || rr >= this.rows || cc < 0 || cc >= this.cols) continue;
        this.grid[rr][cc] = false;
      }
    }
    this.version++;
  }

  isFullyDestroyed(): boolean {
    return this.grid.every((row) => row.every((solid) => !solid));
  }

  /**
   * One box per solid cell, centred on the model origin exactly like the Java draw():
   * x = (col − (cols−1)/2)·unit, y = ((rows−1)/2 − row)·unit, z = 0.
   */
  buildGeometry(): THREE.BufferGeometry {
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    const xOffset = (this.cols - 1) * 0.5;
    const yOffset = (this.rows - 1) * 0.5;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (!this.grid[row][col]) continue;
        appendBox(
          positions, normals, indices,
          (col - xOffset) * this.unit, (yOffset - row) * this.unit, 0,
          this.voxelHalf, this.voxelHalf, this.depthHalf,
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);
    return geometry;
  }
}

// Face normals and counter-clockwise (outward-facing) corner order, as in VoxelModel.drawBox().
const FACES: { n: [number, number, number]; v: [number, number, number][] }[] = [
  { n: [0, 0, 1],  v: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] },
  { n: [0, 0, -1], v: [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]] },
  { n: [0, 1, 0],  v: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]] },
  { n: [0, -1, 0], v: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] },
  { n: [1, 0, 0],  v: [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]] },
  { n: [-1, 0, 0], v: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
];

function appendBox(
  positions: number[], normals: number[], indices: number[],
  cx: number, cy: number, cz: number,
  hx: number, hy: number, hz: number,
): void {
  for (const face of FACES) {
    const base = positions.length / 3;
    for (const [sx, sy, sz] of face.v) {
      positions.push(cx + sx * hx, cy + sy * hy, cz + sz * hz);
      normals.push(face.n[0], face.n[1], face.n[2]);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
}
