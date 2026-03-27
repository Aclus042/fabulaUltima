/* ═══════════════════════════════════════════════════════════════
   classes.js — Dados de Classes Oficiais de Fabula Ultima
   Fabula Ultima – Ficha de Personagem
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────
// DADOS DAS CLASSES (15 oficiais)
// ─────────────────────────────────────────────────

const CLASSES = [
  {
    id: 'andarilho',
    nome: 'Andarilho',
    tier: 'Especialista',
    cor: '#7f9dbb',
    beneficioInicial: 'Aumente permanentemente seus PI máximos em 2.',
    habilidades: [
      'andarilho_cacador_de_tesouros',
      'andarilho_companheiro_fiel',
      'andarilho_papo_de_taverna',
      'andarilho_pratico',
      'andarilho_viajante'
    ]
  },
  {
    id: 'arcanista',
    nome: 'Arcanista',
    tier: 'Conjurador',
    cor: '#8a66d1',
    beneficioInicial: 'Aumente permanentemente seus PM máximos em 5.',
    habilidades: [
      'arcanista_arcanismo_ritualista',
      'arcanista_arcano_emergencial',
      'arcanista_circulo_arcano',
      'arcanista_regeneracao_arcana',
      'arcanista_vincular_e_invocar'
    ],
    arcanos: true
  },
  {
    id: 'atirador',
    nome: 'Atirador',
    tier: 'Ofensivo',
    cor: '#6bb58a',
    beneficioInicial: 'Aumente permanentemente seus PV máximos em 5. Você pode equipar armas à distância e escudos marciais.',
    habilidades: [
      'atirador_barragem',
      'atirador_fogo_cruzado',
      'atirador_maestria_distancia',
      'atirador_olhos_de_aguia',
      'atirador_tiro_de_aviso'
    ]
  },
  {
    id: 'elementalista',
    nome: 'Elementalista',
    tier: 'Conjurador',
    cor: '#5a8fd8',
    habilidades: []
  },
  {
    id: 'entropista',
    nome: 'Entropista',
    tier: 'Ocultista',
    cor: '#7a5b8c',
    habilidades: []
  },
  {
    id: 'erudito',
    nome: 'Erudito',
    tier: 'Tático',
    cor: '#b79a68',
    habilidades: []
  },
  {
    id: 'espiritualista',
    nome: 'Espiritualista',
    tier: 'Suporte',
    cor: '#d0b46f',
    habilidades: []
  },
  {
    id: 'furioso',
    nome: 'Furioso',
    tier: 'Ofensivo',
    cor: '#d06752',
    habilidades: []
  },
  {
    id: 'guardiao',
    nome: 'Guardião',
    tier: 'Defensivo',
    cor: '#5f80b9',
    habilidades: []
  },
  {
    id: 'guerreiro_sombrio',
    nome: 'Guerreiro Sombrio',
    tier: 'Ocultista',
    cor: '#6d5f95',
    habilidades: []
  },
  {
    id: 'inventor',
    nome: 'Inventor',
    tier: 'Técnico',
    cor: '#9d7a52',
    habilidades: []
  },
  {
    id: 'ladino',
    nome: 'Ladino',
    tier: 'Ágil',
    cor: '#63a279',
    habilidades: []
  },
  {
    id: 'mestre_de_armas',
    nome: 'Mestre de Armas',
    tier: 'Marcial',
    cor: '#c89b4f',
    habilidades: []
  },
  {
    id: 'orador',
    nome: 'Orador',
    tier: 'Suporte',
    cor: '#b168a5',
    habilidades: []
  },
  {
    id: 'quimerista',
    nome: 'Quimerista',
    tier: 'Especialista',
    cor: '#78b36e',
    habilidades: []
  },
];

// ─────────────────────────────────────────────────
// HELPER: buscar classe por ID
// ─────────────────────────────────────────────────

function getClassById(id) {
  return CLASSES.find(c => c.id === id) || null;
}

// Máximo de classes simultâneas
const MAX_CLASSES = 2;
