/* ═══════════════════════════════════════════════════════════════
   state.js — Gerenciamento de Estado do Personagem
   Fabula Ultima – Ficha de Personagem
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────
// ESTRUTURA DE ESTADO INICIAL
// ─────────────────────────────────────────────────

const DEFAULT_STATE = {
  identidade: {
    nome:     '',
    nivel:    1,
    conceito: '',
    origem:   '',
    vinculo:  '',
    notas:    '',
    avatarLetra: '',
    avatarImg: '',
  },

  atributos: {
    des: { nivel: 1 },  // Destreza
    ins: { nivel: 1 },  // Insight
    vig: { nivel: 1 },  // Vigor
    von: { nivel: 1 },  // Vontade
  },

  classes: [],          // Array de IDs de classes selecionadas (máx. 2)

  recursos: {
    pv:      { atual: 0, max: 0 },
    pm:      { atual: 0, max: 0 },
    ip:      { atual: 6, max: 6 },   // Pontos de Invenção
  },

  condicoes: {
    lento:      false,
    fraco:      false,
    abalado:    false,
    envenenado: false,
    confuso:    false,
    provocado:  false,
    exausto:    false,
    cansado:    false,
  },

  inventario: [],   // Array de { id, nome, tipo, desc, qtd, peso, valor, notas }
};

// ─────────────────────────────────────────────────
// ESTADO REATIVO
// ─────────────────────────────────────────────────

const State = (() => {
  let _data = deepClone(DEFAULT_STATE);
  const _listeners = {};

  // Verifica se há dado salvo no localStorage
  function init() {
    try {
      const saved = localStorage.getItem('fabula_ultima_character');
      if (saved) {
        const parsed = JSON.parse(saved);
        _data = deepMerge(deepClone(DEFAULT_STATE), parsed);
      }
    } catch (e) {
      console.warn('[State] Nenhum dado salvo encontrado, usando padrão.');
    }
  }

  function get(path) {
    if (!path) return deepClone(_data);
    return getNestedValue(_data, path);
  }

  function set(path, value) {
    setNestedValue(_data, path, value);
    _persist();
    _emit(path, value);
  }

  function update(path, updater) {
    const current = getNestedValue(_data, path);
    const next    = updater(deepClone(current));
    setNestedValue(_data, path, next);
    _persist();
    _emit(path, next);
  }

  function on(event, callback) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(callback);
  }

  function off(event, callback) {
    if (!_listeners[event]) return;
    _listeners[event] = _listeners[event].filter(cb => cb !== callback);
  }

  function emit(event, data) {
    _emit(event, data);
  }

  function reset() {
    _data = deepClone(DEFAULT_STATE);
    _persist();
    _emit('reset', null);
  }

  function _persist() {
    try {
      localStorage.setItem('fabula_ultima_character', JSON.stringify(_data));
    } catch (e) {
      console.warn('[State] Falha ao persistir dados.');
    }
  }

  function _emit(event, data) {
    const handlers = _listeners[event] || [];
    handlers.forEach(cb => cb(data));

    // Sempre emite um evento genérico 'change'
    const changeHandlers = _listeners['change'] || [];
    changeHandlers.forEach(cb => cb({ event, data }));
  }

  return { init, get, set, update, on, off, emit, reset };
})();

// ─────────────────────────────────────────────────
// COMPUTED VALUES (valores calculados/derivados)
// ─────────────────────────────────────────────────

const Computed = {
  // Retorna o dado do atributo (d6, d8, etc.)
  getDadoAtributo(nivel) {
    const DADOS = ['', 'd6', 'd8', 'd10', 'd12'];
    return DADOS[Math.min(nivel, 4)] || 'd6';
  },

  // Calcula PV máximo
  calcMaxPV(vigNivel, nivel) {
    const vigDado = [0, 6, 8, 10, 12][Math.min(vigNivel, 4)];
    return vigDado + (nivel * 5);
  },

  // Calcula PM máximo
  calcMaxPM(vonNivel, nivel) {
    const vonDado = [0, 6, 8, 10, 12][Math.min(vonNivel, 4)];
    return vonDado + (nivel * 5);
  },

  // Calcula Iniciativa
  calcIniciativa(desNivel, insNivel) {
    return desNivel + insNivel;
  },

  // Calcula Defesa base
  calcDefesa(desNivel) {
    return 10 + desNivel;
  },

  // Calcula Resistência Mágica base
  calcResMagica(insNivel) {
    return 10 + insNivel;
  },

  // Todos os derivados em um objeto
  all() {
    const state  = State.get();
    const attrs  = state.atributos;
    const nivel  = state.identidade.nivel;
    return {
      pvMax:      this.calcMaxPV(attrs.vig.nivel, nivel),
      pmMax:      this.calcMaxPM(attrs.von.nivel, nivel),
      iniciativa: this.calcIniciativa(attrs.des.nivel, attrs.ins.nivel),
      defesa:     this.calcDefesa(attrs.des.nivel),
      resMagica:  this.calcResMagica(attrs.ins.nivel),
    };
  }
};

// ─────────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────────

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((acc, key) => acc[key], obj);
  if (target) target[last] = value;
}

// ID único para itens de inventário
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
