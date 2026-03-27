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
  _hydrateZenites();

  // 5. Registra todos os event listeners
  _registerNavEvents();
  _registerMobileMenuEvents();
  _registerIdentityEvents();
  _registerAttributeEvents();
  _registerConditionEvents();
  _registerDerivedEditEvents();
  _registerClassEvents();
  _registerSkillFilterEvents();
  _registerInventoryEvents();
  _registerZenitesEvents();
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
  _setVal('charNotes',   id.notas    || '');
  // Pontos de Fábula display is a span, use textContent
  const pfEl = document.getElementById('fabulaPointsValue');
  if (pfEl) pfEl.textContent = id.pontosFabula ?? 3;
}

function _registerIdentityEvents() {
  // ── Nome ──
  const nameEl = document.getElementById('charName');
  if (nameEl) {
    nameEl.addEventListener('input', () => {
      State.set('identidade.nome', nameEl.value);
    });
  }

  // ── Notas ──
  const notesEl = document.getElementById('charNotes');
  if (notesEl) {
    notesEl.addEventListener('input', () => {
      State.set('identidade.notas', notesEl.value);
    });
  }

  // ── Nível input ──
  const levelInput = document.getElementById('charLevel');
  if (levelInput) {
    levelInput.addEventListener('input', () => {
      const val = Math.max(1, Math.min(50, parseInt(levelInput.value) || 1));
      State.set('identidade.nivel', val);
      _syncDerivedMaxes();
      Renderer.renderDerivedStats();
    });
  }

  // ── Nível +/- buttons ──
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

  // ── Pontos de Fábula ──
  document.getElementById('fabulaMinus').addEventListener('click', () => {
    const cur = State.get('identidade.pontosFabula') ?? 3;
    const val = Math.max(0, cur - 1);
    State.set('identidade.pontosFabula', val);
    Renderer.renderFabulaPoints();
  });
  document.getElementById('fabulaPlus').addEventListener('click', () => {
    const cur = State.get('identidade.pontosFabula') ?? 3;
    const val = Math.min(99, cur + 1);
    State.set('identidade.pontosFabula', val);
    Renderer.renderFabulaPoints();
  });

  // ── Traços toggle ──
  document.getElementById('tracosToggle').addEventListener('click', () => {
    const block = document.getElementById('tracosBlock');
    block.classList.toggle('open');
  });

  // ── Traços card click → edit modal ──
  document.getElementById('tracosContent').addEventListener('click', e => {
    const card = e.target.closest('.traco-card');
    if (!card) return;
    const key = card.dataset.traco;
    if (key) Renderer.openTracoModal(key);
  });

  // ── Laços toggle ──
  document.getElementById('lacosToggle').addEventListener('click', e => {
    // Don't toggle if the + button was clicked
    if (e.target.closest('.lacos-add-btn')) return;
    document.getElementById('lacosBlock').classList.toggle('open');
  });

  // ── Laços: add bond ──
  document.getElementById('addLacoBtn').addEventListener('click', e => {
    e.stopPropagation();
    const lacos = State.get('identidade.lacos') || [];
    if (lacos.length >= 6) return;
    lacos.push({ nome: '', emocoes: { admiracao: null, lealdade: null, afeto: null } });
    State.set('identidade.lacos', lacos);
    // Auto-open if not already open
    document.getElementById('lacosBlock').classList.add('open');
    Renderer.renderLacos();
  });

  // ── Laços: delegated events (remove, name input, emotion toggle) ──
  document.getElementById('lacosGrid').addEventListener('click', e => {
    // Remove bond
    const removeBtn = e.target.closest('[data-remove-laco]');
    if (removeBtn) {
      const idx = parseInt(removeBtn.dataset.removeLaco);
      const lacos = State.get('identidade.lacos') || [];
      lacos.splice(idx, 1);
      State.set('identidade.lacos', lacos);
      Renderer.renderLacos();
      return;
    }

    // Emotion toggle
    const emBtn = e.target.closest('.emocao-btn');
    if (emBtn) {
      const idx     = parseInt(emBtn.dataset.laco);
      const emKey   = emBtn.dataset.emocao;
      const polo    = emBtn.dataset.polo;
      const lacos   = State.get('identidade.lacos') || [];
      if (!lacos[idx]) return;
      if (!lacos[idx].emocoes) lacos[idx].emocoes = {};

      // Toggle: if already selected, deselect; otherwise set
      if (lacos[idx].emocoes[emKey] === polo) {
        lacos[idx].emocoes[emKey] = null;
      } else {
        lacos[idx].emocoes[emKey] = polo;
      }
      State.set('identidade.lacos', lacos);
      Renderer.renderLacos();
      return;
    }
  });

  // Name input (delegated via focusout)
  document.getElementById('lacosGrid').addEventListener('input', e => {
    const nameInput = e.target.closest('[data-laco-nome]');
    if (!nameInput) return;
    const idx = parseInt(nameInput.dataset.lacoNome);
    const lacos = State.get('identidade.lacos') || [];
    if (!lacos[idx]) return;
    lacos[idx].nome = nameInput.value;
    State.set('identidade.lacos', lacos);
  });

  // ── Close Traços/Laços overlays on backdrop click ──
  // The ::before pseudo backdrop is fixed fullscreen on .open blocks.
  // We close when clicking anything that isn't inside the overlay content.
  document.addEventListener('mousedown', e => {
    const tracosBlock = document.getElementById('tracosBlock');
    const lacosBlock  = document.getElementById('lacosBlock');

    if (tracosBlock.classList.contains('open')) {
      const isInsideContent = e.target.closest('.tracos-content');
      const isHeader = e.target.closest('.tracos-header');
      if (!isInsideContent && !isHeader) {
        tracosBlock.classList.remove('open');
      }
    }
    if (lacosBlock.classList.contains('open')) {
      const isInsideContent = e.target.closest('.lacos-grid') || e.target.closest('.lacos-empty');
      const isHeader = e.target.closest('.lacos-header');
      if (!isInsideContent && !isHeader) {
        lacosBlock.classList.remove('open');
      }
    }
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

function _registerConditionEvents() {
  document.getElementById('conditionsGrid').addEventListener('click', e => {
    const row = e.target.closest('.condition-row');
    if (!row) return;

    const condId = row.dataset.condition;
    const current = State.get(`condicoes.${condId}`) || false;
    State.set(`condicoes.${condId}`, !current);

    row.classList.toggle('active', !current);
  });
}

function _attrName(id) {
  const map = { des: 'Destreza', ast: 'Astúcia', vig: 'Vigor', von: 'Vontade' };
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
// DERIVED PV/PM INLINE EDIT
// ════════════════════════════════════════════════════════════

function _registerDerivedEditEvents() {
  const container = document.getElementById('attributesDerived');

  // Delegated: handle focus, blur, keydown on .derived-input
  container.addEventListener('focusin', e => {
    const input = e.target.closest('.derived-input');
    if (!input) return;
    // Select all on focus for easy overwrite
    requestAnimationFrame(() => input.select());
  });

  container.addEventListener('keydown', e => {
    const input = e.target.closest('.derived-input');
    if (!input) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      _applyDerivedInput(input);
      input.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Revert to current value
      const resId = input.dataset.res;
      input.value = State.get(`recursos.${resId}.atual`);
      input.blur();
    }
  });

  container.addEventListener('focusout', e => {
    const input = e.target.closest('.derived-input');
    if (!input) return;
    _applyDerivedInput(input);
  });
}

function _applyDerivedInput(input) {
  const resId = input.dataset.res;
  const raw = input.value.trim();
  const current = State.get(`recursos.${resId}.atual`) || 0;
  let max;
  if (resId === 'pv') max = Computed.all().pvMax;
  else if (resId === 'pm') max = Computed.all().pmMax;
  else max = State.get(`recursos.${resId}.max`) || 0;

  let newVal;

  // Support expressions: +N, -N, or absolute number
  if (/^[+\-]/.test(raw)) {
    // Relative: parse as offset from current
    const offset = parseInt(raw, 10);
    if (isNaN(offset)) {
      input.value = current;
      return;
    }
    newVal = current + offset;
  } else {
    // Absolute value
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) {
      input.value = current;
      return;
    }
    newVal = parsed;
  }

  // Clamp 0..max
  newVal = Math.max(0, Math.min(max, newVal));

  State.set(`recursos.${resId}.atual`, newVal);
  input.value = newVal;

  // Sync resource cards and summary
  Renderer.updateResourceDisplay(resId);
  Renderer.renderIdentitySummary();
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

  // Class detail panel — skill & arcano clicks
  document.getElementById('classDetailBody').addEventListener('click', e => {
    const skillBtn = e.target.closest('[data-skill-open]');
    if (skillBtn) {
      Renderer.openSkillModal(skillBtn.dataset.skillOpen);
      return;
    }
    const arcanoBtn = e.target.closest('[data-arcano-id]');
    if (arcanoBtn) {
      Renderer.openArcanoModal(arcanoBtn.dataset.arcanoId);
      return;
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
    const arcanoCard = e.target.closest('.arcano-skill-card');
    if (arcanoCard) {
      Renderer.openArcanoModal(arcanoCard.dataset.arcanoId);
      return;
    }
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
// INVENTÁRIO
// ════════════════════════════════════════════════════════════

let _currentInventoryFilter = 'all';

function _registerInventoryEvents() {
  // Botão adicionar item genérico
  document.getElementById('addItemBtn').addEventListener('click', () => {
    Renderer.openItemModal(null);
  });

  // Botão loja de armas
  document.getElementById('weaponShopBtn').addEventListener('click', () => {
    Renderer.openWeaponShop();
  });

  // Botão loja de armaduras
  document.getElementById('armorShopBtn').addEventListener('click', () => {
    Renderer.openArmorShop();
  });

  // Filter tabs
  document.getElementById('invFilterTabs').addEventListener('click', e => {
    const tab = e.target.closest('[data-inv-filter]');
    if (!tab) return;
    _currentInventoryFilter = tab.dataset.invFilter;
    Renderer.renderInventory(_currentInventoryFilter);
  });

  // Equipment summary: unequip shield
  document.getElementById('equipSummary').addEventListener('click', e => {
    if (e.target.closest('[data-unequip-shield]')) {
      _unequipShield();
    }
  });

  // Edit / Delete / View / Equip delegation na grid
  document.getElementById('inventoryGrid').addEventListener('click', e => {
    const editBtn       = e.target.closest('[data-edit-item]');
    const deleteBtn     = e.target.closest('[data-delete-item]');
    const viewWeapon    = e.target.closest('[data-view-weapon]');
    const viewArmor     = e.target.closest('[data-view-armor]');
    const viewShield    = e.target.closest('[data-view-shield]');
    const equipArmor    = e.target.closest('[data-equip-armor]');
    const equipShield   = e.target.closest('[data-equip-shield]');
    const unequipShield = e.target.closest('[data-unequip-shield]');

    if (viewWeapon) {
      Renderer.openWeaponDetail(viewWeapon.dataset.viewWeapon);
      return;
    }
    if (viewArmor) {
      Renderer.openArmorDetail(viewArmor.dataset.viewArmor);
      return;
    }
    if (viewShield) {
      Renderer.openArmorDetail(viewShield.dataset.viewShield);
      return;
    }
    if (equipArmor) {
      _equipArmor(equipArmor.dataset.equipArmor);
      return;
    }
    if (equipShield) {
      _equipShield(equipShield.dataset.equipShield);
      return;
    }
    if (unequipShield) {
      _unequipShield();
      return;
    }
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

function _equipArmor(armorId) {
  State.set('equipamento.armadura', armorId);
  Renderer.renderInventory(_currentInventoryFilter);
  Renderer.renderDerivedStats();
  const armor = getArmorById(armorId);
  Toast.show(`${armor?.nome || 'Armadura'} equipada!`, 'success');
}

function _equipShield(shieldId) {
  State.set('equipamento.escudo', shieldId);
  Renderer.renderInventory(_currentInventoryFilter);
  Renderer.renderDerivedStats();
  const shield = getShieldById(shieldId);
  Toast.show(`${shield?.nome || 'Escudo'} equipado!`, 'success');
}

function _unequipShield() {
  State.set('equipamento.escudo', null);
  Renderer.renderInventory(_currentInventoryFilter);
  Renderer.renderDerivedStats();
  Toast.show('Escudo desequipado.', 'default');
}

function _addWeaponToInventory(weapon) {
  const items = State.get('inventario') || [];
  items.push({
    id:       generateId(),
    nome:     weapon.nome,
    tipo:     'arma',
    weaponId: weapon.id,
    qtd:      1,
    desc:     weapon.especial || '',
  });
  State.set('inventario', items);
}

function _addArmorToInventory(item, armor, shield) {
  const items = State.get('inventario') || [];
  const invItem = {
    id:   generateId(),
    nome: item.nome,
    tipo: item.tipo,
    qtd:  1,
    desc: item.especial || '',
  };
  if (armor)  invItem.armorId  = item.id;
  if (shield) invItem.shieldId = item.id;
  items.push(invItem);
  State.set('inventario', items);
}

// ════════════════════════════════════════════════════════════
// ZÊNITES
// ════════════════════════════════════════════════════════════

function _hydrateZenites() {
  const val = State.get('zenites') ?? 500;
  document.getElementById('zenitesValue').value = val;
}

function _registerZenitesEvents() {
  const input = document.getElementById('zenitesValue');

  input.addEventListener('change', () => {
    const val = Math.max(0, parseInt(input.value) || 0);
    input.value = val;
    State.set('zenites', val);
  });
}

// ════════════════════════════════════════════════════════════
// MODAL DELEGATION — Ações dentro de modais
// ════════════════════════════════════════════════════════════

function _registerModalDelegation() {
  document.getElementById('modalContent').addEventListener('click', e => {
    // Toggle skill learned/unlearned
    const toggleSkill = e.target.closest('[data-modal-action="toggleSkill"]');
    if (toggleSkill) {
      const skillId = toggleSkill.dataset.targetSkill;
      const current = State.get('habilidades') || [];
      if (current.includes(skillId)) {
        State.set('habilidades', current.filter(id => id !== skillId));
        Toast.show('Habilidade removida', 'default');
      } else {
        State.set('habilidades', [...current, skillId]);
        Toast.show('Habilidade aprendida!', 'success');
      }
      Modal.close();
      Renderer.renderSkills(_currentSkillFilter);
      return;
    }

    const quickSkill = e.target.closest('[data-skill-open]');
    if (quickSkill) {
      Renderer.openSkillModal(quickSkill.dataset.skillOpen);
      return;
    }

    // ── Arcano detail modal ──
    const arcanoEl = e.target.closest('[data-arcano-id]');
    if (arcanoEl) {
      Renderer.openArcanoModal(arcanoEl.dataset.arcanoId);
      return;
    }

    // ── Weapon shop: buy weapon (costs zenites) ──
    const buyBtn = e.target.closest('[data-buy-weapon]');
    if (buyBtn) {
      const weaponId = buyBtn.dataset.buyWeapon;
      const weapon   = getWeaponById(weaponId);
      if (!weapon) return;
      const zenites = State.get('zenites') || 0;
      if (zenites < weapon.custo) {
        Toast.show('Zênites insuficientes!', 'danger');
        return;
      }
      State.set('zenites', zenites - weapon.custo);
      _addWeaponToInventory(weapon);
      const zInput = document.getElementById('zenitesValue');
      if (zInput) zInput.value = State.get('zenites');
      Renderer.renderInventory(_currentInventoryFilter);
      Toast.show(`${weapon.nome} comprada!`, 'success');
      Renderer.openWeaponShop(weapon.categoria);
      return;
    }

    // ── Weapon shop: add weapon (free) ──
    const addWeaponBtn = e.target.closest('[data-add-weapon]');
    if (addWeaponBtn) {
      const weapon = getWeaponById(addWeaponBtn.dataset.addWeapon);
      if (!weapon) return;
      _addWeaponToInventory(weapon);
      Renderer.renderInventory(_currentInventoryFilter);
      Toast.show(`${weapon.nome} adicionada!`, 'success');
      Renderer.openWeaponShop(weapon.categoria);
      return;
    }

    // ── Weapon shop: switch category ──
    const catBtn = e.target.closest('[data-weapon-cat]');
    if (catBtn) {
      Renderer.openWeaponShop(catBtn.dataset.weaponCat);
      return;
    }

    // ── Weapon shop: open weapon detail ──
    const detailEl = e.target.closest('[data-weapon-detail]');
    if (detailEl) {
      Renderer.openWeaponDetail(detailEl.dataset.weaponDetail);
      return;
    }

    // ── Armor shop: buy armor/shield (costs zenites) ──
    const buyArmorBtn = e.target.closest('[data-buy-armor]');
    if (buyArmorBtn) {
      const itemId = buyArmorBtn.dataset.buyArmor;
      const armor  = getArmorById(itemId);
      const shield = getShieldById(itemId);
      const item   = armor || shield;
      if (!item) return;
      const zenites = State.get('zenites') || 0;
      if (zenites < item.custo) {
        Toast.show('Zênites insuficientes!', 'danger');
        return;
      }
      State.set('zenites', zenites - item.custo);
      _addArmorToInventory(item, armor, shield);
      const zInput = document.getElementById('zenitesValue');
      if (zInput) zInput.value = State.get('zenites');
      Renderer.renderInventory(_currentInventoryFilter);
      Toast.show(`${item.nome} comprado!`, 'success');
      Renderer.openArmorShop(shield ? 'Escudos' : 'Armaduras');
      return;
    }

    // ── Armor shop: add armor/shield (free) ──
    const addArmorBtn = e.target.closest('[data-add-armor]');
    if (addArmorBtn) {
      const itemId = addArmorBtn.dataset.addArmor;
      const armor  = getArmorById(itemId);
      const shield = getShieldById(itemId);
      const item   = armor || shield;
      if (!item) return;
      _addArmorToInventory(item, armor, shield);
      Renderer.renderInventory(_currentInventoryFilter);
      Toast.show(`${item.nome} adicionado!`, 'success');
      Renderer.openArmorShop(shield ? 'Escudos' : 'Armaduras');
      return;
    }

    // ── Armor shop: switch category ──
    const armorCatBtn = e.target.closest('[data-armor-cat]');
    if (armorCatBtn) {
      Renderer.openArmorShop(armorCatBtn.dataset.armorCat);
      return;
    }

    // ── Armor shop: open armor/shield detail ──
    const armorDetailEl = e.target.closest('[data-armor-detail]');
    if (armorDetailEl) {
      Renderer.openArmorDetail(armorDetailEl.dataset.armorDetail);
      return;
    }

    const actionEl = e.target.closest('[data-modal-action]');
    if (!actionEl) {
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

      case 'saveTraco': {
        const key   = actionEl.dataset.tracoKey;
        const input = document.getElementById('tracoEditInput');
        if (key && input) {
          State.set(`identidade.tracos.${key}`, input.value.trim());
          Renderer.renderTracos();
          Toast.show('Traço atualizado!', 'success');
        }
        Modal.close();
        break;
      }

      case 'equipArmor': {
        const armorId   = actionEl.dataset.armorId;
        const armorType = actionEl.dataset.armorType;
        if (armorType === 'escudo') {
          _equipShield(armorId);
        } else {
          _equipArmor(armorId);
        }
        Modal.close();
        break;
      }

      case 'unequipShield': {
        _unequipShield();
        Modal.close();
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
