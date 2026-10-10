/* ---------- Contenu : ajoute des donjons ici ---------- */
/* Les textes sont des CLÉS de traduction (dans i18n/*.json). Le code reste en anglais. */
const DUNGEONS = [
  { id: 'd1', icon: '📜', rooms: [
    { id: 'd1r1', type: 'quiz', xp: 10, q: 'd1r1.q', opts: ['d1r1.a', 'd1r1.b', 'd1r1.c'], ans: 0 },
    { id: 'd1r2', type: 'code', xp: 15, q: 'd1r2.q', starter: 'name = ', expect: 'Merlin', check: 'print(name)' },
    { id: 'd1r3', type: 'quiz', xp: 10, q: 'd1r3.q', opts: ['d1r3.a', 'd1r3.b', 'd1r3.c'], ans: 1 },
    { id: 'd1boss', type: 'code', boss: true, xp: 40, q: 'd1boss.q', starter: 'hp = 10\n# your code\n', expect: '15', check: 'print(hp)' }
  ]},
  { id: 'd2', icon: '🔮', rooms: [
    { id: 'd2r1', type: 'quiz', xp: 10, q: 'd2r1.q', opts: ['d2r1.a', 'd2r1.b', 'd2r1.c'], ans: 2 },
    { id: 'd2r2', type: 'code', xp: 15, q: 'd2r2.q', starter: 'mana = 7\nif mana > 5:\n    ', expect: 'cast', check: '' },
    { id: 'd2boss', type: 'code', boss: true, xp: 40, q: 'd2boss.q', starter: 'x = 3\n', expect: 'odd', check: '' }
  ]},
  { id: 'd3', icon: '⚔️', rooms: [
    { id: 'd3r1', type: 'quiz', xp: 10, q: 'd3r1.q', opts: ['d3r1.a', 'd3r1.b', 'd3r1.c'], ans: 0 },
    { id: 'd3r2', type: 'code', xp: 15, q: 'd3r2.q', starter: 'for i in range(3):\n    ', expect: '0\n1\n2', check: '' },
    { id: 'd3boss', type: 'code', boss: true, xp: 40, q: 'd3boss.q', starter: '', expect: '1\n2\n3\n4\n5', check: '' }
  ]}
];

const BADGES = [
  { id: 'first', test: s => Object.keys(s.done).length >= 1 },
  { id: 'five', test: s => Object.keys(s.done).length >= 5 },
  { id: 'boss', test: s => Object.keys(s.done).some(k => k.includes('boss')) }
];

/* ---------- État & sauvegarde ---------- */
let S = JSON.parse(localStorage.getItem('pq_save') || 'null') ||
  { xp: 0, done: {}, badges: [], streak: 0, last: '', theme: 'dark' };
const save = () => localStorage.setItem('pq_save', JSON.stringify(S));
const level = () => Math.floor(S.xp / 100) + 1;

function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (S.last === today) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak = S.last === y ? S.streak + 1 : 1;
  S.last = today;
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function confetti() {
  const c = document.getElementById('confetti'), x = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const p = Array.from({ length: 90 }, () => ({ x: Math.random() * c.width, y: -10, v: 2 + Math.random() * 4, r: 3 + Math.random() * 4, h: Math.random() * 360 }));
  let n = 0;
  (function f() {
    x.clearRect(0, 0, c.width, c.height);
    p.forEach(o => { o.y += o.v; x.fillStyle = 'hsl(' + o.h + ',90%,60%)'; x.fillRect(o.x, o.y, o.r, o.r); });
    if (++n < 120) requestAnimationFrame(f); else x.clearRect(0, 0, c.width, c.height);
  })();
}

function award(room) {
  if (S.done[room.id]) return;
  const before = level();
  S.done[room.id] = true; S.xp += room.xp; touchStreak();
  let big = !!room.boss;
  if (level() > before) { big = true; toast(t('toast.level', { n: level() })); }
  BADGES.forEach(b => { if (!S.badges.includes(b.id) && b.test(S)) { S.badges.push(b.id); big = true; toast(t('toast.badge', { name: t('badge.' + b.id) })); } });
  save(); if (big) confetti(); header();
}

function header() {
  document.getElementById('stat-level').textContent = t('stat.level', { n: level() });
  document.getElementById('stat-streak').textContent = '🔥 ' + S.streak;
  document.getElementById('xpfill').style.width = (S.xp % 100) + '%';
}

/* ---------- Pyodide (vrai Python dans le navigateur) ---------- */
let pyPromise = null;
function py() { return pyPromise || (pyPromise = loadPyodide()); }
async function runPython(code) {
  const p = await py();
  p.runPython('import sys,io\n_buf=io.StringIO()\nsys.stdout=_buf');
  try { p.runPython(code); } catch (e) { return { err: String(e).split('\n').slice(-2).join('\n') }; }
  return { out: p.runPython('_buf.getvalue()').trim() };
}

/* ---------- Vues ---------- */
const view = document.getElementById('view');
function dungeonUnlocked(i) {
  return i === 0 || DUNGEONS[i - 1].rooms.every(r => S.done[r.id]);
}

function showMap() {
  view.innerHTML = '<h2>' + t('menu.map') + '</h2>';
  DUNGEONS.forEach((d, i) => {
    const n = d.rooms.filter(r => S.done[r.id]).length;
    const el = document.createElement('div');
    el.className = 'card dungeon' + (dungeonUnlocked(i) ? '' : ' locked');
    el.innerHTML = '<div class="ico">' + d.icon + '</div><div><h3>' + t(d.id + '.name') + '</h3><small>' + n + '/' + d.rooms.length + '</small></div>';
    el.onclick = () => showDungeon(d);
    view.appendChild(el);
  });
}

function showDungeon(d) {
  view.innerHTML = '<h2>' + d.icon + ' ' + t(d.id + '.name') + '</h2><p>' + t(d.id + '.intro') + '</p>';
  d.rooms.forEach(r => {
    const el = document.createElement('div');
    el.className = 'card room' + (S.done[r.id] ? ' done' : '') + (r.boss ? ' boss' : '');
    el.innerHTML = '<span>' + (r.boss ? '👹 ' + t('room.boss') : '🚪 ' + t('room.room')) + '</span><span>' + (S.done[r.id] ? '✅' : '+' + r.xp + ' XP') + '</span>';
    el.onclick = () => showRoom(d, r);
    view.appendChild(el);
  });
  addBack(showMap);
}

function addBack(fn) {
  const b = document.createElement('button');
  b.className = 'btn alt'; b.textContent = t('btn.back'); b.onclick = fn;
  view.appendChild(b);
}

function showRoom(d, r) {
  view.innerHTML = '<div class="card"><h2>' + (r.boss ? '👹 ' : '') + t(r.q) + '</h2><div id="body"></div><div id="fb" class="fb"></div></div>';
  const body = document.getElementById('body'), fb = document.getElementById('fb');
  const ok = () => { fb.className = 'fb ok'; fb.textContent = t('fb.ok', { xp: r.xp }); award(r); };
  const ko = m => { fb.className = 'fb bad'; fb.textContent = m || t('fb.ko'); };

  if (r.type === 'quiz') {
    r.opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'opt'; b.textContent = t(o);
      b.onclick = () => {
        body.querySelectorAll('.opt').forEach(x => x.classList.remove('ok', 'bad'));
        if (i === r.ans) { b.classList.add('ok'); ok(); } else { b.classList.add('bad'); ko(); }
      };
      body.appendChild(b);
    });
  } else {
    body.innerHTML = '<textarea id="code" spellcheck="false" autocapitalize="off" autocorrect="off"></textarea><button class="btn" id="run">' + t('btn.run') + '</button><pre class="out" id="out"></pre>';
    document.getElementById('code').value = r.starter;
    document.getElementById('run').onclick = async () => {
      const out = document.getElementById('out');
      out.textContent = t('py.loading');
      const code = document.getElementById('code').value + '\n' + (r.check || '');
      const res = await runPython(code);
      if (res.err) { out.textContent = res.err; return ko(); }
      out.textContent = res.out;
      res.out === r.expect || (r.expect === 'cast' && res.out) ? ok() : ko(t('fb.expected', { v: r.expect }));
    };
  }
  addBack(() => showDungeon(d, null));
}

function showProfile() {
  view.innerHTML = '<h2>' + t('menu.profile') + '</h2><div class="card">' + t('stat.level', { n: level() }) + ' — ' + S.xp + ' XP<br>🔥 ' + S.streak + '</div><h3>' + t('profile.badges') + '</h3>';
  BADGES.forEach(b => {
    const has = S.badges.includes(b.id);
    view.innerHTML += '<div class="card" style="opacity:' + (has ? 1 : .4) + '">🏅 ' + t('badge.' + b.id) + '</div>';
  });
}

function showSettings() {
  view.innerHTML = '<h2>' + t('menu.settings') + '</h2><div class="card"><label>' + t('set.lang') + '</label><select id="lang"></select></div>' +
    '<div class="card"><button class="btn alt" id="theme">' + t('set.theme') + '</button></div>' +
    '<div class="card"><button class="btn alt" id="exp">' + t('set.export') + '</button><button class="btn alt" id="imp">' + t('set.import') + '</button><button class="btn alt" id="rst">' + t('set.reset') + '</button></div>';
  const sel = document.getElementById('lang');
  for (const k in I18N.supported) sel.innerHTML += '<option value="' + k + '"' + (k === I18N.lang ? ' selected' : '') + '>' + I18N.supported[k] + '</option>';
  sel.onchange = async () => { await I18N.load(sel.value); header(); showSettings(); };
  document.getElementById('theme').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
  document.getElementById('exp').onclick = () => { prompt(t('set.copy'), btoa(JSON.stringify(S))); };
  document.getElementById('imp').onclick = () => { const v = prompt(t('set.paste')); if (v) { try { S = JSON.parse(atob(v)); save(); header(); toast('OK'); } catch (e) { toast('Error'); } } };
  document.getElementById('rst').onclick = () => { if (confirm(t('set.confirm'))) { localStorage.removeItem('pq_save'); location.reload(); } };
}

function applyTheme() { document.body.classList.toggle('light', S.theme === 'light'); }

document.querySelectorAll('#tabs button').forEach(b => b.onclick = () => {
  document.querySelectorAll('#tabs button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  ({ map: showMap, profile: showProfile, settings: showSettings })[b.dataset.tab]();
});

(async function start() {
  applyTheme();
  await I18N.load();
  header(); showMap();
  document.querySelector('#tabs button').classList.add('on');
})();
