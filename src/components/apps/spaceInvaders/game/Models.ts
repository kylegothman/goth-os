import { VoxelModel } from './VoxelModel';

// Bitmaps and colours are copied verbatim from invaders.model.Models.
const UNIT = 0.11;
const DEPTH = 0.18;

const WHITE = { r: 0.95, g: 0.95, b: 0.95 };
const SHIP_GREEN = { r: 0.2, g: 0.9, b: 0.4 };

export interface ModelSet {
  /** Elite invader (row 0), two flap frames. */
  top: [VoxelModel, VoxelModel];
  /** Scout invader (rows 1–2). */
  mid: [VoxelModel, VoxelModel];
  /** Grunt invader (row 3). */
  bottom: [VoxelModel, VoxelModel];
  ship: VoxelModel;
  shipExplosion: VoxelModel;
  alienExplosion: VoxelModel;
  ufo: VoxelModel;
  playerBolt: VoxelModel;
  boltCross: [VoxelModel, VoxelModel];
  boltZigzag: [VoxelModel, VoxelModel];
}

export function createModels(): ModelSet {
  return {
    top: [
      new VoxelModel([
        '...##...',
        '..####..',
        '.######.',
        '##.##.##',
        '########',
        '..#..#..',
        '.#.##.#.',
        '#.#..#.#',
      ], UNIT, DEPTH, WHITE),
      new VoxelModel([
        '...##...',
        '..####..',
        '.######.',
        '##.##.##',
        '########',
        '.#.##.#.',
        '#......#',
        '.#....#.',
      ], UNIT, DEPTH, WHITE),
    ],
    mid: [
      new VoxelModel([
        '..#.....#..',
        '...#...#...',
        '..#######..',
        '.##.###.##.',
        '###########',
        '#.#######.#',
        '#.#.....#.#',
        '...##.##...',
      ], UNIT, DEPTH, { r: 0.9, g: 0.95, b: 1.0 }),
      new VoxelModel([
        '..#.....#..',
        '#..#...#..#',
        '#.#######.#',
        '###.###.###',
        '###########',
        '.#########.',
        '..#.....#..',
        '.#.......#.',
      ], UNIT, DEPTH, { r: 0.9, g: 0.95, b: 1.0 }),
    ],
    bottom: [
      new VoxelModel([
        '...#####...',
        '.#########.',
        '###########',
        '###.###.###',
        '###########',
        '...##.##...',
        '..##.#.##..',
        '##.......##',
      ], UNIT, DEPTH, { r: 0.85, g: 0.9, b: 0.98 }),
      new VoxelModel([
        '...#####...',
        '.#########.',
        '###########',
        '###.###.###',
        '###########',
        '..##.#.##..',
        '.#.##.##.#.',
        '#.#.....#.#',
      ], UNIT, DEPTH, { r: 0.85, g: 0.9, b: 0.98 }),
    ],
    ship: new VoxelModel([
      '......#......',
      '.....###.....',
      '.....###.....',
      '.###########.',
      '#############',
      '#############',
    ], 0.11, 0.22, SHIP_GREEN),
    shipExplosion: new VoxelModel([
      '...#...#..#..',
      '.#...#...#...',
      '..#..#.#..#..',
      '.#.#######.#.',
      '#.##########.',
      '.############',
    ], 0.11, 0.22, SHIP_GREEN),
    alienExplosion: new VoxelModel([
      '#..#..#',
      '.#.#.#.',
      '..###..',
      '###.###',
      '..###..',
      '.#.#.#.',
      '#..#..#',
    ], UNIT, DEPTH, { r: 1.0, g: 0.55, b: 0.05 }),
    ufo: new VoxelModel([
      '....#####....',
      '..#########..',
      '.###########.',
      '#.#.#.#.#.#.#',
      '..##.....##..',
    ], 0.11, 0.2, { r: 0.95, g: 0.25, b: 0.25 }),
    playerBolt: new VoxelModel(['#', '#', '#', '#'], 0.09, 0.09, { r: 1.0, g: 0.2, b: 0.2 }),
    boltCross: [
      new VoxelModel(['.#.', '###', '.#.', '.#.', '.#.'], 0.09, 0.09, WHITE),
      new VoxelModel(['.#.', '.#.', '###', '.#.', '.#.'], 0.09, 0.09, WHITE),
    ],
    boltZigzag: [
      new VoxelModel(['#..', '.#.', '..#', '.#.', '#..'], 0.09, 0.09, WHITE),
      new VoxelModel(['..#', '.#.', '#..', '.#.', '..#'], 0.09, 0.09, WHITE),
    ],
  };
}

/** Each bunker gets its own copy so damage to one never affects another. */
export function barrier(): VoxelModel {
  return new VoxelModel([
    '...#####...',
    '.#########.',
    '###########',
    '###########',
    '###########',
    '###.....###',
    '##.......##',
    '##.......##',
  ], 0.13, 0.22, { r: 0.2, g: 0.9, b: 0.3 });
}
