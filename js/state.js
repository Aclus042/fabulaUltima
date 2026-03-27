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
    avatarLetra: '',
    avatarImg: '',
    tracos: {
      identidade: '',
      origem:     '',
      tema:       '',
    },
    lacos: [],            // Array de { nome, emocoes: { admiracao, lealdade, afeto } }  — cada emoção: 'positivo' | 'negativo' | null
    pontosFabula: 3,
    notas: '',
  },

  atributos: {
    des: { nivel: 1 },  // Destreza
    ast: { nivel: 1 },  // Astúcia
    vig: { nivel: 1 },  // Vigor
    von: { nivel: 1 },  // Vontade
  },

  classes: [],          // Array de IDs de classes selecionadas (máx. 2)
  habilidades: [],      // Array de IDs de habilidades aprendidas

  recursos: {
    pv:      { atual: 0, max: 0 },
    pm:      { atual: 0, max: 0 },
    ip:      { atual: 6, max: 6 },   // Pontos de Invenção
  },

  condicoes: {
    abalado:     false,  // −1 VON
    atordoado:   false,  // −1 AST
    enfurecido:  false,  // −1 DES, −1 AST
    envenenado:  false,  // −1 VIG, −1 VON
    fraco:       false,  // −1 VIG
    lento:       false,  // −1 DES
  },

  zenites: 500,

  equipamento: {
    armadura: 'sem_armadura',   // ID da armadura equipada
    escudo:   null,             // ID do escudo equipado (ou null)
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
    return nivel + (vigDado * 5);
  },

  // Calcula PM máximo
  calcMaxPM(vonNivel, nivel) {
    const vonDado = [0, 6, 8, 10, 12][Math.min(vonNivel, 4)];
    return nivel + (vonDado * 5);
  },

  // Calcula Iniciativa (base, sem armadura)
  calcIniciativa(desNivel, astNivel) {
    return desNivel + astNivel;
  },

  // Calcula Defesa base (sem armadura — dado de DES)
  calcDefesa(desNivel) {
    const desDado = [0, 6, 8, 10, 12][Math.min(desNivel, 4)];
    return desDado;
  },

  // Calcula Resistência Mágica base (sem armadura — dado de AST)
  calcResMagica(astNivel) {
    const astDado = [0, 6, 8, 10, 12][Math.min(astNivel, 4)];
    return astDado;
  },

  // Todos os derivados em um objeto (COM armadura e escudo)
  all() {
    const state  = State.get();
    const attrs  = state.atributos;
    const nivel  = state.identidade.nivel;
    const equip  = state.equipamento || {};

    // Base values
    let defesa     = this.calcDefesa(attrs.des.nivel);
    let resMagica  = this.calcResMagica(attrs.ast.nivel);
    let iniciativa = this.calcIniciativa(attrs.des.nivel, attrs.ast.nivel);

    // Armadura equipada
    const armorId = equip.armadura || 'sem_armadura';
    const armor   = typeof getArmorById === 'function' ? getArmorById(armorId) : null;
    if (armor) {
      const av = calcArmorValues(armor);
      defesa     = av.defesa;
      resMagica  = av.defesaMagica;
      iniciativa += av.iniciativa;
    }

    // Escudo equipado
    const shieldId = equip.escudo || null;
    const shield   = shieldId && typeof getShieldById === 'function' ? getShieldById(shieldId) : null;
    if (shield) {
      const sv = calcShieldValues(shield);
      defesa     += sv.defesa;
      resMagica  += sv.defesaMagica;
      iniciativa += sv.iniciativa;
    }

    return {
      pvMax:      this.calcMaxPV(attrs.vig.nivel, nivel),
      pmMax:      this.calcMaxPM(attrs.von.nivel, nivel),
      iniciativa,
      defesa,
      resMagica,
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
