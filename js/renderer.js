/* ═══════════════════════════════════════════════════════════════
   renderer.js — Renderização de Interface (UI)
   Fabula Ultima – Ficha de Personagem
═══════════════════════════════════════════════════════════════ */

'use strict';

// ════════════════════════════════════════════════════════════
// RENDERER — MÓDULO PRINCIPAL
// ════════════════════════════════════════════════════════════

const Renderer = (() => {

  // ─────────────────────────────────────────────────
  // ATRIBUTOS CONFIG
  // ─────────────────────────────────────────────────

  const ATTR_CONFIG = [
    { id: 'des', nome: 'Destreza',  abrev: 'DES', cor: '#c9a84c', descExtra: 'Precisão, coordenação, agilidade, reflexos' },
    { id: 'ast', nome: 'Astúcia',   abrev: 'AST', cor: '#3d6a8a', descExtra: 'Observação, compreensão, raciocínio' },
    { id: 'vig', nome: 'Vigor',     abrev: 'VIG', cor: '#5a8a5e', descExtra: 'Capacidade física, robustez, resistência' },
    { id: 'von', nome: 'Vontade',   abrev: 'VON', cor: '#7a4a8a', descExtra: 'Determinação, carisma, disciplina' },
  ];

  const ATTR_DADOS = ['', 'd6', 'd8', 'd10', 'd12'];

  const CLASS_ICON_PATH = {
    arcanista: 'assets/icons/class/arcanista.png',
    andarilho: 'assets/icons/class/andarilho.png',
    atirador: 'assets/icons/class/atirador.png',
    elementalista: 'assets/icons/class/elementalista.png',
    entropista: 'assets/icons/class/entropista.png',
    erudito: 'assets/icons/class/erudito.png',
    espiritualista: 'assets/icons/class/espiritualista.png',
    furioso: 'assets/icons/class/furioso.png',
    guardiao: 'assets/icons/class/guardiao.png',
    guerreiro_sombrio: 'assets/icons/class/guerreiro sombrio.png',
    inventor: 'assets/icons/class/inventor.png',
    ladino: 'assets/icons/class/ladino.png',
    mestre_de_armas: 'assets/icons/class/mestre de armas.png',
    orador: 'assets/icons/class/orador.png',
    quimerista: 'assets/icons/class/quimerista.png',
  };

  function _classIconImg(cls, size = 24, extraClass = '') {
    const src = CLASS_ICON_PATH[cls.id] || '';
    if (!src) {
      return `<span class="${extraClass}" aria-hidden="true">■</span>`;
    }
    return `<img class="${extraClass}" src="${src}" alt="Ícone de ${_escape(cls.nome)}" width="${size}" height="${size}" loading="lazy" decoding="async" />`;
  }

  // ─────────────────────────────────────────────────
  // IDENTITY SUMMARY
  // ─────────────────────────────────────────────────

  function renderIdentitySummary() {
    const state   = State.get();
    const id      = state.identidade;

    _el('sumName').textContent     = id.nome  || '—';
    _el('sumLevel').textContent    = id.nivel  || 1;
    _el('sumFabula').textContent   = id.pontosFabula ?? 3;

    // Classes — icon-only row
    const classesRow = _el('sumClassesRow');
    const selectedClasses = state.classes.map(cid => getClassById(cid)).filter(Boolean);
    if (selectedClasses.length) {
      classesRow.innerHTML = selectedClasses
        .map(cls => _classIconImg(cls, 20, 'summary-class-icon'))
        .join('');
    } else {
      classesRow.innerHTML = '<span class="summary-no-class">—</span>';
    }

    // Avatar image
    _updateAvatarDisplay();
  }

  function _updateAvatarDisplay() {
    const avatarImg = _el('avatarImg');
    const avatarBtn = _el('changeAvatarBtn');
    const saved = State.get('identidade.avatarImg');
    if (saved) {
      avatarImg.src = saved;
      avatarImg.style.display = '';
      avatarBtn.textContent = 'Alterar Imagem';
    } else {
      avatarImg.style.display = 'none';
      avatarImg.src = '';
      avatarBtn.textContent = 'Adicionar Imagem';
    }
  }

  // ─────────────────────────────────────────────────
  // ATTRIBUTES
  // ─────────────────────────────────────────────────

  function renderAttributes() {
    const atributos = State.get('atributos');
    const grid      = _el('attributesGrid');
    grid.innerHTML  = '';

    ATTR_CONFIG.forEach(attr => {
      const nivel = atributos[attr.id]?.nivel || 1;
      const dado  = ATTR_DADOS[Math.min(nivel, 4)];

      // JRPG stat row: "DES .......... d8  [−] [+]"
      const card = _create('div', 'attr-card');
      card.style.setProperty('--attr-color', attr.cor);
      card.title = attr.descExtra;
      card.innerHTML = `
        <div class="attr-abbreviation">${attr.abrev}</div>
        <div class="attr-dots"></div>
        <div class="attr-die-display" id="attr-display-${attr.id}" data-die="${dado}">${dado}</div>
        <div class="attr-controls">
          <button class="attr-btn" data-attr="${attr.id}" data-dir="-1" title="Diminuir">−</button>
          <button class="attr-btn" data-attr="${attr.id}" data-dir="1"  title="Aumentar">+</button>
        </div>
      `;
      grid.appendChild(card);
    });

    renderDerivedStats();
  }

  function renderDerivedStats() {
    const derived  = Computed.all();
    const recursos = State.get('recursos');
    const equip    = State.get('equipamento') || {};
    const container = _el('attributesDerived');
    container.innerHTML = '';

    // Build armor/shield formula labels
    const armorId  = equip.armadura || 'sem_armadura';
    const shieldId = equip.escudo || null;
    const armor    = typeof getArmorById === 'function' ? getArmorById(armorId) : null;
    const shield   = shieldId && typeof getShieldById === 'function' ? getShieldById(shieldId) : null;

    let defFormula  = 'Dado DES';
    let mdefFormula = 'Dado AST';
    let initFormula = 'DES + AST';

    if (armor) {
      defFormula  = formatArmorStat(armor.defesa);
      mdefFormula = formatArmorStat(armor.defesaMagica);
      if (armor.iniciativa !== 0) initFormula += ` ${armor.iniciativa > 0 ? '+' : ''}${armor.iniciativa}`;
    }
    if (shield) {
      if (shield.defesa)       defFormula  += ` +${shield.defesa}`;
      if (shield.defesaMagica) mdefFormula += ` +${shield.defesaMagica}`;
      if (shield.iniciativa)   initFormula += ` ${shield.iniciativa > 0 ? '+' : ''}${shield.iniciativa}`;
    }

    const derivedConfig = [
      { id: 'pv',   label: 'PV',    max: derived.pvMax, atual: recursos.pv.atual, icon: 'assets/icons/stats/hp.png',      formula: 'Nível + Dado VIG × 5', editable: true },
      { id: 'pm',   label: 'PM',    max: derived.pmMax, atual: recursos.pm.atual, icon: 'assets/icons/stats/mp.png',      formula: 'Nível + Dado VON × 5', editable: true },
      { id: 'ip',   label: 'PI',    max: recursos.ip.max, atual: recursos.ip.atual, icon: 'assets/icons/stats/ip.png',    formula: 'Pontos de Invenção', editable: true },
      { id: 'init', label: 'Iniciativa',   value: derived.iniciativa, icon: 'assets/icons/stats/init.png',    formula: initFormula },
      { label: 'Defesa',       value: derived.defesa,    icon: 'assets/icons/stats/def.png',     formula: defFormula },
      { id: 'mdef', label: 'Res. Mágica',  value: derived.resMagica, icon: 'assets/icons/stats/def mag.png', formula: mdefFormula },
    ];

    derivedConfig.forEach(item => {
      const card = _create('div', 'derived-card');
      if (item.id) card.dataset.stat = item.id;

      if (item.editable) {
        card.innerHTML = `
          <div class="derived-icon"><img src="${item.icon}" alt="${item.label}" width="42" height="42" /></div>
          <div class="derived-info">
            <div class="derived-label">${item.label}</div>
            <div class="derived-formula">${item.formula}</div>
          </div>
          <div class="derived-editable">
            <input class="derived-input" id="derived-atual-${item.id}" type="text" value="${item.atual}" data-res="${item.id}" inputmode="numeric" />
            <span class="derived-sep">/</span>
            <span class="derived-max" id="derived-max-${item.id}">${item.max}</span>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="derived-icon"><img src="${item.icon}" alt="${item.label}" width="42" height="42" /></div>
          <div class="derived-info">
            <div class="derived-label">${item.label}</div>
            <div class="derived-formula">${item.formula}</div>
          </div>
          <div class="derived-value">${item.value}</div>
        `;
      }
      container.appendChild(card);
    });
  }

  // ─────────────────────────────────────────────────
  // CONDITIONS
  // ─────────────────────────────────────────────────

  const CONDITIONS_CONFIG = [
    { id: 'abalado',    nome: 'Abalado',    desc: '− VON' },
    { id: 'atordoado',  nome: 'Atordoado',  desc: '− AST' },
    { id: 'enfurecido', nome: 'Enfurecido', desc: '− DES, AST' },
    { id: 'envenenado', nome: 'Envenenado', desc: '− VIG, VON' },
    { id: 'fraco',      nome: 'Fraco',      desc: '− VIG' },
    { id: 'lento',      nome: 'Lento',      desc: '− DES' },
  ];

  function renderConditions() {
    const condicoes = State.get('condicoes');
    const grid = _el('conditionsGrid');
    grid.innerHTML = '';

    CONDITIONS_CONFIG.forEach(cond => {
      const active = condicoes[cond.id] || false;
      const row = _create('div', 'condition-row' + (active ? ' active' : ''));
      row.dataset.condition = cond.id;
      row.innerHTML = `
        <span class="condition-toggle">✕</span>
        <span class="condition-name">${cond.nome}</span>
        <span class="condition-desc">${cond.desc}</span>
      `;
      grid.appendChild(row);
    });
  }

  // ─────────────────────────────────────────────────
  // CLASSES
  // ─────────────────────────────────────────────────

  function renderClasses() {
    const selectedClasses = State.get('classes');
    const grid            = _el('classesGrid');

    grid.innerHTML = '';

    CLASSES.forEach(cls => {
      const isSelected = selectedClasses.includes(cls.id);
      const card = _create('div', `class-card${isSelected ? ' selected' : ''}`);
      card.style.setProperty('--class-color', cls.cor);
      card.dataset.classId = cls.id;

      card.innerHTML = `
        <div class="class-card-top">
          <div class="class-icon">${_classIconImg(cls, 28, 'class-icon-img')}</div>
          ${isSelected ? `<span class="class-selected-check">✔</span>` : ''}
        </div>
        <div class="class-card-info">
          <div class="class-card-name">${cls.nome}</div>
        </div>
      `;

      grid.appendChild(card);
    });

    renderSelectedClassesTags();
  }

  function renderClassDetailPanel(classId) {
    const cls = getClassById(classId);
    const body = _el('classDetailBody');
    const empty = _el('classDetailPanel')?.querySelector('.class-detail-empty');
    if (!body || !empty || !cls) return;

    const skills = cls.habilidades
      .map(skillId => getSkillById(skillId))
      .filter(Boolean)
      .slice(0, 6);

    empty.style.display = 'none';
    body.style.display = '';
    body.innerHTML = `
      <div style="display:flex;align-items:center;gap:var(--sp-3);">
        <div class="class-icon">${_classIconImg(cls, 36, 'modal-class-icon-img')}</div>
        <div>
          <div class="class-detail-name">${cls.nome}</div>
          <div class="class-detail-tier">${cls.tier}</div>
        </div>
      </div>
      ${cls.beneficioInicial ? `
        <div class="class-detail-desc" style="color:var(--color-gold);border-left:3px solid var(--color-gold-dim);padding-left:var(--sp-3);margin-top:var(--sp-2);"><strong>Benefício Inicial:</strong> ${cls.beneficioInicial}</div>
      ` : ''}
      <div class="class-detail-skill-list">
        ${skills.map(skill => `
          <button class="class-detail-skill" data-skill-open="${skill.id}" style="background:none;border:none;text-align:left;cursor:pointer;">
            <span>${skill.nome}</span>
            <span>${getSkillTypeStyle(skill.tipo).label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderSelectedClassesTags() {
    const selectedClasses = State.get('classes');
    const tagsContainer   = _el('selectedTags');
    tagsContainer.innerHTML = '';

    if (selectedClasses.length === 0) {
      tagsContainer.innerHTML = '<span class="tag-empty">Nenhuma classe selecionada</span>';
      return;
    }

    selectedClasses.forEach(classId => {
      const cls = getClassById(classId);
      if (!cls) return;

      const tag = _create('span', 'selected-class-tag');
      tag.style.setProperty('--class-color', cls.cor);
      tag.innerHTML = `
        ${_classIconImg(cls, 16, 'class-tag-icon')} ${cls.nome}
        <button class="tag-remove" data-remove-class="${classId}" aria-label="Remover ${cls.nome}">×</button>
      `;
      tagsContainer.appendChild(tag);
    });
  }

  // ─────────────────────────────────────────────────
  // SKILLS (HABILIDADES)
  // ─────────────────────────────────────────────────

  function renderSkills(filterClassId = 'all') {
    const selectedClasses = State.get('classes');
    const skillsGrid      = _el('skillsGrid');
    const skillsEmpty     = _el('skillsEmpty');
    const filterBar       = _el('skillsFilterBar');

    skillsGrid.innerHTML  = '';
    filterBar.innerHTML   = '';

    if (selectedClasses.length === 0) {
      skillsGrid.style.display  = 'none';
      skillsEmpty.style.display = '';
      filterBar.style.display   = 'none';
      return;
    }

    skillsGrid.style.display  = '';
    skillsEmpty.style.display = 'none';
    filterBar.style.display   = '';

    // Side panel title
    const sideTitle = _create('div', 'skills-side-title');
    sideTitle.textContent = 'Classes';
    filterBar.appendChild(sideTitle);

    // Default to first class if current filter is 'all' or invalid
    if (filterClassId === 'all' || !selectedClasses.includes(filterClassId)) {
      filterClassId = selectedClasses[0];
    }

    // Renderizar filtros
    selectedClasses.forEach(classId => {
      const cls = getClassById(classId);
      if (!cls) return;
      const btn = _create('button', `filter-btn${filterClassId === classId ? ' active' : ''}`);
      btn.innerHTML = `${_classIconImg(cls, 14, 'filter-class-icon')} ${cls.nome}`;
      btn.dataset.filterClass = classId;
      filterBar.appendChild(btn);
    });

    // Coletar skills a exibir
    const classesToShow = [filterClassId];
    const skillsToShow  = [];

    classesToShow.forEach(classId => {
      const cls = getClassById(classId);
      if (!cls) return;
      cls.habilidades.forEach(skillId => {
        const skill = getSkillById(skillId);
        if (skill) skillsToShow.push({ id: skillId, ...skill });
      });
    });

    if (skillsToShow.length === 0) {
      skillsGrid.innerHTML = '<p class="text-muted text-center" style="padding:2rem;font-style:italic;">Nenhuma habilidade encontrada.</p>';
      return;
    }

    // Panel title bar
    const panelTitle = _create('div', 'skills-panel-title');
    panelTitle.innerHTML = `
      <span>Habilidades</span>
      <span style="font-family:var(--font-ui);font-size:var(--vt-xs);color:var(--color-text-muted);">${skillsToShow.length} disponíveis</span>
    `;
    skillsGrid.appendChild(panelTitle);

    skillsToShow.forEach(skill => {
      const cls       = getClassById(skill.classe);
      const typeStyle = getSkillTypeStyle(skill.tipo);
      const learned   = (State.get('habilidades') || []).includes(skill.id);
      const card      = _create('div', `skill-card${learned ? ' skill-learned' : ''}`);
      card.style.setProperty('--skill-color', cls?.cor || 'var(--color-panel-border)');
      card.dataset.skillId = skill.id;

      const costIcon = _getCostIcon(skill.custo);

      // JRPG menu list row: ► Name ......... [TYPE] [COST]
      card.innerHTML = `
        <span class="skill-cursor">►</span>
        <div class="skill-card-name">${skill.nome}${skill.requisito ? ' <span style="color:var(--color-danger);font-size:0.75em;">*</span>' : ''}</div>
        <span class="skill-type-badge"
          style="--badge-bg:${typeStyle.bg};--badge-color:${typeStyle.color};--badge-border:${typeStyle.border}">
          ${typeStyle.label}
        </span>
        <div class="skill-card-cost">
          ${costIcon} ${skill.custo}
        </div>
      `;

      skillsGrid.appendChild(card);
    });

    // Arcanos section (only when Arcanista is the active filter)
    const filteredClass = getClassById(filterClassId);
    if (filteredClass && filteredClass.arcanos) {
      const arcanos = getAllArcanos();

      const arcanoTitle = _create('div', 'skills-panel-title arcano-panel-title');
      arcanoTitle.innerHTML = `
        <span>⬡ Arcanos</span>
        <span style="font-family:var(--font-ui);font-size:var(--vt-xs);color:var(--color-text-muted);">${arcanos.length} disponíveis</span>
      `;
      skillsGrid.appendChild(arcanoTitle);

      arcanos.forEach(arc => {
        const card = _create('div', 'arcano-skill-card');
        card.dataset.arcanoId = arc.id;
        card.innerHTML = `
          <img class="arcano-skill-icon" src="${arc.icone}" alt="${arc.nome}" width="32" height="32" loading="lazy" />
          <div class="arcano-skill-info">
            <div class="arcano-skill-name">${arc.nome}</div>
            <div class="arcano-skill-domains">${arc.dominios.join(' · ')}</div>
          </div>
        `;
        skillsGrid.appendChild(card);
      });
    }
  }

  function _getCostIcon(custo) {
    if (!custo || custo === '—') return '🔷';
    if (custo.startsWith('ç'))    return '🔶';
    if (custo.startsWith('PM'))   return '💙';
    if (custo.startsWith('IP'))   return '⭐';
    if (custo.startsWith('PV'))   return '❤️';
    return '🔷';
  }

  // ─────────────────────────────────────────────────
  // RESOURCES
  // ─────────────────────────────────────────────────

  const RESOURCE_CONFIG = [
    {
      id:       'pv',
      label:    'HP',
      subtitle: 'Pontos de Vida',
      icon:     'assets/icons/stats/hp.png',
      color:    '#f03050',
      colorDk:  '#800020',
      colorLt:  '#ff6080',
      border:   '#a01030',
      glow:     'rgba(240,48,80,0.5)',
    },
    {
      id:       'pm',
      label:    'MP',
      subtitle: 'Pontos de Magia',
      icon:     'assets/icons/stats/mp.png',
      color:    '#4090f8',
      colorDk:  '#0030a0',
      colorLt:  '#80c0ff',
      border:   '#2060b0',
      glow:     'rgba(64,144,248,0.5)',
    },
    {
      id:       'ip',
      label:    'IP',
      subtitle: 'Pontos de Invenção',
      icon:     'assets/icons/stats/ip.png',
      color:    '#a0e040',
      colorDk:  '#306000',
      colorLt:  '#c8ff60',
      border:   '#509010',
      glow:     'rgba(160,224,64,0.5)',
    },
  ];

  function renderResources() {
    const recursos  = State.get('recursos');
    const derived   = Computed.all();
    const grid      = _el('resourcesGrid');
    grid.innerHTML  = '';

    // Sincroniza maximos calculados
    const maxMap = { pv: derived.pvMax, pm: derived.pmMax, ip: recursos.ip.max };

    RESOURCE_CONFIG.forEach(res => {
      const atual    = recursos[res.id]?.atual ?? 0;
      const max      = maxMap[res.id] || recursos[res.id]?.max || 0;

      const card = _create('div', 'resource-card');
      card.dataset.resource = res.id;
      card.style.setProperty('--res-color',   res.color);
      card.style.setProperty('--res-colordk', res.colorDk);
      card.style.setProperty('--res-colorlt', res.colorLt);
      card.style.setProperty('--res-border',  res.border);
      card.style.setProperty('--res-glow',    res.glow);

      card.innerHTML = `
        <div class="resource-card-header">
          <div class="resource-title-group">
            <img class="resource-icon" src="${res.icon}" alt="${res.label}" width="30" height="30" style="filter:drop-shadow(0 0 6px ${res.glow});" />
            <div class="resource-title">${res.label}</div>
          </div>
        </div>
        <div class="resource-display">
          <div class="resource-ratio">
            <span class="resource-current" id="res-atual-${res.id}">${atual}</span>
            <span class="resource-separator">/</span>
            <span class="resource-max" id="res-max-${res.id}">${max}</span>
          </div>
          <div class="resource-btn-row">
            <button class="resource-big-btn" data-res="${res.id}" data-res-dir="-5" title="-5">−−</button>
            <button class="resource-big-btn" data-res="${res.id}" data-res-dir="-1" title="-1">−</button>
            <button class="resource-big-btn" data-res="${res.id}" data-res-dir="1" title="+1">+</button>
            <button class="resource-big-btn" data-res="${res.id}" data-res-dir="5" title="+5">++</button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    renderConditions();
  }

  function updateResourceDisplay(resId) {
    const recursos = State.get('recursos');
    const derived  = Computed.all();
    const maxMap   = { pv: derived.pvMax, pm: derived.pmMax, ip: recursos.ip.max };

    const atual   = recursos[resId]?.atual ?? 0;
    const max     = maxMap[resId] || recursos[resId]?.max || 0;

    const atualEl = _el(`derived-atual-${resId}`);
    const maxEl   = _el(`derived-max-${resId}`);

    if (atualEl) atualEl.value = atual;
    if (maxEl)   maxEl.textContent = max;
  }

  // ─────────────────────────────────────────────────
  // EQUIPMENT SUMMARY BAR
  // ─────────────────────────────────────────────────

  function renderEquipSummary() {
    const equip  = State.get('equipamento') || {};
    const el     = _el('equipSummary');
    if (!el) return;

    const armorId  = equip.armadura || 'sem_armadura';
    const shieldId = equip.escudo || null;
    const armor    = typeof getArmorById === 'function' ? getArmorById(armorId) : null;
    const shield   = shieldId && typeof getShieldById === 'function' ? getShieldById(shieldId) : null;
    const derived  = Computed.all();

    el.innerHTML = `
      <div class="equip-slot">
        <span class="equip-slot-label">Armadura</span>
        <span class="equip-slot-name">${armor ? _escape(armor.nome) : 'Nenhuma'}</span>
      </div>
      <div class="equip-slot">
        <span class="equip-slot-label">Escudo</span>
        <span class="equip-slot-name">${shield ? _escape(shield.nome) : '—'}</span>
        ${shield ? '<button class="equip-slot-remove" data-unequip-shield title="Remover">✕</button>' : ''}
      </div>
      <div class="equip-stats-row">
        <span class="equip-stat"><span class="equip-stat-label">DEF</span> <span class="equip-stat-val equip-stat-def">${derived.defesa}</span></span>
        <span class="equip-stat"><span class="equip-stat-label">D.M</span> <span class="equip-stat-val equip-stat-mdef">${derived.resMagica}</span></span>
        <span class="equip-stat"><span class="equip-stat-label">INIC</span> <span class="equip-stat-val">${derived.iniciativa}</span></span>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────
  // INVENTORY
  // ─────────────────────────────────────────────────

  const ITEM_ICONS = {
    arma:      '⚔️',
    armadura:  '🛡️',
    escudo:    '🔰',
    consumivel: '🧪',
    acessorio: '💍',
    misc:      '📦',
  };

  function renderInventory(filterType = 'all') {
    const inventario  = State.get('inventario');
    const grid        = _el('inventoryGrid');
    const emptyEl     = _el('inventoryEmpty');
    grid.innerHTML    = '';

    // Always update equipment summary
    renderEquipSummary();

    // Update active filter tab
    const tabs = document.querySelectorAll('[data-inv-filter]');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.invFilter === filterType));

    const filtered = filterType === 'all'
      ? inventario
      : inventario.filter(item => item.tipo === filterType);

    if (filtered.length === 0) {
      emptyEl.style.display = '';
      if (filterType !== 'all') {
        emptyEl.querySelector('p').textContent = `Nenhum item do tipo "${filterType}" encontrado.`;
      } else {
        emptyEl.querySelector('p').textContent = 'Nenhum item no inventário. Adicione itens com o botão acima.';
      }
      return;
    }

    emptyEl.style.display = 'none';

    filtered.forEach(item => {
      const icon = ITEM_ICONS[item.tipo] || '📦';
      const card = _create('div', 'inv-card');
      card.dataset.itemId = item.id;

      const isWeapon  = item.tipo === 'arma' && item.weaponId;
      const isArmor   = item.tipo === 'armadura' && item.armorId;
      const isShield  = item.tipo === 'escudo' && item.shieldId;
      const isEquipItem = isWeapon || isArmor || isShield;

      let statsHtml  = '';
      let tagExtra   = '';
      let actionBtns = '';

      if (isWeapon) {
        const w = getWeaponById(item.weaponId);
        if (w) {
          const prec = calcWeaponPrecisao(w);
          statsHtml = `<span class="inv-stat inv-stat-cyan">${prec.formula}</span><span class="inv-stat inv-stat-red">${formatWeaponDano(w)}</span><span class="inv-stat">${w.empunhadura === 'duas mãos' ? '2M' : '1M'}</span>`;
          tagExtra = _escape(w.categoria);
          actionBtns = `<button class="inv-action-btn" data-view-weapon="${item.weaponId}" title="Detalhes">🔍</button>`;
        }
      }

      if (isArmor) {
        const a = getArmorById(item.armorId);
        if (a) {
          const equipped = (State.get('equipamento.armadura') || 'sem_armadura') === a.id;
          statsHtml = `<span class="inv-stat inv-stat-cyan">DEF ${formatArmorStat(a.defesa)}</span><span class="inv-stat inv-stat-purple">D.M ${formatArmorStat(a.defesaMagica)}</span>`;
          if (equipped) tagExtra = '<span class="equipped-badge">EQUIP</span>';
          actionBtns = `<button class="inv-action-btn" data-view-armor="${item.armorId}" title="Detalhes">🔍</button>`;
          if (!equipped) actionBtns += `<button class="inv-action-btn" data-equip-armor="${item.armorId}" title="Equipar">⬆</button>`;
        }
      }

      if (isShield) {
        const s = getShieldById(item.shieldId);
        if (s) {
          const equipped = State.get('equipamento.escudo') === s.id;
          statsHtml = `<span class="inv-stat inv-stat-cyan">DEF +${s.defesa}</span><span class="inv-stat inv-stat-purple">D.M +${s.defesaMagica}</span>`;
          if (equipped) tagExtra = '<span class="equipped-badge">EQUIP</span>';
          actionBtns = `<button class="inv-action-btn" data-view-shield="${item.shieldId}" title="Detalhes">🔍</button>`;
          if (!equipped) actionBtns += `<button class="inv-action-btn" data-equip-shield="${item.shieldId}" title="Equipar">⬆</button>`;
          else actionBtns += `<button class="inv-action-btn" data-unequip-shield title="Desequipar">⬇</button>`;
        }
      }

      if (!isEquipItem) {
        actionBtns = `<button class="inv-action-btn" data-edit-item="${item.id}" title="Editar">✏</button>`;
      }

      card.innerHTML = `
        <span class="inv-card-icon">${icon}</span>
        <div class="inv-card-body">
          <div class="inv-card-row1">
            <span class="inv-card-name">${_escape(item.nome)}</span>
            ${tagExtra ? `<span class="inv-card-tag">${tagExtra}</span>` : ''}
          </div>
          ${statsHtml ? `<div class="inv-card-stats">${statsHtml}</div>` : ''}
          ${!isEquipItem && item.qtd > 1 ? `<span class="inv-card-qty">×${item.qtd}</span>` : ''}
        </div>
        <div class="inv-card-actions">
          ${actionBtns}
          <button class="inv-action-btn inv-action-btn--danger" data-delete-item="${item.id}" title="Remover">✕</button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  // ─────────────────────────────────────────────────
  // WEAPON SHOP MODAL
  // ─────────────────────────────────────────────────

  function openWeaponShop(activeCategory = WEAPON_CATEGORIES[0]) {
    const zenites = State.get('zenites') ?? 500;

    const catTabs = WEAPON_CATEGORIES.map(cat =>
      `<button class="weapon-cat-btn${cat === activeCategory ? ' active' : ''}" data-weapon-cat="${_escape(cat)}">${_escape(cat)}</button>`
    ).join('');

    const weapons = getWeaponsByCategory(activeCategory);
    const rows = weapons.map(w => {
      const prec = calcWeaponPrecisao(w);
      const canBuy = w.custo === 0 || zenites >= w.custo;
      return `
        <div class="weapon-shop-row">
          <span class="weapon-shop-name" data-weapon-detail="${w.id}">${_escape(w.nome)}</span>
          <div class="weapon-shop-stats">
            <span class="weapon-shop-prec">${prec.formula}</span>
            <span class="weapon-shop-dmg">${formatWeaponDano(w)}</span>
            <span class="weapon-shop-hand">${w.empunhadura === 'duas mãos' ? '2 mãos' : '1 mão'}</span>
            <span class="weapon-shop-cost">${w.custo > 0 ? w.custo + 'z' : '—'}</span>
          </div>
          <div class="weapon-shop-actions">
            <button class="weapon-shop-buy" data-buy-weapon="${w.id}" ${!canBuy ? 'disabled' : ''} title="Comprar (${w.custo}z)"><img src="assets/icons/inv/z.png" alt="z" class="shop-btn-icon"/></button>
            <button class="weapon-shop-add" data-add-weapon="${w.id}" title="Adicionar grátis">+</button>
          </div>
        </div>
      `;
    }).join('');

    const content = `
      <div class="weapon-shop-cats">${catTabs}</div>
      <div class="weapon-shop-list" id="weaponShopList">${rows}</div>
    `;

    Modal.open(content, '⚔ Loja de Armas');
  }

  // ─────────────────────────────────────────────────
  // WEAPON DETAIL MODAL
  // ─────────────────────────────────────────────────

  function openWeaponDetail(weaponId) {
    const w = getWeaponById(weaponId);
    if (!w) return;

    const prec = calcWeaponPrecisao(w);

    const content = `
      <div class="weapon-detail">
        <div class="weapon-detail-header">
          <div>
            <div class="weapon-detail-name">${_escape(w.nome)}</div>
            <div class="weapon-detail-cat">${_escape(w.categoria)}</div>
          </div>
        </div>
        <div class="weapon-detail-grid">
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Precisão</span>
            <span class="weapon-detail-value prec">${prec.formula} (${prec.dado1}+${prec.dado2}${w.bonusPrecisao ? '+' + w.bonusPrecisao : ''} = ${prec.total})</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Dano</span>
            <span class="weapon-detail-value dmg">${formatWeaponDano(w)}</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Tipo de Dano</span>
            <span class="weapon-detail-value">${w.tipoDano}</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Empunhadura</span>
            <span class="weapon-detail-value">${w.empunhadura}</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Alcance</span>
            <span class="weapon-detail-value">${w.alcance}</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Custo</span>
            <span class="weapon-detail-value gold">${w.custo > 0 ? w.custo + 'z' : 'Gratuito'}</span>
          </div>
        </div>
        ${w.especial ? `<div class="weapon-detail-special">${_escape(w.especial)}</div>` : ''}
      </div>
    `;

    Modal.open(content, `⚔ ${w.nome}`);
  }

  // ─────────────────────────────────────────────────
  // ARMOR SHOP MODAL
  // ─────────────────────────────────────────────────

  function openArmorShop(activeCategory = 'Armaduras') {
    const zenites = State.get('zenites') ?? 500;
    const equip   = State.get('equipamento') || {};

    const catTabs = ARMOR_CATEGORIES.map(cat =>
      `<button class="weapon-cat-btn${cat === activeCategory ? ' active' : ''}" data-armor-cat="${_escape(cat)}">${_escape(cat)}</button>`
    ).join('');

    const items = activeCategory === 'Escudos' ? SHIELDS : ARMORS;
    const rows = items.map(item => {
      const canBuy = item.custo === 0 || zenites >= item.custo;
      const isEquipped = activeCategory === 'Escudos'
        ? equip.escudo === item.id
        : (equip.armadura || 'sem_armadura') === item.id;

      const defStr  = activeCategory === 'Escudos' ? `+${item.defesa}` : formatArmorStat(item.defesa);
      const mdefStr = activeCategory === 'Escudos' ? `+${item.defesaMagica}` : formatArmorStat(item.defesaMagica);
      const initStr = `${item.iniciativa >= 0 ? '+' : ''}${item.iniciativa}`;

      return `
        <div class="weapon-shop-row${isEquipped ? ' armor-equipped' : ''}">
          <span class="weapon-shop-name" data-armor-detail="${item.id}">${_escape(item.nome)}</span>
          <div class="weapon-shop-stats">
            <span class="weapon-shop-prec">DEF ${defStr}</span>
            <span class="weapon-shop-dmg">D.M ${mdefStr}</span>
            <span class="weapon-shop-hand">INIC ${initStr}</span>
            <span class="weapon-shop-cost">${item.custo > 0 ? item.custo + 'z' : '—'}</span>
          </div>
          <div class="weapon-shop-actions">
            <button class="weapon-shop-buy" data-buy-armor="${item.id}" ${!canBuy ? 'disabled' : ''} title="Comprar (${item.custo}z)"><img src="assets/icons/inv/z.png" alt="z" class="shop-btn-icon"/></button>
            <button class="weapon-shop-add" data-add-armor="${item.id}" title="Adicionar grátis">+</button>
          </div>
        </div>
      `;
    }).join('');

    const content = `
      <div class="weapon-shop-cats">${catTabs}</div>
      <div class="weapon-shop-list" id="armorShopList">${rows}</div>
    `;

    Modal.open(content, '🛡 Loja de Armaduras');
  }

  // ─────────────────────────────────────────────────
  // ARMOR / SHIELD DETAIL MODAL
  // ─────────────────────────────────────────────────

  function openArmorDetail(itemId) {
    const armor  = getArmorById(itemId);
    const shield = getShieldById(itemId);
    const item   = armor || shield;
    if (!item) return;

    const isShield = !!shield;
    const equip    = State.get('equipamento') || {};
    const isEquipped = isShield
      ? equip.escudo === item.id
      : (equip.armadura || 'sem_armadura') === item.id;

    let defStr, mdefStr, defCalc, mdefCalc;

    if (isShield) {
      defStr    = `+${item.defesa}`;
      mdefStr   = `+${item.defesaMagica}`;
      defCalc   = item.defesa;
      mdefCalc  = item.defesaMagica;
    } else {
      defStr    = formatArmorStat(item.defesa);
      mdefStr   = formatArmorStat(item.defesaMagica);
      defCalc   = calcArmorStat(item.defesa);
      mdefCalc  = calcArmorStat(item.defesaMagica);
    }

    const content = `
      <div class="weapon-detail">
        <div class="weapon-detail-header">
          <div>
            <div class="weapon-detail-name">${_escape(item.nome)}</div>
            <div class="weapon-detail-cat">${isShield ? 'Escudo' : 'Armadura'}${isEquipped ? ' · <span class="equipped-tag">Equipado</span>' : ''}</div>
          </div>
        </div>
        <div class="weapon-detail-grid">
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Defesa</span>
            <span class="weapon-detail-value prec">${defStr} (= ${defCalc})</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Defesa Mágica</span>
            <span class="weapon-detail-value dmg">${mdefStr} (= ${mdefCalc})</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Iniciativa</span>
            <span class="weapon-detail-value">${item.iniciativa >= 0 ? '+' : ''}${item.iniciativa}</span>
          </div>
          <div class="weapon-detail-stat">
            <span class="weapon-detail-label">Custo</span>
            <span class="weapon-detail-value gold">${item.custo > 0 ? item.custo + 'z' : 'Gratuito'}</span>
          </div>
        </div>
        ${item.especial ? `<div class="weapon-detail-special">${_escape(item.especial)}</div>` : ''}
        <div class="modal-footer" style="margin-top:var(--sp-4);">
          ${!isEquipped
            ? `<button class="btn-primary" data-modal-action="equipArmor" data-armor-id="${item.id}" data-armor-type="${isShield ? 'escudo' : 'armadura'}">Equipar</button>`
            : (isShield ? `<button class="btn-secondary" data-modal-action="unequipShield">Desequipar</button>` : '')
          }
          <button class="btn-secondary" data-modal-action="close">Fechar</button>
        </div>
      </div>
    `;

    Modal.open(content, `🛡 ${item.nome}`);
  }

  // ─────────────────────────────────────────────────
  // MODAL — CLASSE DETAIL
  // ─────────────────────────────────────────────────

  function openClassModal(classId) {
    const cls      = getClassById(classId);
    if (!cls) return;

    const selected   = State.get('classes');
    const isSelected = selected.includes(classId);
    const canSelect  = !isSelected;

    const skillsList = cls.habilidades.map(skillId => {
      const skill = getSkillById(skillId);
      if (!skill) return '';
      const typeStyle = getSkillTypeStyle(skill.tipo);
      return `
        <div class="modal-skill-item" data-skill-id="${skillId}">
          <div class="modal-skill-item-name">${skill.nome}</div>
          <span class="modal-skill-item-type">${typeStyle.label}</span>
          <span class="modal-skill-item-cost">${skill.custo}</span>
        </div>
      `;
    }).join('');

    const content = `
      <div class="modal-class-header">
        <div class="modal-class-icon">${_classIconImg(cls, 44, 'modal-class-icon-img')}</div>
        <div class="modal-class-info">
          <div class="modal-class-name">${cls.nome}</div>
          <div class="modal-class-tier" style="color:${cls.cor}">${cls.tier}</div>
        </div>
      </div>

      ${cls.beneficioInicial ? `
        <div class="modal-section-label">Benefício Inicial</div>
        <p class="modal-desc" style="color:var(--color-gold);border-left:3px solid var(--color-gold-dim);padding-left:var(--sp-3);">${cls.beneficioInicial}</p>
      ` : ''}

      <div class="modal-section-label">Habilidades (${cls.habilidades.length})</div>
      <div class="modal-skills-list">${skillsList}</div>

      <div class="modal-footer">
        ${isSelected
          ? `<button class="btn-danger" data-modal-action="removeClass" data-target-class="${classId}">Remover Classe</button>`
          : `<button class="btn-primary" data-modal-action="addClass" data-target-class="${classId}">Selecionar Classe</button>`
        }
        <button class="btn-secondary" data-modal-action="close">Fechar</button>
      </div>
    `;

    Modal.open(content, `■ ${cls.nome}`);
  }

  // ─────────────────────────────────────────────────
  // MODAL — SKILL DETAIL
  // ─────────────────────────────────────────────────

  function openSkillModal(skillId) {
    const skill = getSkillById(skillId);
    if (!skill) return;

    const cls       = getClassById(skill.classe);
    const typeStyle = getSkillTypeStyle(skill.tipo);
    const costIcon  = _getCostIcon(skill.custo);

    const content = `
      <div class="modal-skill-header">
        <div class="modal-skill-name">${skill.nome}</div>
        <div class="modal-skill-tags">
          <span class="modal-tag modal-tag-type">${typeStyle.label}</span>
          <span class="modal-tag modal-tag-cost">${costIcon} ${skill.custo}</span>
          ${cls ? `<span class="modal-tag modal-tag-class">${_classIconImg(cls, 14, 'modal-tag-class-icon')} ${cls.nome}</span>` : ''}
          ${skill.requisito ? `<span class="modal-tag" style="background:var(--color-danger-light);color:var(--color-danger);border:1px solid rgba(176,64,64,0.3)">⚠ ${skill.requisito}</span>` : ''}
        </div>
      </div>

      ${skill.descricao && skill.descricao !== skill.detalhes ? `
        <div class="modal-section-label">Descrição</div>
        <p class="modal-skill-desc">${skill.descricao}</p>
      ` : ''}

      <div class="modal-section-label">Efeito</div>
      <div class="modal-skill-details">${skill.detalhes.split('\n').map(l => `<p>${l}</p>`).join('')}</div>

      <div class="modal-footer">
        <button class="btn-primary" data-modal-action="toggleSkill" data-target-skill="${skillId}">${(State.get('habilidades') || []).includes(skillId) ? 'Desaprender' : 'Aprender'}</button>
        <button class="btn-secondary" data-modal-action="close">Fechar</button>
      </div>
    `;

    Modal.open(content, `■ ${skill.nome}`);
  }

  // ─────────────────────────────────────────────────
  // MODAL — ARCANO DETAIL
  // ─────────────────────────────────────────────────

  function openArcanoModal(arcanoId) {
    const arc = getArcanoById(arcanoId);
    if (!arc) return;

    const content = `
      <div class="arcano-modal-header">
        <img class="arcano-modal-icon-img" src="${arc.icone}" alt="${arc.nome}" width="48" height="48" loading="lazy" />
        <div class="arcano-modal-title">${arc.nome}</div>
      </div>

      <div class="arcano-modal-domains">
        ${arc.dominios.map(d => `<span class="arcano-domain-tag">${d}</span>`).join('')}
      </div>

      <div class="modal-section-label arcano-section-fundir">⚡ Fundir</div>
      <div class="arcano-modal-effect arcano-effect-fundir">
        ${arc.fundir.split('\n').map(l => `<p>${l}</p>`).join('')}
      </div>

      ${arc.dispensar ? `
        <div class="modal-section-label arcano-section-dispensar">✦ Dispensar</div>
        <div class="arcano-modal-effect arcano-effect-dispensar">
          ${arc.dispensar.split('\n').map(l => `<p>${l}</p>`).join('')}
        </div>
      ` : ''}

      <div class="arcano-modal-rules">
        <p>${ARCANO_RULES.escala}</p>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" data-modal-action="close">Fechar</button>
      </div>
    `;

    Modal.open(content, `⬡ ${arc.nome}`);
  }

  // ─────────────────────────────────────────────────
  // MODAL — ITEM FORM (ADD / EDIT)
  // ─────────────────────────────────────────────────

  function openItemModal(existingItem = null) {
    const isEdit = !!existingItem;
    const item   = existingItem || { nome: '', tipo: 'misc', desc: '', qtd: 1, peso: '', valor: '', notas: '' };

    const content = `
      <div class="modal-skill-header">
        <div class="modal-skill-name">${isEdit ? 'Editar Item' : 'Novo Item'}</div>
      </div>

      <form class="item-form" id="itemForm">
        <div class="field-group">
          <label class="field-label" for="itemNome">Nome do Item *</label>
          <input type="text" id="itemNome" class="field-input" value="${_escape(item.nome)}" placeholder="Ex: Espada Longa +1" required />
        </div>

        <div class="item-form-row">
          <div class="field-group">
            <label class="field-label" for="itemTipo">Tipo</label>
            <select id="itemTipo" class="field-select">
              <option value="arma"      ${item.tipo==='arma'?'selected':''}>⚔️ Arma</option>
        Modal.open(content, isEdit ? '■ Editar Item' : '■ Novo Item');
              <option value="consumivel"${item.tipo==='consumivel'?'selected':''}>🧪 Consumível</option>
              <option value="acessorio" ${item.tipo==='acessorio'?'selected':''}>💍 Acessório</option>
              <option value="misc"      ${item.tipo==='misc'?'selected':''}>📦 Miscelânea</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label" for="itemQtd">Quantidade</label>
            <input type="number" id="itemQtd" class="field-input" value="${item.qtd || 1}" min="0" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="itemDesc">Descrição</label>
          <textarea id="itemDesc" class="field-textarea" rows="2" placeholder="Descrição do item...">${_escape(item.desc || '')}</textarea>
        </div>

        <div class="item-form-row">
          <div class="field-group">
            <label class="field-label" for="itemPeso">Peso</label>
            <input type="text" id="itemPeso" class="field-input" value="${_escape(item.peso || '')}" placeholder="Ex: 2 kg" />
          </div>
          <div class="field-group">
            <label class="field-label" for="itemValor">Valor</label>
            <input type="text" id="itemValor" class="field-input" value="${_escape(item.valor || '')}" placeholder="Ex: 100 moedas" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="itemNotas">Notas</label>
          <textarea id="itemNotas" class="field-textarea" rows="2" placeholder="Notas adicionais...">${_escape(item.notas || '')}</textarea>
        </div>
      </form>

      <div class="modal-footer">
        ${isEdit ? `<button class="btn-danger" data-modal-action="deleteItem" data-item-id="${item.id}">Excluir Item</button>` : ''}
        <button class="btn-secondary" data-modal-action="close">Cancelar</button>
        <button class="btn-primary" data-modal-action="${isEdit ? 'saveItem' : 'addItem'}" data-item-id="${item.id || ''}">
          ${isEdit ? '💾 Salvar' : '+ Adicionar'}
        </button>
      </div>
    `;

    Modal.open(content, isEdit ? '■ Editar Item' : '■ Novo Item');
  }

  // ─────────────────────────────────────────────────
  // TRAÇOS
  // ─────────────────────────────────────────────────

  function renderTracos() {
    const tracos = State.get('identidade.tracos') || {};
    _el('tracoIdentidade').textContent = tracos.identidade || '—';
    _el('tracoOrigem').textContent     = tracos.origem     || '—';
    _el('tracoTema').textContent       = tracos.tema       || '—';
  }

  // ─────────────────────────────────────────────────
  // PONTOS DE FÁBULA
  // ─────────────────────────────────────────────────

  function renderFabulaPoints() {
    const pf = State.get('identidade.pontosFabula') ?? 3;
    _el('fabulaPointsValue').textContent = pf;
  }

  // ─────────────────────────────────────────────────
  // LAÇOS
  // ─────────────────────────────────────────────────

  const EMOCAO_PAIRS = [
    { key: 'admiracao', pos: 'Admiração',    neg: 'Inferioridade' },
    { key: 'lealdade',  pos: 'Lealdade',     neg: 'Desconfiança' },
    { key: 'afeto',     pos: 'Afeto',        neg: 'Ódio' },
  ];

  function renderLacos() {
    const lacos   = State.get('identidade.lacos') || [];
    const block   = _el('lacosBlock');
    const grid    = _el('lacosGrid');
    const addBtn  = _el('addLacoBtn');
    grid.innerHTML = '';

    if (addBtn) addBtn.style.display = lacos.length >= 6 ? 'none' : '';

    // Toggle class so CSS controls empty vs grid visibility
    block.classList.toggle('lacos-has-items', lacos.length > 0);

    // Title row inside the overlay
    const titleRow = _create('div', 'lacos-overlay-title');
    titleRow.textContent = 'Laços';
    grid.appendChild(titleRow);

    lacos.forEach((laco, idx) => {
      const card = _create('div', 'laco-card');
      card.dataset.lacoIndex = idx;

      const emocaoHTML = EMOCAO_PAIRS.map(pair => {
        const val = (laco.emocoes && laco.emocoes[pair.key]) || null;
        return `
          <div class="emocao-pair">
            <button type="button" class="emocao-btn emocao-pos${val === 'positivo' ? ' active' : ''}"
              data-laco="${idx}" data-emocao="${pair.key}" data-polo="positivo">${pair.pos}</button>
            <button type="button" class="emocao-btn emocao-neg${val === 'negativo' ? ' active' : ''}"
              data-laco="${idx}" data-emocao="${pair.key}" data-polo="negativo">${pair.neg}</button>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="laco-header">
          <input type="text" class="laco-nome-input" data-laco-nome="${idx}"
            placeholder="Nome do laço..." value="${_escape(laco.nome || '')}" />
          <button type="button" class="btn-ghost laco-remove-btn" data-remove-laco="${idx}" title="Remover">✕</button>
        </div>
        <div class="laco-emocoes">${emocaoHTML}</div>
      `;

      grid.appendChild(card);
    });
  }

  // ─────────────────────────────────────────────────
  // MODAL — TRAÇO EDIT
  // ─────────────────────────────────────────────────

  function openTracoModal(tracoKey) {
    const labels = { identidade: 'Identidade', origem: 'Origem', tema: 'Tema' };
    const label  = labels[tracoKey] || tracoKey;
    const value  = State.get(`identidade.tracos.${tracoKey}`) || '';

    const content = `
      <div class="modal-skill-header">
        <div class="modal-skill-name">Editar ${label}</div>
      </div>
      <div class="field-group" style="margin-top:var(--sp-4);">
        <label class="field-label" for="tracoEditInput">${label}</label>
        <textarea id="tracoEditInput" class="field-textarea" rows="3" placeholder="Descreva ${label.toLowerCase()}...">${_escape(value)}</textarea>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-modal-action="close">Cancelar</button>
        <button class="btn-primary" data-modal-action="saveTraco" data-traco-key="${tracoKey}">Salvar</button>
      </div>
    `;

    Modal.open(content, `■ ${label}`);
  }

  // ─────────────────────────────────────────────────
  // FULL RE-RENDER
  // ─────────────────────────────────────────────────

  function renderAll() {
    renderIdentitySummary();
    renderAttributes();
    renderConditions();
    renderClasses();
    renderSkills();
    renderInventory();
    renderTracos();
    renderFabulaPoints();
    renderLacos();
  }

  // ─────────────────────────────────────────────────
  // PRIVATE UTILS
  // ─────────────────────────────────────────────────

  function _el(id) {
    return document.getElementById(id);
  }

  function _create(tag, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  function _escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ─────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────

  return {
    renderAll,
    renderIdentitySummary,
    renderAttributes,
    renderDerivedStats,
    renderConditions,
    renderClasses,
    renderClassDetailPanel,
    renderSkills,
    updateResourceDisplay,
    renderInventory,
    renderEquipSummary,
    openWeaponShop,
    openWeaponDetail,
    openArmorShop,
    openArmorDetail,
    renderTracos,
    renderFabulaPoints,
    renderLacos,
    openClassModal,
    openSkillModal,
    openArcanoModal,
    openItemModal,
    openTracoModal,
    updateAvatarDisplay: _updateAvatarDisplay,
    ATTR_CONFIG,
    ITEM_ICONS,
    EMOCAO_PAIRS,
  };

})();

// ════════════════════════════════════════════════════════════
// MODAL — Módulo de controle
// ════════════════════════════════════════════════════════════

const Modal = (() => {
  let _overlay, _content;

  function init() {
    _overlay = document.getElementById('modalOverlay');
    _content = document.getElementById('modalContent');

    document.getElementById('modalClose').addEventListener('click', close);
    _overlay.addEventListener('click', e => {
      if (e.target === _overlay) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  function open(html, title = '') {
    _content.innerHTML = html;
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = title || '■ INFO';
    _overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    _overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { _content.innerHTML = ''; }, 350);
  }

  return { init, open, close };
})();

// ════════════════════════════════════════════════════════════
// TOAST — Notificações
// ════════════════════════════════════════════════════════════

const Toast = (() => {
  let _container;

  function init() {
    _container = document.getElementById('toastContainer');
  }

  function show(message, type = 'default') {
    const icons = { success: '✅', warning: '⚠️', danger: '❌', default: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type !== 'default' ? type : ''}`;
    toast.innerHTML = `<span>${icons[type] || icons.default}</span> ${message}`;
    _container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3100);
  }

  return { init, show };
})();
