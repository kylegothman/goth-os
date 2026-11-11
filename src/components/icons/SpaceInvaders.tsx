import '../svg.css';

// Pixel-art bitmaps: 'X' = lit pixel. Classic 11×8 "crab" invader (two animation frames)
// and the 13×8 laser cannon.
const INVADER_A = [
  '..X.....X..',
  '...X...X...',
  '..XXXXXXX..',
  '.XX.XXX.XX.',
  'XXXXXXXXXXX',
  'X.XXXXXXX.X',
  'X.X.....X.X',
  '...XX.XX...',
];
const INVADER_B = [
  '..X.....X..',
  'X..X...X..X',
  'X.XXXXXXX.X',
  'XXX.XXX.XXX',
  'XXXXXXXXXXX',
  '.XXXXXXXXX.',
  '..X.....X..',
  '.X.......X.',
];
const CANNON = [
  '......X......',
  '.....XXX.....',
  '.....XXX.....',
  '.XXXXXXXXXXX.',
  'XXXXXXXXXXXXX',
  'XXXXXXXXXXXXX',
  'XXXXXXXXXXXXX',
  'XXXXXXXXXXXXX',
];
const BOLT = ['X', 'X', 'X'];

// 5×5 pixel font, just the letters the title needs.
const FONT: Record<string, string[]> = {
  I: ['XXXXX', '..X..', '..X..', '..X..', 'XXXXX'],
  N: ['X...X', 'XX..X', 'X.X.X', 'X..XX', 'X...X'],
  V: ['X...X', 'X...X', 'X...X', '.X.X.', '..X..'],
  A: ['.XXX.', 'X...X', 'XXXXX', 'X...X', 'X...X'],
  D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'XXXX.'],
  E: ['XXXXX', 'X....', 'XXXX.', 'X....', 'XXXXX'],
  R: ['XXXX.', 'X...X', 'XXXX.', 'X.X..', 'X..XX'],
  S: ['.XXXX', 'X....', '.XXX.', '....X', 'XXXX.'],
};

/** One SVG path covering every lit pixel of a bitmap. */
function bitmapPath(bitmap: string[], x0: number, y0: number, size: number): string {
  let d = '';
  bitmap.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === 'X') {
        d += `M${(x0 + c * size).toFixed(2)} ${(y0 + r * size).toFixed(2)}h${size}v${size}h-${size}z`;
      }
    }
  });
  return d;
}

function textPath(text: string, x0: number, y0: number, size: number): string {
  return [...text].map((ch, i) => bitmapPath(FONT[ch] ?? [], x0 + i * 6 * size, y0, size)).join('');
}

// Same screen frame as the Pong icon so the two games line up in the dock.
const FRAME = { x: 0.5, y: 27.19, width: 124.9, height: 112.09 };
const CENTER_X = FRAME.x + FRAME.width / 2;

const TITLE_PX = 2.4;
const TITLE_X = CENTER_X - ('INVADERS'.length * 6 * TITLE_PX - TITLE_PX) / 2;

const INVADER_PX = 6;
const INVADER_X = CENTER_X - (INVADER_A[0].length * INVADER_PX) / 2;
const INVADER_Y = FRAME.y + 16;

const CANNON_PX = 3;
const CANNON_X = CENTER_X - (CANNON[0].length * CANNON_PX) / 2;
const CANNON_Y = FRAME.y + FRAME.height - 8 - CANNON.length * CANNON_PX;

const BOLT_PX = 2;
const BOLT_X = CENTER_X - BOLT_PX / 2;
const BOLT_Y = CANNON_Y - 10;

export default function SpaceInvaders() {
  return (
    <div className="space-invaders">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 0 160 160">
        <g shapeRendering="crispEdges">
          <path className="si-cls-1" d={textPath('INVADERS', TITLE_X, 1, TITLE_PX)} />
          <g id="si-invader">
            <path id="si-frame-a" className="si-cls-1" d={bitmapPath(INVADER_A, INVADER_X, INVADER_Y, INVADER_PX)} />
            <path id="si-frame-b" className="si-cls-1" d={bitmapPath(INVADER_B, INVADER_X, INVADER_Y, INVADER_PX)} />
          </g>
          <path id="si-bolt" className="si-cls-1" d={bitmapPath(BOLT, BOLT_X, BOLT_Y, BOLT_PX)} />
          <path id="si-cannon" className="si-cls-1" d={bitmapPath(CANNON, CANNON_X, CANNON_Y, CANNON_PX)} />
        </g>
        <rect className="si-cls-2" x={FRAME.x} y={FRAME.y} width={FRAME.width} height={FRAME.height} />
      </svg>
    </div>
  );
}
