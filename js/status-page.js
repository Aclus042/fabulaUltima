/* ═══════════════════════════════════════════════════════════════
   status-page.js — JRPG Status Screen Logic
   Fabula Ultima – Tela de Status
═══════════════════════════════════════════════════════════════ */

'use strict';

(() => {

  // ─────────────────────────────────────────────────
  // CONSTANTS
  // ─────────────────────────────────────────────────

  const ATTR_CONFIG = [
    { id: 'des', abrev: 'DES', nome: 'Destreza',  cor: '#c9a84c' },
    { id: 'ast', abrev: 'AST', nome: 'Astúcia',   cor: '#3d6a8a' },
    { id: 'vig', abrev: 'VIG', nome: 'Vigor',     cor: '#5a8a5e' },
    { id: 'von', abrev: 'VON', nome: 'Vontade',   cor: '#7a4a8a' },
  ];

  const ATTR_DADOS = ['', 'd6', 'd8', 'd10', 'd12'];

  const CLASS_ICON_PATH = {
    arcanista:         'assets/icons/class/arcanista.png',
    andarilho:         'assets/icons/class/andarilho.png',
    atirador:          'assets/icons/class/atirador.png',
    elementalista:     'assets/icons/class/elementalista.png',
    entropista:        'assets/icons/class/entropista.png',
    erudito:           'assets/icons/class/erudito.png',
    espiritualista:    'assets/icons/class/espiritualista.png',
    furioso:           'assets/icons/class/furioso.png',
    guardiao:          'assets/icons/class/guardiao.png',
    guerreiro_sombrio: 'assets/icons/class/guerreiro sombrio.png',
    inventor:          'assets/icons/class/inventor.png',
    ladino:            'assets/icons/class/ladino.png',
    mestre_de_armas:   'assets/icons/class/mestre de armas.png',
    orador:            'assets/icons/class/orador.png',
    quimerista:        'assets/icons/class/quimerista.png',
  };

  const ITEM_ICONS = {
    arma:       '⚔️',
    armadura:   '🛡️',
    consumivel: '🧪',
    acessorio:  '💍',
    misc:       '📦',
  };

  // ─────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────

  function _el(id) { return document.getElementById(id); }

  function _escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function _classIconHTML(cls, size, extraClass) {
    const src = CLASS_ICON_PATH[cls.id] || '';
    if (!src) return '<span aria-hidden="true">■</span>';
    return `<img class="${extraClass}" src="${src}" alt="${_escape(cls.nome)}" width="${size}" height="${size}" loading="lazy" />`;
  }

  // ─────────────────────────────────────────────────
  // RENDER — HEADER
  // ─────────────────────────────────────────────────

  function renderHeader() {
    const state = State.get();
    const id    = state.identidade;

    // Name & Level
    _el('spName').textContent  = id.nome || '—';
    _el('spLevel').textContent = id.nivel || 1;

    // Avatar
    const avatarEl = _el('spAvatar');
    if (id.avatarImg) {
      avatarEl.innerHTML = `<img src="${_escape(id.avatarImg)}" alt="Avatar" />`;
    } else {
      const letter = (id.nome || '?')[0].toUpperCase();
      avatarEl.innerHTML = `<span class="sp-avatar-letter">${_escape(letter)}</span>`;
    }

    // Class icons
    const iconsEl = _el('spClassIcons');
    const selected = state.classes.map(cid => getClassById(cid)).filter(Boolean);
    if (selected.length) {
      iconsEl.innerHTML = selected
        .map(cls => _classIconHTML(cls, 28, 'sp-class-icon'))
        .join('');
    } else {
      iconsEl.innerHTML = '<span class="sp-no-class">—</span>';
    }
  }

  // ─────────────────────────────────────────────────
  // RENDER — HUD (HP / MP / IP + Derived)
  // ─────────────────────────────────────────────────

  function renderHUD() {
    const state   = State.get();
    const res     = state.recursos;
    const derived = Computed.all();

    // HP
    const pvAtual = res.pv.atual;
    const pvMax   = derived.pvMax;
    _el('spHP-atual').value = pvAtual;
    _el('spHP-max').textContent = pvMax;
    _el('spBarHP').style.width = pvMax > 0 ? `${Math.min(100, (pvAtual / pvMax) * 100)}%` : '0%';

    // MP
    const pmAtual = res.pm.atual;
    const pmMax   = derived.pmMax;
    _el('spMP-atual').value = pmAtual;
    _el('spMP-max').textContent = pmMax;
    _el('spBarMP').style.width = pmMax > 0 ? `${Math.min(100, (pmAtual / pmMax) * 100)}%` : '0%';

    // IP
    const ipAtual = res.ip.atual;
    const ipMax   = res.ip.max;
    _el('spIP-atual').value = ipAtual;
    _el('spIP-max').textContent = ipMax;
    _el('spBarIP').style.width = ipMax > 0 ? `${Math.min(100, (ipAtual / ipMax) * 100)}%` : '0%';

    // Derived
    _el('spInit').textContent   = derived.iniciativa;
    _el('spDef').textContent    = derived.defesa;
    _el('spResMag').textContent = derived.resMagica;
  }

  // ─────────────────────────────────────────────────
  // RENDER — ATTRIBUTES
  // ─────────────────────────────────────────────────

  function renderAttributes() {
    const attrs = State.get('atributos');
    const list  = _el('spAttrsList');
    list.innerHTML = '';

    ATTR_CONFIG.forEach(attr => {
      const nivel = attrs[attr.id]?.nivel || 1;
      const dado  = ATTR_DADOS[Math.min(nivel, 4)];

      const row = document.createElement('div');
      row.className = 'sp-attr-row';
      row.title = attr.nome;
      row.innerHTML = `
        <span class="sp-attr-abrev" style="color:${attr.cor}">${attr.abrev}</span>
        <span class="sp-attr-dots"></span>
        <div class="sp-attr-die-bg" data-die="${dado}">
          <span class="sp-attr-die">${dado}</span>
        </div>
      `;
      list.appendChild(row);
    });
  }

  // ─────────────────────────────────────────────────
  // RENDER — SKILLS
  // ─────────────────────────────────────────────────

  let _selectedSkillId = null;

  function renderSkills() {
    const state   = State.get();
    const list    = _el('spSkillsList');
    list.innerHTML = '';

    // Gather only learned skills
    const learnedIds = state.habilidades || [];
    const skills = [];
    learnedIds.forEach(skillId => {
      const skill = getSkillById(skillId);
      if (!skill) return;
      const cls = getClassById(skill.classe);
      if (cls) skills.push({ ...skill, _cls: cls });
    });

    if (skills.length === 0) {
      list.innerHTML = '<div class="sp-empty">Nenhuma habilidade disponível.</div>';
      return;
    }

    skills.forEach(skill => {
      const typeStyle = getSkillTypeStyle(skill.tipo);
      const item = document.createElement('div');
      item.className = 'sp-skill-item' + (skill.id === _selectedSkillId ? ' selected' : '');
      item.dataset.skillId = skill.id;
      item.innerHTML = `
        ${_classIconHTML(skill._cls, 16, 'sp-skill-class-icon')}
        <span class="sp-skill-name">${_escape(skill.nome)}</span>
        <span class="sp-skill-cost">${_escape(skill.custo)}</span>
        <span class="sp-skill-type-dot" style="color:${typeStyle.border};background:${typeStyle.bg}" title="${_escape(typeStyle.label)}"></span>
      `;
      list.appendChild(item);
    });

    // Auto-select first if nothing selected
    if (!_selectedSkillId && skills.length > 0) {
      _selectedSkillId = skills[0].id;
      list.querySelector('.sp-skill-item')?.classList.add('selected');
      renderSkillDetail(_selectedSkillId);
    } else if (_selectedSkillId) {
      renderSkillDetail(_selectedSkillId);
    }
  }

  // ─────────────────────────────────────────────────
  // RENDER — SKILL DETAIL
  // ─────────────────────────────────────────────────

  function renderSkillDetail(skillId) {
    const body  = _el('spDetailBody');
    const skill = getSkillById(skillId);

    if (!skill) {
      body.innerHTML = `
        <div class="sp-detail-placeholder">
          <span class="sp-detail-cursor">►</span> Selecione uma habilidade
        </div>`;
      return;
    }

    const cls = getClassById(skill.classe);
    const typeStyle = getSkillTypeStyle(skill.tipo);

    let classTag = '';
    if (cls) {
      const iconSrc = CLASS_ICON_PATH[cls.id] || '';
      const iconImg = iconSrc
        ? `<img class="sp-tag-class-icon" src="${iconSrc}" alt="" />`
        : '';
      classTag = `<span class="sp-detail-tag sp-tag-class">${iconImg}${_escape(cls.nome)}</span>`;
    }

    body.innerHTML = `
      <div class="sp-detail-name">${_escape(skill.nome)}</div>
      <div class="sp-detail-tags">
        <span class="sp-detail-tag sp-tag-type" style="border-color:${typeStyle.border};color:${typeStyle.color}">${_escape(typeStyle.label)}</span>
        <span class="sp-detail-tag sp-tag-cost">${_escape(skill.custo)}</span>
        ${classTag}
      </div>
      <div class="sp-detail-desc">${_escape(skill.descricao)}</div>
      ${skill.detalhes ? `<div class="sp-detail-extra">${_escape(skill.detalhes)}</div>` : ''}
    `;
  }

  // ─────────────────────────────────────────────────
  // RENDER — INVENTORY
  // ─────────────────────────────────────────────────

  function renderInventory() {
    const inventario = State.get('inventario');
    const list       = _el('spInventoryList');
    list.innerHTML   = '';

    if (!inventario || inventario.length === 0) {
      list.innerHTML = '<div class="sp-empty">Inventário vazio.</div>';
      return;
    }

    inventario.forEach(item => {
      const icon = ITEM_ICONS[item.tipo] || '📦';
      const row  = document.createElement('div');
      row.className = 'sp-inv-item';
      row.innerHTML = `
        <span class="sp-inv-icon">${icon}</span>
        <span class="sp-inv-name">${_escape(item.nome)}</span>
        ${item.qtd > 1 ? `<span class="sp-inv-qty">x${item.qtd}</span>` : ''}
        <span class="sp-inv-type">${_escape(item.tipo)}</span>
      `;
      list.appendChild(row);
    });
  }

  function _applyHudInput(input) {
    const resId  = input.dataset.res;   // pv, pm, ip
    const raw    = input.value.trim();
    const derived = Computed.all();
    const maxMap  = { pv: derived.pvMax, pm: derived.pmMax, ip: State.get('recursos.ip.max') };
    const max     = maxMap[resId] || 999;
    const current = State.get(`recursos.${resId}.atual`);

    let next;
    if (/^[+\-]\d+$/.test(raw)) {
      next = current + parseInt(raw, 10);
    } else {
      const parsed = parseInt(raw, 10);
      if (isNaN(parsed)) { input.value = current; return; }
      next = parsed;
    }

    next = Math.max(0, Math.min(next, max));
    State.set(`recursos.${resId}.atual`, next);
    renderHUD();
  }

  // ─────────────────────────────────────────────────
  // RENDER ALL
  // ─────────────────────────────────────────────────

  function renderAll() {
    renderHeader();
    renderHUD();
    renderAttributes();
    renderSkills();
    renderInventory();
  }

  // ─────────────────────────────────────────────────
  // EVENTS
  // ─────────────────────────────────────────────────

  function initEvents() {
    // HUD resource editing
    const hudGrid = document.querySelector('.sp-hud-grid');
    hudGrid.addEventListener('focusin', e => {
      if (e.target.classList.contains('sp-hud-input')) {
        e.target.select();
      }
    });
    hudGrid.addEventListener('keydown', e => {
      if (e.target.classList.contains('sp-hud-input') && e.key === 'Enter') {
        e.preventDefault();
        _applyHudInput(e.target);
        e.target.blur();
      }
    });
    hudGrid.addEventListener('focusout', e => {
      if (e.target.classList.contains('sp-hud-input')) {
        _applyHudInput(e.target);
      }
    });

    // Skill selection
    _el('spSkillsList').addEventListener('click', e => {
      const item = e.target.closest('.sp-skill-item');
      if (!item) return;

      const skillId = item.dataset.skillId;
      _selectedSkillId = skillId;

      // Update selection visuals
      _el('spSkillsList').querySelectorAll('.sp-skill-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.skillId === skillId);
      });

      renderSkillDetail(skillId);
    });
  }

  // ─────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────

  State.init();
  initEvents();
  renderAll();

  // Re-render on storage change (sync between tabs)
  window.addEventListener('storage', e => {
    if (e.key === 'fabula_ultima_character') {
      State.init();
      renderAll();
    }
  });

})();
