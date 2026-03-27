/* ═══════════════════════════════════════════════════════════════
   weapons.js — Banco de Dados de Armas
   Fabula Ultima – Ficha de Personagem
═══════════════════════════════════════════════════════════════ */

'use strict';

const WEAPON_CATEGORIES = [
  'Armas Arcanas',
  'Arcos',
  'Luta',
  'Adagas',
  'Armas de Fogo',
  'Malhos',
  'Armas Pesadas',
  'Lanças',
  'Espadas',
  'Arremesso',
];

const WEAPONS = [
  // ── Armas Arcanas ──
  {
    id: 'cajado',
    nome: 'Cajado',
    categoria: 'Armas Arcanas',
    custo: 100,
    precisao: ['VON', 'VON'],
    bonusPrecisao: 0,
    dano: 6,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'corpo a corpo',
    especial: '',
  },
  {
    id: 'tomo',
    nome: 'Tomo',
    categoria: 'Armas Arcanas',
    custo: 100,
    precisao: ['AST', 'AST'],
    bonusPrecisao: 0,
    dano: 6,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'corpo a corpo',
    especial: '',
  },

  // ── Arcos ──
  {
    id: 'besta',
    nome: 'Besta',
    categoria: 'Arcos',
    custo: 150,
    precisao: ['DES', 'AST'],
    bonusPrecisao: 0,
    dano: 8,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'distância',
    especial: '',
  },
  {
    id: 'arco_curto',
    nome: 'Arco curto',
    categoria: 'Arcos',
    custo: 200,
    precisao: ['DES', 'DES'],
    bonusPrecisao: 0,
    dano: 8,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'distância',
    especial: '',
  },

  // ── Luta ──
  {
    id: 'ataque_desarmado',
    nome: 'Ataque desarmado',
    categoria: 'Luta',
    custo: 0,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 0,
    dano: 0,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: 'Equipado em mãos vazias',
  },
  {
    id: 'improvisada_luta',
    nome: 'Improvisada',
    categoria: 'Luta',
    custo: 0,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 0,
    dano: 2,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: 'Quebra após ataque',
  },
  {
    id: 'soqueira_de_ferro',
    nome: 'Soqueira de ferro',
    categoria: 'Luta',
    custo: 150,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 0,
    dano: 6,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: '',
  },

  // ── Adagas ──
  {
    id: 'adaga_de_aco',
    nome: 'Adaga de aço',
    categoria: 'Adagas',
    custo: 150,
    precisao: ['DES', 'AST'],
    bonusPrecisao: 1,
    dano: 4,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: '',
  },

  // ── Armas de Fogo ──
  {
    id: 'pistola',
    nome: 'Pistola',
    categoria: 'Armas de Fogo',
    custo: 250,
    precisao: ['DES', 'AST'],
    bonusPrecisao: 0,
    dano: 8,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'distância',
    especial: '',
  },

  // ── Malhos ──
  {
    id: 'chicote_de_correntes',
    nome: 'Chicote de correntes',
    categoria: 'Malhos',
    custo: 150,
    precisao: ['DES', 'DES'],
    bonusPrecisao: 0,
    dano: 8,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'corpo a corpo',
    especial: '',
  },

  // ── Armas Pesadas ──
  {
    id: 'martelo_de_ferro',
    nome: 'Martelo de ferro',
    categoria: 'Armas Pesadas',
    custo: 200,
    precisao: ['VIG', 'VIG'],
    bonusPrecisao: 0,
    dano: 6,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: '',
  },
  {
    id: 'machado_largo',
    nome: 'Machado largo',
    categoria: 'Armas Pesadas',
    custo: 250,
    precisao: ['VIG', 'VIG'],
    bonusPrecisao: 0,
    dano: 10,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: '',
  },
  {
    id: 'machado_de_guerra',
    nome: 'Machado de guerra',
    categoria: 'Armas Pesadas',
    custo: 250,
    precisao: ['VIG', 'VIG'],
    bonusPrecisao: 0,
    dano: 14,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'corpo a corpo',
    especial: '',
  },

  // ── Lanças ──
  {
    id: 'lanca_leve',
    nome: 'Lança leve',
    categoria: 'Lanças',
    custo: 200,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 0,
    dano: 8,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: '',
  },
  {
    id: 'lanca_pesada',
    nome: 'Lança pesada',
    categoria: 'Lanças',
    custo: 200,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 0,
    dano: 12,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'corpo a corpo',
    especial: '',
  },

  // ── Espadas ──
  {
    id: 'espada_de_bronze',
    nome: 'Espada de bronze',
    categoria: 'Espadas',
    custo: 200,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 1,
    dano: 6,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: '',
  },
  {
    id: 'montante',
    nome: 'Montante',
    categoria: 'Espadas',
    custo: 200,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 1,
    dano: 10,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'corpo a corpo',
    especial: '',
  },
  {
    id: 'katana',
    nome: 'Katana',
    categoria: 'Espadas',
    custo: 200,
    precisao: ['DES', 'AST'],
    bonusPrecisao: 1,
    dano: 10,
    tipoDano: 'fisico',
    empunhadura: 'duas mãos',
    alcance: 'corpo a corpo',
    especial: '',
  },
  {
    id: 'rapieira',
    nome: 'Rapieira',
    categoria: 'Espadas',
    custo: 200,
    precisao: ['DES', 'AST'],
    bonusPrecisao: 1,
    dano: 6,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'corpo a corpo',
    especial: '',
  },

  // ── Arremesso ──
  {
    id: 'improvisada_arremesso',
    nome: 'Improvisada',
    categoria: 'Arremesso',
    custo: 0,
    precisao: ['DES', 'VIG'],
    bonusPrecisao: 0,
    dano: 2,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'distância',
    especial: 'Quebra após ataque',
  },
  {
    id: 'shuriken',
    nome: 'Shuriken',
    categoria: 'Arremesso',
    custo: 150,
    precisao: ['DES', 'AST'],
    bonusPrecisao: 0,
    dano: 4,
    tipoDano: 'fisico',
    empunhadura: 'uma mão',
    alcance: 'distância',
    especial: '',
  },
];

// ─────────────────────────────────────────────────
// UTILITÁRIOS DE ARMAS
// ─────────────────────────────────────────────────

/** Mapeia abreviação → chave do atributo */
const ATTR_KEY_MAP = { DES: 'des', AST: 'ast', VIG: 'vig', VON: 'von' };
const DADOS_VALOR  = [0, 6, 8, 10, 12];

/**
 * Calcula precisão numérica da arma com base nos atributos do personagem.
 * Retorna um objeto { formula, total }.
 */
function calcWeaponPrecisao(weapon) {
  const attrs = State.get('atributos');
  const k1    = ATTR_KEY_MAP[weapon.precisao[0]];
  const k2    = ATTR_KEY_MAP[weapon.precisao[1]];
  const d1    = DADOS_VALOR[Math.min(attrs[k1]?.nivel || 1, 4)];
  const d2    = DADOS_VALOR[Math.min(attrs[k2]?.nivel || 1, 4)];
  const bonus = weapon.bonusPrecisao || 0;
  return {
    formula: `【${weapon.precisao[0]} + ${weapon.precisao[1]}】${bonus ? ` +${bonus}` : ''}`,
    dado1: `d${d1}`,
    dado2: `d${d2}`,
    total: d1 + d2 + bonus,
  };
}

/** Formata o dano da arma como string */
function formatWeaponDano(weapon) {
  return weapon.dano > 0 ? `RA+${weapon.dano}` : 'RA+0';
}

/** Busca arma pelo ID */
function getWeaponById(id) {
  return WEAPONS.find(w => w.id === id) || null;
}

/** Filtra armas por categoria */
function getWeaponsByCategory(cat) {
  return WEAPONS.filter(w => w.categoria === cat);
}
