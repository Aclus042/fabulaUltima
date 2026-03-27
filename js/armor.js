/* ═══════════════════════════════════════════════════════════════
   armor.js — Banco de Dados de Armaduras e Escudos
   Fabula Ultima – Ficha de Personagem
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────
// CATEGORIAS
// ─────────────────────────────────────────────────

const ARMOR_CATEGORIES = ['Armaduras', 'Escudos'];

// ─────────────────────────────────────────────────
// ARMADURAS
// ─────────────────────────────────────────────────

const ARMORS = [
  {
    id: 'sem_armadura',
    nome: 'Sem armadura',
    tipo: 'armadura',
    custo: 0,
    defesa: { base: 'DES', bonus: 0 },
    defesaMagica: { base: 'AST', bonus: 0 },
    iniciativa: 0,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'camisa_de_seda',
    nome: 'Camisa de seda',
    tipo: 'armadura',
    custo: 100,
    defesa: { base: 'DES', bonus: 0 },
    defesaMagica: { base: 'AST', bonus: 2 },
    iniciativa: -1,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'traje_de_viagem',
    nome: 'Traje de viagem',
    tipo: 'armadura',
    custo: 100,
    defesa: { base: 'DES', bonus: 1 },
    defesaMagica: { base: 'AST', bonus: 1 },
    iniciativa: -1,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'tunica_de_combate',
    nome: 'Túnica de combate',
    tipo: 'armadura',
    custo: 150,
    defesa: { base: 'DES', bonus: 1 },
    defesaMagica: { base: 'AST', bonus: 1 },
    iniciativa: 0,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'vestes_de_sabio',
    nome: 'Vestes de sábio',
    tipo: 'armadura',
    custo: 200,
    defesa: { base: 'DES', bonus: 1 },
    defesaMagica: { base: 'AST', bonus: 2 },
    iniciativa: -2,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'brigantina',
    nome: 'Brigantina',
    tipo: 'armadura',
    custo: 150,
    defesa: { base: null, bonus: 10 },
    defesaMagica: { base: 'AST', bonus: 0 },
    iniciativa: -2,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'placa_de_bronze',
    nome: 'Placa de bronze',
    tipo: 'armadura',
    custo: 200,
    defesa: { base: null, bonus: 11 },
    defesaMagica: { base: 'AST', bonus: 0 },
    iniciativa: -3,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'placa_runica',
    nome: 'Placa rúnica',
    tipo: 'armadura',
    custo: 250,
    defesa: { base: null, bonus: 11 },
    defesaMagica: { base: 'AST', bonus: 1 },
    iniciativa: -3,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'placa_de_aco',
    nome: 'Placa de aço',
    tipo: 'armadura',
    custo: 300,
    defesa: { base: null, bonus: 12 },
    defesaMagica: { base: 'AST', bonus: 0 },
    iniciativa: -4,
    especial: 'Sem habilidades especiais.',
  },
];

// ─────────────────────────────────────────────────
// ESCUDOS
// ─────────────────────────────────────────────────

const SHIELDS = [
  {
    id: 'escudo_de_bronze',
    nome: 'Escudo de bronze',
    tipo: 'escudo',
    custo: 100,
    defesa: 2,
    defesaMagica: 0,
    iniciativa: 0,
    especial: 'Sem habilidades especiais.',
  },
  {
    id: 'escudo_runico',
    nome: 'Escudo rúnico',
    tipo: 'escudo',
    custo: 150,
    defesa: 2,
    defesaMagica: 2,
    iniciativa: 0,
    especial: 'Sem habilidades especiais.',
  },
];

// ─────────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────────

const _ARMOR_DADOS_VALOR = [0, 6, 8, 10, 12];

/**
 * Calcula o valor numérico de defesa de uma armadura baseado nos atributos.
 * Para armaduras com base em dado (DES/AST): valor do dado + bônus
 * Para armaduras com valor fixo (base null): apenas o bônus
 */
function calcArmorStat(statObj) {
  if (statObj.base) {
    const attrs = State.get('atributos');
    const key = ATTR_KEY_MAP[statObj.base];
    const nivel = Math.min(attrs[key]?.nivel || 1, 4);
    const dado = _ARMOR_DADOS_VALOR[nivel];
    return dado + statObj.bonus;
  }
  return statObj.bonus;
}

/**
 * Retorna string legível de um stat de armadura.
 * Ex: "Dado de DES +1", "10", "Dado de AST"
 */
function formatArmorStat(statObj) {
  if (statObj.base) {
    const bonusStr = statObj.bonus > 0 ? ` +${statObj.bonus}` : '';
    return `Dado de ${statObj.base}${bonusStr}`;
  }
  return String(statObj.bonus);
}

/**
 * Calcula todos os valores derivados de uma armadura equipada.
 * Retorna { defesa, defesaMagica, iniciativa }
 */
function calcArmorValues(armor) {
  return {
    defesa:       calcArmorStat(armor.defesa),
    defesaMagica: calcArmorStat(armor.defesaMagica),
    iniciativa:   armor.iniciativa,
  };
}

/**
 * Calcula os bônus de um escudo equipado.
 * Retorna { defesa, defesaMagica, iniciativa }
 */
function calcShieldValues(shield) {
  return {
    defesa:       shield.defesa,
    defesaMagica: shield.defesaMagica,
    iniciativa:   shield.iniciativa,
  };
}

/** Busca armadura pelo ID */
function getArmorById(id) {
  return ARMORS.find(a => a.id === id) || null;
}

/** Busca escudo pelo ID */
function getShieldById(id) {
  return SHIELDS.find(s => s.id === id) || null;
}

/** Busca armadura ou escudo pelo ID */
function getArmorOrShieldById(id) {
  return getArmorById(id) || getShieldById(id) || null;
}
