/* ---------- Combats style Pokémon : un exercice Python = une attaque ---------- */
const CREATURES = [
  { name: 'Gobelin Bug', icon: '👺', hp: 30, q: 'Quelle ligne crée une variable en Python ?', opts: ['x = 5', 'int x = 5;', 'var x := 5'], ans: 0 },
  { name: 'Slime Syntaxe', icon: '🟢', hp: 30, q: 'Que fait x += 1 ?', opts: ['Ajoute 1 à x', 'Remplace x par 1', 'Compare x à 1'], ans: 0 },
  { name: 'Chauve-souris Type', icon: '🦇', hp: 30, q: 'Quel est le type de 3.14 ?', opts: ['int', 'float', 'str'], ans: 1 },
  { name: 'Loup des Chaînes', icon: '🐺', hp: 30, q: 'Quel est le type de "Merlin" ?', opts: ['str', 'int', 'bool'], ans: 0 }
];

const BATTLE = {
  hero: { hp: 50, max: 50 }, foe: null, el: null, done: null,

  start(el, done) {
    this.el = el; this.done = done;
    const c = CREATURES[Math.floor(Math.random() * CREATURES.length)];
    this.foe = { ...c, max: c.hp }; this.hero.hp = Math.max(this.hero.hp, 20);
    this.render('Une créature sauvage apparaît !');
  },

  bar(hp, max) { return '<div class="hpbar"><div style="width:' + Math.max(0, hp / max * 100) + '%"></div></div>'; },

  render(msg) {
    const f = this.foe, h = this.hero;
    this.el.innerHTML = '<div class="battle"><div class="foe">' + f.icon + '<b>' + f.name + '</b>' + this.bar(f.hp, f.max) + '</div>' +
      '<div class="me">🧙 <b>Toi</b> ' + h.hp + '/' + h.max + this.bar(h.hp, h.max) + '</div>' +
      '<p class="msg">' + msg + '</p><h3>' + f.q + '</h3><div id="bopts"></div></div>';
    const box = document.getElementById('bopts');
    f.opts.forEach((o, i) => {
      const b = document.createElement('button'); b.className = 'opt'; b.textContent = o;
      b.onclick = () => this.answer(i); box.appendChild(b);
    });
  },

  answer(i) {
    const f = this.foe, h = this.hero;
    if (i === f.ans) { f.hp -= 30; } else { h.hp -= 15; }
    if (f.hp <= 0) { this.el.innerHTML = '<div class="battle"><h2>Victoire ! 🎉</h2><p>+20 XP</p><button class="btn" id="bend">Continuer</button></div>'; document.getElementById('bend').onclick = () => this.done(true); return; }
    if (h.hp <= 0) { h.hp = h.max; this.el.innerHTML = '<div class="battle"><h2>Tu es K.O.…</h2><p>Tu te réveilles au village, soigné.</p><button class="btn" id="bend">Continuer</button></div>'; document.getElementById('bend').onclick = () => this.done(false); return; }
    this.render(i === f.ans ? 'Sort réussi ! La créature vacille.' : 'Raté ! La créature t\'attaque (-15 PV).');
  }
};
