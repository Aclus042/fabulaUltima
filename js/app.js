/* ═══════════════════════════════════════════════════════════════
   app.js — Inicialização e Gestão de Eventos
   Fabula Ultima – Ficha de Personagem
═══════════════════════════════════════════════════════════════ */

'use strict';

// ════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializa o State (carrega do localStorage)
  State.init();

  // 2. Inicializa Modal e Toast
  Modal.init();
  Toast.init();

  // 3. Renderiza tudo
  Renderer.renderAll();

  // 4. Hidrata os campos de identidade com dados salvos
  _hydrateIdentityFields();

  // 5. Registra todos os event listeners
  _registerNavEvents();
  _registerIdentityEvents();
  _registerAttributeEvents();
  _registerClassEvents();
  _registerSkillFilterEvents();
  _registerResourceEvents();
  _registerConditionEvents();
  _registerInventoryEvents();
  _registerModalDelegation();

  // 6. Subscreve ao state change para atualizar o resumo
  State.on('change', () => {
    Renderer.renderIdentitySummary();
  });

  console.log('[FabulaUltima] Ficha carregada com sucesso ✦');
});

// ════════════════════════════════════════════════════════════
// NAVEGAÇÃO POR SEÇÕES
// ════════════════════════════════════════════════════════════

function _registerNavEvents() {
  // Navegação lateral e links inline
  document.addEventListener('click', e => {
    const navTrigger = e.target.closest('[data-nav]');
    if (!navTrigger) return;
    _navigateTo(navTrigger.dataset.nav);
  });
}

function _navigateTo(sectionId) {
  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nav === sectionId);
  });

  // Atualiza seções visíveis
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `section-${sectionId}`);
  });

  // Scroll para o topo do conteúdo
  document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════════════
// IDENTIDADE
// ════════════════════════════════════════════════════════════

function _hydrateIdentityFields() {
  const id = State.get('identidade');
  _setVal('charName',    id.nome     || '');
  _setVal('charLevel',   id.nivel    || 1);
  _setVal('charConcept', id.conceito || '');
  _setVal('charOrigin',  id.origem   || '');
  _setVal('charBond',    id.vinculo  || '');
  _setVal('charNotes',   id.notas    || '');
}

function _registerIdentityEvents() {
  const fields = [
    { id: 'charName',    path: 'identidade.nome' },
    { id: 'charConcept', path: 'identidade.conceito' },
    { id: 'charOrigin',  path: 'identidade.origem' },
    { id: 'charBond',    path: 'identidade.vinculo' },
    { id: 'charNotes',   path: 'identidade.notas' },
  ];

  fields.forEach(({ id, path }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      State.set(path, el.value);
    });
  });

  // Nível
  const levelInput = document.getElementById('charLevel');
  if (levelInput) {
    levelInput.addEventListener('input', () => {
      const val = Math.max(1, Math.min(50, parseInt(levelInput.value) || 1));
      State.set('identidade.nivel', val);
      // Atualiza recursos derivados
      _syncDerivedMaxes();
      Renderer.renderDerivedStats();
    });
  }

  // Botões +/- do nível
  document.querySelectorAll('[data-action][data-target="charLevel"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir    = btn.dataset.action === 'increase' ? 1 : -1;
      const min    = parseInt(btn.dataset.min || 1);
      const max    = parseInt(btn.dataset.max || 50);
      const input  = document.getElementById('charLevel');
      const newVal = Math.max(min, Math.min(max, (parseInt(input.value) || 1) + dir));
      input.value  = newVal;
      State.set('identidade.nivel', newVal);
      _syncDerivedMaxes();
      Renderer.renderDerivedStats();
    });
  });

  // Avatar letra personalizada
  document.getElementById('changeAvatarBtn').addEventListener('click', () => {
    const current = State.get('identidade.avatarLetra') || State.get('identidade.nome')?.charAt(0) || '?';
    const input   = prompt('Digite uma letra ou símbolo para o avatar (1 caractere):', current);
    if (input !== null) {
      const letra = input.trim().charAt(0) || '?';
      State.set('identidade.avatarLetra', letra);
      document.getElementById('avatarInitial').textContent = letra;
    }
  });
}

// ════════════════════════════════════════════════════════════
// ATRIBUTOS
// ════════════════════════════════════════════════════════════

function _registerAttributeEvents() {
  const DADOS = ['', 'd6', 'd8', 'd10', 'd12'];

  document.getElementById('attributesGrid').addEventListener('click', e => {
    const btn = e.target.closest('.attr-btn');
    if (!btn) return;

    const attrId   = btn.dataset.attr;
    const dir      = parseInt(btn.dataset.dir);
    const current  = State.get(`atributos.${attrId}.nivel`) || 1;
    const newLevel = Math.max(1, Math.min(4, current + dir));

    State.set(`atributos.${attrId}.nivel`, newLevel);

    // Atualiza display do dado
    const display = document.getElementById(`attr-display-${attrId}`);
    if (display) display.textContent = DADOS[newLevel] || 'd6';

    // Recalcula derivados
    Renderer.renderDerivedStats();
    _syncDerivedMaxes();
    Renderer.updateResourceDisplay('pv');
    Renderer.updateResourceDisplay('pm');

    Toast.show(`${_attrName(attrId)} → ${DADOS[newLevel]}`, 'default');
  });
}

function _attrName(id) {
  const map = { des: 'Destreza', ins: 'Insight', vig: 'Vigor', von: 'Vontade' };
  return map[id] || id;
}

function _syncDerivedMaxes() {
  const derived = Computed.all();
  const pvAtual = State.get('recursos.pv.atual');
  const pmAtual = State.get('recursos.pm.atual');

  State.set('recursos.pv.max', derived.pvMax);
  State.set('recursos.pm.max', derived.pmMax);

  // Não deixar atual > max
  if (pvAtual > derived.pvMax) State.set('recursos.pv.atual', derived.pvMax);
  if (pmAtual > derived.pmMax) State.set('recursos.pm.atual', derived.pmMax);
}

// ════════════════════════════════════════════════════════════
// CLASSES
// ════════════════════════════════════════════════════════════

function _registerClassEvents() {
  const classesGrid = document.getElementById('classesGrid');

  classesGrid.addEventListener('click', e => {
    // Botão "Ver detalhes"
    const detailBtn = e.target.closest('[data-class-detail]');
    if (detailBtn) {
      e.stopPropagation();
      Renderer.renderClassDetailPanel(detailBtn.dataset.classDetail);
      Renderer.openClassModal(detailBtn.dataset.classDetail);
      return;
    }

    // Clique no card — toggle seleção
    const card = e.target.closest('.class-card');
    if (!card) return;

    const classId  = card.dataset.classId;
    const selected = State.get('classes');

    if (selected.includes(classId)) {
      // Remove
      State.set('classes', selected.filter(id => id !== classId));
      Toast.show(`Classe "${getClassById(classId)?.nome}" removida.`, 'warning');
    } else {
      if (selected.length >= MAX_CLASSES) {
        Toast.show(`Máximo de ${MAX_CLASSES} classes atingido.`, 'danger');
        return;
      }
      // Adiciona
      State.set('classes', [...selected, classId]);
      Toast.show(`Classe "${getClassById(classId)?.nome}" selecionada!`, 'success');
    }

    Renderer.renderClasses();
    Renderer.renderClassDetailPanel(classId);
    Renderer.renderSkills();
  });

  // Remover classe via tag no topo
  document.getElementById('selectedTags').addEventListener('click', e => {
    const removeBtn = e.target.closest('[data-remove-class]');
    if (!removeBtn) return;

    const classId  = removeBtn.dataset.removeClass;
    const selected = State.get('classes');
    State.set('classes', selected.filter(id => id !== classId));
    Toast.show(`Classe "${getClassById(classId)?.nome}" removida.`, 'warning');
    Renderer.renderClasses();
    const nextClass = State.get('classes')[0];
    if (nextClass) Renderer.renderClassDetailPanel(nextClass);
    Renderer.renderSkills();
  });
}

// ════════════════════════════════════════════════════════════
// SKILL FILTER
// ════════════════════════════════════════════════════════════

let _currentSkillFilter = 'all';

function _registerSkillFilterEvents() {
  document.getElementById('skillsFilterBar').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    _currentSkillFilter = btn.dataset.filterClass;
    Renderer.renderSkills(_currentSkillFilter);
  });

  // Skill card click
  document.getElementById('skillsGrid').addEventListener('click', e => {
    const card = e.target.closest('.skill-card');
    if (!card) return;
    Renderer.openSkillModal(card.dataset.skillId);
  });
}

// ════════════════════════════════════════════════════════════
// RECURSOS
// ════════════════════════════════════════════════════════════

function _registerResourceEvents() {
  const grid = document.getElementById('resourcesGrid');

  grid.addEventListener('click', e => {
    // Botões +/- do valor atual
    const resBtn = e.target.closest('[data-res][data-res-dir]');
    if (resBtn) {
      const resId   = resBtn.dataset.res;
      const dir     = parseInt(resBtn.dataset.resDir);
      const current = State.get(`recursos.${resId}.atual`) ?? 0;
      const max     = _getResMax(resId);
      const newVal  = Math.max(0, Math.min(max, current + dir));
      State.set(`recursos.${resId}.atual`, newVal);
      Renderer.updateResourceDisplay(resId);
      Renderer.renderIdentitySummary();
      return;
    }

    // Botões +/- do máximo
    const resMaxBtn = e.target.closest('[data-res-max][data-res-max-dir]');
    if (resMaxBtn) {
      const resId  = resMaxBtn.dataset.resMax;
      const dir    = parseInt(resMaxBtn.dataset.resMaxDir);
      const curMax = State.get(`recursos.${resId}.max`) ?? 0;
      const newMax = Math.max(0, curMax + dir);
      State.set(`recursos.${resId}.max`, newMax);

      // Não deixa atual > novo max
      const atual = State.get(`recursos.${resId}.atual`) ?? 0;
      if (atual > newMax) State.set(`recursos.${resId}.atual`, newMax);

      Renderer.updateResourceDisplay(resId);
      return;
    }
  });

  // Input direto do máximo
  grid.addEventListener('change', e => {
    const inp = e.target;
    if (!inp.id?.startsWith('res-max-input-')) return;

    const resId  = inp.id.replace('res-max-input-', '');
    const newMax = Math.max(0, parseInt(inp.value) || 0);
    State.set(`recursos.${resId}.max`, newMax);

    const atual = State.get(`recursos.${resId}.atual`) ?? 0;
    if (atual > newMax) State.set(`recursos.${resId}.atual`, newMax);

    Renderer.updateResourceDisplay(resId);
  });
}

function _getResMax(resId) {
  const derived = Computed.all();
  if (resId === 'pv') return derived.pvMax;
  if (resId === 'pm') return derived.pmMax;
  return State.get(`recursos.${resId}.max`) ?? 999;
}

// ════════════════════════════════════════════════════════════
// CONDIÇÕES
// ════════════════════════════════════════════════════════════

function _registerConditionEvents() {
  document.getElementById('conditionsGrid').addEventListener('click', e => {
    const item = e.target.closest('.condition-item');
    if (!item) return;

    const condId   = item.dataset.conditionId;
    const current  = State.get(`condicoes.${condId}`);
    State.set(`condicoes.${condId}`, !current);

    item.classList.toggle('active', !current);
    const condName = item.querySelector('.condition-name')?.textContent || condId;
    Toast.show(`${condName}: ${!current ? 'Ativada' : 'Removida'}`, !current ? 'warning' : 'default');
  });
}

// ════════════════════════════════════════════════════════════
// INVENTÁRIO
// ════════════════════════════════════════════════════════════

let _currentInventoryFilter = 'all';

function _registerInventoryEvents() {
  // Botão adicionar
  document.getElementById('addItemBtn').addEventListener('click', () => {
    Renderer.openItemModal(null);
  });

  // Filtro de tipo
  document.getElementById('inventoryFilter').addEventListener('change', e => {
    _currentInventoryFilter = e.target.value;
    Renderer.renderInventory(_currentInventoryFilter);
  });

  // Edit / Delete delegation na grid
  document.getElementById('inventoryGrid').addEventListener('click', e => {
    const editBtn   = e.target.closest('[data-edit-item]');
    const deleteBtn = e.target.closest('[data-delete-item]');

    if (editBtn) {
      const itemId = editBtn.dataset.editItem;
      const items  = State.get('inventario');
      const item   = items.find(i => i.id === itemId);
      if (item) Renderer.openItemModal(item);
    }
    if (deleteBtn) {
      const itemId = deleteBtn.dataset.deleteItem;
      _deleteItem(itemId);
    }
  });
}

function _deleteItem(itemId) {
  if (!confirm('Remover este item do inventário?')) return;
  const items = State.get('inventario');
  State.set('inventario', items.filter(i => i.id !== itemId));
  Renderer.renderInventory(_currentInventoryFilter);
  Toast.show('Item removido.', 'danger');
}

// ════════════════════════════════════════════════════════════
// MODAL DELEGATION — Ações dentro de modais
// ════════════════════════════════════════════════════════════

function _registerModalDelegation() {
  document.getElementById('modalContent').addEventListener('click', e => {
    const quickSkill = e.target.closest('[data-skill-open]');
    if (quickSkill) {
      Renderer.openSkillModal(quickSkill.dataset.skillOpen);
      return;
    }

    const actionEl = e.target.closest('[data-modal-action]');
    if (!actionEl) {
      // Verificar clique em skill dentro do modal de classe
      const skillItem = e.target.closest('[data-skill-id]');
      if (skillItem) {
        Renderer.openSkillModal(skillItem.dataset.skillId);
      }
      return;
    }

    const action = actionEl.dataset.modalAction;

    switch (action) {

      case 'close':
        Modal.close();
        break;

      case 'addClass': {
        const classId  = actionEl.dataset.targetClass;
        const selected = State.get('classes');
        if (!selected.includes(classId) && selected.length < MAX_CLASSES) {
          State.set('classes', [...selected, classId]);
          Toast.show(`Classe "${getClassById(classId)?.nome}" selecionada!`, 'success');
          Renderer.renderClasses();
          Renderer.renderSkills();
          Modal.close();
        }
        break;
      }

      case 'removeClass': {
        const classId  = actionEl.dataset.targetClass;
        const selected = State.get('classes');
        State.set('classes', selected.filter(id => id !== classId));
        Toast.show(`Classe "${getClassById(classId)?.nome}" removida.`, 'warning');
        Renderer.renderClasses();
        Renderer.renderSkills();
        Modal.close();
        break;
      }

      case 'addItem': {
        const item = _collectItemForm();
        if (!item) break;
        item.id = generateId();
        const items = State.get('inventario');
        State.set('inventario', [...items, item]);
        Renderer.renderInventory(_currentInventoryFilter);
        Toast.show('Item adicionado!', 'success');
        Modal.close();
        break;
      }

      case 'saveItem': {
        const item     = _collectItemForm();
        if (!item) break;
        const itemId   = actionEl.dataset.itemId;
        const items    = State.get('inventario');
        const idx      = items.findIndex(i => i.id === itemId);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...item };
          State.set('inventario', [...items]);
          Renderer.renderInventory(_currentInventoryFilter);
          Toast.show('Item atualizado!', 'success');
        }
        Modal.close();
        break;
      }

      case 'deleteItem': {
        const itemId = actionEl.dataset.itemId;
        Modal.close();
        setTimeout(() => _deleteItem(itemId), 400);
        break;
      }
    }
  });
}

function _collectItemForm() {
  const nome = document.getElementById('itemNome')?.value?.trim();
  if (!nome) {
    Toast.show('O nome do item é obrigatório.', 'danger');
    return null;
  }
  return {
    nome,
    tipo:  document.getElementById('itemTipo')?.value  || 'misc',
    desc:  document.getElementById('itemDesc')?.value  || '',
    qtd:   parseInt(document.getElementById('itemQtd')?.value) || 1,
    peso:  document.getElementById('itemPeso')?.value  || '',
    valor: document.getElementById('itemValor')?.value || '',
    notas: document.getElementById('itemNotas')?.value || '',
  };
}

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

function _setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}
