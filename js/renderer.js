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
    { id: 'des', nome: 'Destreza',  abrev: 'DES', cor: '#c9a84c', descExtra: 'Agilidade, precisão, reflexos' },
    { id: 'ins', nome: 'Insight',   abrev: 'INS', cor: '#3d6a8a', descExtra: 'Percepção, magia, inteligência' },
    { id: 'vig', nome: 'Vigor',     abrev: 'VIG', cor: '#5a8a5e', descExtra: 'Resistência, força, saúde' },
    { id: 'von', nome: 'Vontade',   abrev: 'VON', cor: '#7a4a8a', descExtra: 'Foco, espiritual, determinação' },
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
    const classes = state.classes.map(cid => getClassById(cid)?.nome || cid);
    const derived = Computed.all();

    _el('sumName').textContent    = id.nome    || '—';
    _el('sumLevel').textContent   = id.nivel   || 1;
    _el('sumConcept').textContent = id.conceito || '—';
    _el('sumOrigin').textContent  = id.origem   || '—';
    _el('sumClasses').textContent = classes.length ? classes.join(', ') : 'Nenhuma';
    _el('sumPV').textContent      = `${state.recursos.pv.atual} / ${derived.pvMax}`;
    _el('sumPM').textContent      = `${state.recursos.pm.atual} / ${derived.pmMax}`;

    // Atualiza initial do avatar
    const initial = id.avatarLetra || (id.nome ? id.nome.charAt(0).toUpperCase() : '?');
    _el('avatarInitial').textContent = initial;
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
        <div class="attr-die-display" id="attr-display-${attr.id}">${dado}</div>
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
    const container = _el('attributesDerived');
    container.innerHTML = '';

    const derivedConfig = [
      { label: 'PV Máximo',    value: derived.pvMax,     icon: '❤️',  formula: 'Dado VIG + Nível × 5' },
      { label: 'PM Máximo',    value: derived.pmMax,     icon: '💙',  formula: 'Dado VON + Nível × 5' },
      { label: 'Iniciativa',   value: derived.iniciativa, icon: '⚡',  formula: 'DES + INS' },
      { label: 'Defesa',       value: derived.defesa,    icon: '🛡️',  formula: '10 + DES' },
      { label: 'Res. Mágica',  value: derived.resMagica, icon: '✨',  formula: '10 + INS' },
    ];

    derivedConfig.forEach(item => {
      const card = _create('div', 'derived-card');
      card.innerHTML = `
        <div class="derived-icon">${item.icon}</div>
        <div class="derived-info">
          <div class="derived-label">${item.label}</div>
          <div class="derived-formula">${item.formula}</div>
        </div>
        <div class="derived-value">${item.value}</div>
      `;
      container.appendChild(card);
    });
  }

  // ─────────────────────────────────────────────────
  // CLASSES
  // ─────────────────────────────────────────────────

  function renderClasses() {
    const selectedClasses = State.get('classes');
    const grid            = _el('classesGrid');
    const detailBody      = _el('classDetailBody');
    const detailEmpty     = _el('classDetailPanel')?.querySelector('.class-detail-empty');

    grid.innerHTML = '';

    CLASSES.forEach(cls => {
      const isSelected = selectedClasses.includes(cls.id);
      const card = _create('div', `class-card${isSelected ? ' selected' : ''}`);
      card.style.setProperty('--class-color', cls.cor);
      card.dataset.classId = cls.id;

      // Compact JRPG card for dense desktop grid
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

    if (detailBody && detailEmpty) {
      const focusClass = getClassById(selectedClasses[0]) || CLASSES[0] || null;
      if (focusClass) {
        renderClassDetailPanel(focusClass.id);
      } else {
        detailBody.style.display = 'none';
        detailEmpty.style.display = '';
      }
    }

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
      <div class="class-detail-desc">${cls.descricao}</div>
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
      const card      = _create('div', 'skill-card');
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
  }

  function _getCostIcon(custo) {
    if (!custo || custo === '—') return '🔷';
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
      icon:     '♥',
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
      icon:     '♦',
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
      icon:     '★',
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
      const percent  = max > 0 ? Math.max(0, Math.min(100, (atual / max) * 100)) : 0;
      const isLow    = percent > 0 && percent <= 25;

      const card = _create('div', 'resource-card');
      card.style.setProperty('--res-color',   res.color);
      card.style.setProperty('--res-colordk', res.colorDk);
      card.style.setProperty('--res-colorlt', res.colorLt);
      card.style.setProperty('--res-border',  res.border);
      card.style.setProperty('--res-glow',    res.glow);

      card.innerHTML = `
        <div class="resource-card-header">
          <div class="resource-title-group">
            <span class="resource-icon" style="color:${res.color};text-shadow:0 0 8px ${res.glow};">${res.icon}</span>
            <div class="resource-title">${res.label}</div>
          </div>
        </div>
        <div class="resource-display">
          <div class="resource-ratio">
            <span class="resource-current" id="res-atual-${res.id}">${atual}</span>
            <span class="resource-separator">/</span>
            <span class="resource-max" id="res-max-${res.id}">${max}</span>
          </div>
        </div>
        <div class="resource-bar-wrap">
          <div class="resource-bar-fill${isLow ? ' low' : ''}" id="res-bar-${res.id}" style="width:${percent}%"></div>
        </div>
        <div class="resource-controls">
          <button class="resource-big-btn" data-res="${res.id}" data-res-dir="-5" title="-5">−−</button>
          <button class="resource-big-btn" data-res="${res.id}" data-res-dir="-1" title="-1">−</button>
          <button class="resource-big-btn" data-res="${res.id}" data-res-dir="1"  title="+1">+</button>
          <button class="resource-big-btn" data-res="${res.id}" data-res-dir="5"  title="+5">++</button>
        </div>
        <div class="resource-max-control">
          <span class="resource-max-label">Máximo:</span>
          <div class="number-control" style="width:auto">
            <button class="num-btn" data-res-max="${res.id}" data-res-max-dir="-1">−</button>
            <input type="number" class="field-number" id="res-max-input-${res.id}"
              value="${max}" min="0" max="999" style="width:60px;" />
            <button class="num-btn" data-res-max="${res.id}" data-res-max-dir="1">+</button>
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
    const percent = max > 0 ? Math.max(0, Math.min(100, (atual / max) * 100)) : 0;
    const isLow   = percent > 0 && percent <= 25;

    const atualEl = _el(`res-atual-${resId}`);
    const maxEl   = _el(`res-max-${resId}`);
    const barEl   = _el(`res-bar-${resId}`);
    const maxInp  = _el(`res-max-input-${resId}`);

    if (atualEl) atualEl.textContent = atual;
    if (maxEl)   maxEl.textContent   = max;
    if (barEl) {
      barEl.style.width = `${percent}%`;
      barEl.classList.toggle('low', isLow);
    }
    if (maxInp) maxInp.value = max;
  }

  // ─────────────────────────────────────────────────
  // CONDITIONS
  // ─────────────────────────────────────────────────

  const CONDITION_CONFIG = [
    { id: 'lento',      label: 'Lento',      icon: '🐢', cor: '#8a6a3d',  desc: 'Velocidade de movimento reduzida à metade.' },
    { id: 'fraco',      label: 'Fraco',      icon: '💔', cor: '#8a3a3a',  desc: '-2 em todas as rolagens de ataque.' },
    { id: 'abalado',    label: 'Abalado',    icon: '😨', cor: '#4a6a8a',  desc: '-2 nas rolagens de Vontade e defesa mágica.' },
    { id: 'envenenado', label: 'Envenenado', icon: '☠️', cor: '#4a8a4a',  desc: 'Perde 5 PV no início de cada turno.' },
    { id: 'confuso',    label: 'Confuso',    icon: '😵', cor: '#8a4a7a',  desc: 'Não pode usar habilidades ativas.' },
    { id: 'provocado',  label: 'Provocado',  icon: '😡', cor: '#c9a84c',  desc: 'Deve atacar a fonte de provocação.' },
    { id: 'exausto',    label: 'Exausto',    icon: '😴', cor: '#6a6a8a',  desc: '-1 em todos os dados de dano.' },
    { id: 'cansado',    label: 'Cansado',    icon: '😓', cor: '#8a7a5a',  desc: 'Não pode correr ou usar habilidades de IP.' },
  ];

  function renderConditions() {
    const condicoes = State.get('condicoes');
    const grid      = _el('conditionsGrid');
    if (!grid) return;
    grid.innerHTML  = '';

    CONDITION_CONFIG.forEach(cond => {
      const isActive = !!condicoes[cond.id];
      const item     = _create('div', `condition-item${isActive ? ' active' : ''}`);
      item.style.setProperty('--cond-color', cond.cor);
      item.dataset.conditionId = cond.id;
      item.title = cond.desc;

      item.innerHTML = `
        <div class="condition-dot"></div>
        <span class="condition-icon">${cond.icon}</span>
        <span class="condition-name">${cond.label}</span>
      `;

      grid.appendChild(item);
    });
  }

  // ─────────────────────────────────────────────────
  // INVENTORY
  // ─────────────────────────────────────────────────

  const ITEM_ICONS = {
    arma:      '⚔️',
    armadura:  '🛡️',
    consumivel: '🧪',
    acessorio: '💍',
    misc:      '📦',
  };

  function renderInventory(filterType = 'all') {
    const inventario  = State.get('inventario');
    const grid        = _el('inventoryGrid');
    const emptyEl     = _el('inventoryEmpty');
    grid.innerHTML    = '';

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
      const card = _create('div', 'inventory-card');
      card.dataset.itemId = item.id;

      card.innerHTML = `
        <div class="inventory-card-header">
          <div class="item-icon">${icon}</div>
          <div class="item-title-group">
            <div class="item-name">${_escape(item.nome)}</div>
            <div class="item-type-tag">${item.tipo || 'misc'}</div>
          </div>
          <div class="item-actions">
            <button class="btn-ghost" data-edit-item="${item.id}" title="Editar">✏️</button>
            <button class="btn-ghost" data-delete-item="${item.id}" title="Remover">🗑️</button>
          </div>
        </div>
        ${item.desc ? `<div class="item-desc">${_escape(item.desc)}</div>` : ''}
        <div class="item-meta">
          ${item.qtd  ? `<div class="item-meta-entry"><strong>Qtd:</strong> ${item.qtd}</div>` : ''}
          ${item.peso ? `<div class="item-meta-entry"><strong>Peso:</strong> ${item.peso}</div>` : ''}
          ${item.valor ? `<div class="item-meta-entry"><strong>Valor:</strong> ${_escape(item.valor)}</div>` : ''}
        </div>
      `;

      grid.appendChild(card);
    });
  }

  // ─────────────────────────────────────────────────
  // MODAL — CLASSE DETAIL
  // ─────────────────────────────────────────────────

  function openClassModal(classId) {
    const cls      = getClassById(classId);
    if (!cls) return;

        Modal.open(content, '■ Classe');
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

      <div class="modal-section-label">Descrição</div>
      <p class="modal-desc">${cls.descricao}</p>

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

      <div class="modal-section-label">Descrição</div>
      <p class="modal-skill-desc">${skill.descricao}</p>

      <div class="modal-section-label">Detalhes Completos</div>
      <div class="modal-skill-details">${skill.detalhes.split('\n').map(l => `<p>${l}</p>`).join('')}</div>

      <div class="modal-footer">
        <button class="btn-secondary" data-modal-action="close">Fechar</button>
      </div>
    `;

    Modal.open(content, `■ ${skill.nome}`);
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
  // FULL RE-RENDER
  // ─────────────────────────────────────────────────

  function renderAll() {
    renderIdentitySummary();
    renderAttributes();
    renderClasses();
    renderSkills();
    renderResources();
    renderInventory();
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
    renderClasses,
    renderClassDetailPanel,
    renderSkills,
    renderResources,
    updateResourceDisplay,
    renderConditions,
    renderInventory,
    openClassModal,
    openSkillModal,
    openItemModal,
    ATTR_CONFIG,
    CONDITION_CONFIG,
    ITEM_ICONS,
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
