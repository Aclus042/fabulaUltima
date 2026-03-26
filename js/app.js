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
  _registerMobileMenuEvents();
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

  // Atualiza mobile topbar label
  const sectionNames = {
    identidade: 'Identidade',
    atributos: 'Atributos',
    classes: 'Classes',
    habilidades: 'Habilidades',
    recursos: 'Recursos',
    inventario: 'Inventário',
  };
  const labelEl = document.getElementById('mobileCurrentSection');
  if (labelEl) labelEl.textContent = sectionNames[sectionId] || sectionId;

  // Close mobile sidebar when navigating
  _closeMobileSidebar();

  // Scroll para o topo do conteúdo
  document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════════════
// MOBILE MENU
// ════════════════════════════════════════════════════════════

function _registerMobileMenuEvents() {
  const menuBtn  = document.getElementById('mobileMenuBtn');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (menuBtn) {
    menuBtn.addEventListener('click', _toggleMobileSidebar);
  }
  if (backdrop) {
    backdrop.addEventListener('click', _closeMobileSidebar);
  }
}

function _toggleMobileSidebar() {
  const sidebar  = document.getElementById('shellSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  const isOpen = sidebar.classList.contains('sidebar-open');
  if (isOpen) {
    _closeMobileSidebar();
  } else {
    sidebar.classList.add('sidebar-open');
    if (backdrop) backdrop.classList.add('active');
  }
}

function _closeMobileSidebar() {
  const sidebar  = document.getElementById('shellSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar)  sidebar.classList.remove('sidebar-open');
  if (backdrop) backdrop.classList.remove('active');
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

  // ── Avatar image crop system ──
  _initAvatarCrop();
}

// ════════════════════════════════════════════════════════════
// AVATAR CROP SYSTEM
// ════════════════════════════════════════════════════════════

function _initAvatarCrop() {
  const fileInput    = document.getElementById('avatarFileInput');
  const changeBtn    = document.getElementById('changeAvatarBtn');
  const overlay      = document.getElementById('cropOverlay');
  const viewport     = document.getElementById('cropViewport');
  const canvas       = document.getElementById('cropCanvas');
  const cropFrame    = document.getElementById('cropFrame');
  const btnConfirm   = document.getElementById('cropConfirm');
  const btnRemove    = document.getElementById('cropRemove');
  const ctx          = canvas.getContext('2d');

  let img        = null;
  let scale      = 1;
  let minScale   = 0.1;
  let maxScale   = 5;
  let offsetX    = 0;
  let offsetY    = 0;
  let dragging   = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastPinchDist = 0;

  // Click button → open file picker
  changeBtn.addEventListener('click', () => fileInput.click());

  // File selected → load image → open crop modal
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const newImg = new Image();
      newImg.onload = () => {
        img = newImg;
        _openCropModal();
      };
      newImg.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });

  function _openCropModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Compute initial scale so image covers the frame
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const frameSize = cropFrame.clientWidth;
    const fitScale = frameSize / Math.min(img.width, img.height);
    scale = fitScale;
    minScale = fitScale * 0.5;
    maxScale = fitScale * 5;

    // Center image
    offsetX = (vw - img.width * scale) / 2;
    offsetY = (vh - img.height * scale) / 2;

    _drawCanvas();
  }

  function _closeCropModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function _drawCanvas() {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    canvas.width = vw;
    canvas.height = vh;

    // Frame position (centered)
    const frameSize = cropFrame.clientWidth;
    const fx = (vw - frameSize) / 2;
    const fy = (vh - frameSize) / 2;

    // Clear
    ctx.clearRect(0, 0, vw, vh);

    // Draw image
    ctx.drawImage(img, offsetX, offsetY, img.width * scale, img.height * scale);

    // Dim area outside frame
    ctx.fillStyle = 'rgba(0, 0, 16, 0.7)';
    // Top
    ctx.fillRect(0, 0, vw, fy);
    // Bottom
    ctx.fillRect(0, fy + frameSize, vw, vh - fy - frameSize);
    // Left
    ctx.fillRect(0, fy, fx, frameSize);
    // Right
    ctx.fillRect(fx + frameSize, fy, vw - fx - frameSize, frameSize);
  }

  // ── Mouse drag ──
  viewport.addEventListener('mousedown', e => {
    dragging = true;
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    viewport.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
    _drawCanvas();
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    viewport.style.cursor = 'grab';
  });

  // ── Mouse wheel zoom ──
  viewport.addEventListener('wheel', e => {
    e.preventDefault();
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const rect = viewport.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const oldScale = scale;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(minScale, Math.min(maxScale, scale * delta));

    // Zoom toward cursor
    offsetX = mx - (mx - offsetX) * (scale / oldScale);
    offsetY = my - (my - offsetY) * (scale / oldScale);

    _drawCanvas();
  }, { passive: false });

  // ── Touch drag ──
  viewport.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      dragging = true;
      dragStartX = e.touches[0].clientX - offsetX;
      dragStartY = e.touches[0].clientY - offsetY;
    } else if (e.touches.length === 2) {
      dragging = false;
      lastPinchDist = _pinchDist(e.touches);
    }
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && dragging) {
      offsetX = e.touches[0].clientX - dragStartX;
      offsetY = e.touches[0].clientY - dragStartY;
      _drawCanvas();
    } else if (e.touches.length === 2) {
      const dist = _pinchDist(e.touches);
      const ratio = dist / lastPinchDist;
      const oldScale = scale;
      scale = Math.max(minScale, Math.min(maxScale, scale * ratio));

      // Zoom toward pinch center
      const rect = viewport.getBoundingClientRect();
      const cx = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
      const cy = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
      offsetX = cx - (cx - offsetX) * (scale / oldScale);
      offsetY = cy - (cy - offsetY) * (scale / oldScale);

      lastPinchDist = dist;
      _drawCanvas();
    }
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('touchend', () => {
    dragging = false;
    lastPinchDist = 0;
  });

  function _pinchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ── Confirm crop ──
  btnConfirm.addEventListener('click', () => {
    if (!img) return;

    const frameSize = cropFrame.clientWidth;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const fx = (vw - frameSize) / 2;
    const fy = (vh - frameSize) / 2;

    // Output canvas for the cropped area
    const outSize = 256;
    const out = document.createElement('canvas');
    out.width = outSize;
    out.height = outSize;
    const octx = out.getContext('2d');

    // Map frame region back to image coords
    const sx = (fx - offsetX) / scale;
    const sy = (fy - offsetY) / scale;
    const sw = frameSize / scale;
    const sh = frameSize / scale;

    octx.drawImage(img, sx, sy, sw, sh, 0, 0, outSize, outSize);

    const dataUrl = out.toDataURL('image/png');
    State.set('identidade.avatarImg', dataUrl);
    Renderer.updateAvatarDisplay();
    _closeCropModal();
    Toast.show('Imagem atualizada!', 'default');
  });

  // ── Remove ──
  btnRemove.addEventListener('click', () => {
    State.set('identidade.avatarImg', '');
    Renderer.updateAvatarDisplay();
    _closeCropModal();
    Toast.show('Imagem removida', 'default');
  });

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) _closeCropModal();
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
    if (display) {
      display.textContent = DADOS[newLevel] || 'd6';
      display.dataset.die = DADOS[newLevel] || 'd6';
    }

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

  // ── Long-press (mobile) para abrir detalhes ──
  let _longPressTimer = null;
  let _longPressFired = false;
  let _touchStartPos  = null;

  classesGrid.addEventListener('touchstart', e => {
    const card = e.target.closest('.class-card');
    if (!card) return;

    _longPressFired = false;
    const touch = e.touches[0];
    _touchStartPos = { x: touch.clientX, y: touch.clientY };

    _longPressTimer = setTimeout(() => {
      _longPressFired = true;
      Renderer.openClassModal(card.dataset.classId);
    }, 500);
  }, { passive: true });

  classesGrid.addEventListener('touchmove', e => {
    if (!_longPressTimer) return;
    const touch = e.touches[0];
    const dx = touch.clientX - _touchStartPos.x;
    const dy = touch.clientY - _touchStartPos.y;
    if (dx * dx + dy * dy > 100) {          // deslocou > ~10px
      clearTimeout(_longPressTimer);
      _longPressTimer = null;
    }
  }, { passive: true });

  classesGrid.addEventListener('touchend', () => {
    clearTimeout(_longPressTimer);
    _longPressTimer = null;
  }, { passive: true });

  classesGrid.addEventListener('touchcancel', () => {
    clearTimeout(_longPressTimer);
    _longPressTimer = null;
  }, { passive: true });

  classesGrid.addEventListener('click', e => {
    // Se o long-press acabou de disparar, ignora o click
    if (_longPressFired) {
      _longPressFired = false;
      e.preventDefault();
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
    Renderer.renderSkills();

    // Mostra próxima classe no painel de detalhes
    const remaining = State.get('classes');
    if (remaining.length > 0) {
      Renderer.renderClassDetailPanel(remaining[remaining.length - 1]);
    }
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
        if (!selected.includes(classId)) {
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
