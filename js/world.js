/* ---------- Monde : exploration vue du dessus (style Zelda / Pokémon) ---------- */
/* Légende des tuiles : . herbe, # mur, T arbre, ~ eau, g herbe haute (rencontres), D porte donjon, P chemin, @ départ */
const TILE = 32;
const MAPS = {
  village: {
    name: 'Village de Pyra',
    rows: [
      'TTTTTTTTTTTTTTTTTTTT',
      'T..................T',
      'T..PPPPPPPPPPPP....T',
      'T..P..........P....T',
      'T..P....~~~...P....T',
      'T..P....~~~...P....T',
      'T..PPPPPPPPPPPP....T',
      'T..........P.......T',
      'T..ggggg...P..ggg..T',
      'T..ggggg...P..ggg..T',
      'T..........P.......T',
      'TTTTTTTTTTTDTTTTTTTT'
    ],
    start: [11, 7],
    doors: { '11,11': { to: 'crypte', at: [10, 1] } }
  },
  crypte: {
    name: 'La Crypte des Variables',
    rows: [
      '####################',
      '#..................#',
      '#.PPPPPPPPPPPPPPPP.#',
      '#.P..............P.#',
      '#.P..gggggggg....P.#',
      '#.P..gggggggg....P.#',
      '#.P..............P.#',
      '#.PPPPPPPPPPPPPPPP.#',
      '#..................#',
      '#..................#',
      '#..................#',
      '########U###########'
    ],
    start: [10, 2],
    doors: { '8,11': { to: 'village', at: [11, 10] } }
  }
};

const WORLD = {
  map: 'village', x: 11, y: 7, canvas: null, ctx: null, running: false,
  steps: 0, onEncounter: null, onDoor: null,

  tile(x, y) {
    const m = MAPS[this.map];
    if (y < 0 || y >= m.rows.length || x < 0 || x >= m.rows[0].length) return '#';
    return m.rows[y][x];
  },
  solid(c) { return c === '#' || c === 'T' || c === '~'; },

  init(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    canvas.width = 20 * TILE; canvas.height = 12 * TILE;
    this.running = true; this.draw();
  },

  move(dx, dy) {
    if (!this.running) return;
    const nx = this.x + dx, ny = this.y + dy, c = this.tile(nx, ny);
    if (this.solid(c)) return;
    this.x = nx; this.y = ny; this.steps++;
    const door = MAPS[this.map].doors[nx + ',' + ny];
    if (door) { this.map = door.to; this.x = door.at[0]; this.y = door.at[1]; this.draw(); if (this.onDoor) this.onDoor(this.map); return; }
    this.draw();
    if (c === 'g' && Math.random() < 0.25 && this.onEncounter) this.onEncounter();
  },

  draw() {
    const g = this.ctx, m = MAPS[this.map];
    g.clearRect(0, 0, this.canvas.width, this.canvas.height);
    m.rows.forEach((row, y) => [...row].forEach((c, x) => {
      const px = x * TILE, py = y * TILE;
      const col = { '.': '#4a8c3f', '#': '#5a5470', 'T': '#2d5a27', '~': '#3b6fd4', 'g': '#2f7a2a', 'D': '#c9a227', 'U': '#c9a227', 'P': '#c8b27a' }[c] || '#4a8c3f';
      g.fillStyle = col; g.fillRect(px, py, TILE, TILE);
      if (c === 'T') { g.fillStyle = '#1d3d19'; g.beginPath(); g.arc(px + 16, py + 14, 13, 0, 7); g.fill(); }
      if (c === 'g') { g.fillStyle = '#58b34d'; for (let i = 0; i < 4; i++) g.fillRect(px + 4 + i * 7, py + 8 + (i % 2) * 8, 2, 10); }
      if (c === 'D' || c === 'U') { g.fillStyle = '#3a2a05'; g.fillRect(px + 8, py + 6, 16, 26); }
    }));
    g.font = '26px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('🧙', this.x * TILE + 16, this.y * TILE + 17);
  }
};

/* Contrôles : clavier + joystick tactile */
document.addEventListener('keydown', e => {
  const k = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
  if (k && WORLD.running) { e.preventDefault(); WORLD.move(k[0], k[1]); }
});
