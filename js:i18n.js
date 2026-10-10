const I18N = {
  lang: localStorage.getItem('pq_lang') || (navigator.language || 'fr').slice(0, 2),
  dict: {}, fallback: {},
  supported: { fr: 'Français', en: 'English', de: 'Deutsch' },
  async load(lang) {
    lang = lang || this.lang;
    if (!this.supported[lang]) lang = 'fr';
    this.fallback = await (await fetch('i18n/fr.json')).json();
    try { this.dict = await (await fetch('i18n/' + lang + '.json')).json(); }
    catch (e) { this.dict = this.fallback; }
    this.lang = lang;
    localStorage.setItem('pq_lang', lang);
    document.documentElement.lang = lang;
    this.apply();
  },
  t(key, vars) {
    let s = this.dict[key] ?? this.fallback[key] ?? key;
    for (const k in (vars || {})) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  },
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = this.t(el.dataset.i18n));
  }
};
const t = (k, v) => I18N.t(k, v);