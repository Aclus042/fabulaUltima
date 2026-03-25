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
    descricao: 'Viajantes experientes em exploração, sobrevivência e leitura de terrenos hostis.',
    habilidades: [
      'andarilho_trilha_invisivel',
      'andarilho_instinto_natural',
      'andarilho_passo_longo',
      'andarilho_mapa_vivo',
      'andarilho_cacador_errante',
      'andarilho_refugio_rapido'
    ]
  },
  {
    id: 'arcanista',
    nome: 'Arcanista',
    tier: 'Conjurador',
    cor: '#8a66d1',
    descricao: 'Estudiosos da magia pura, capazes de moldar energia arcana em efeitos devastadores.',
    habilidades: [
      'arcanista_raio_arcano',
      'arcanista_escudo_mistico',
      'arcanista_teia_de_runas',
      'arcanista_sobrecarga_arcana',
      'arcanista_concentracao_perfeita',
      'arcanista_reescrever_formula'
    ]
  },
  {
    id: 'atirador',
    nome: 'Atirador',
    tier: 'Ofensivo',
    cor: '#6bb58a',
    descricao: 'Combatentes de precisão letal, especialistas em eliminar ameaças à distância.',
    habilidades: [
      'atirador_tiro_certeiro',
      'atirador_disparo_duplo',
      'atirador_mira_fria',
      'atirador_tiro_perfurante',
      'atirador_cobertura_tatica',
      'atirador_chuva_de_projeteis'
    ]
  },
  {
    id: 'elementalista',
    nome: 'Elementalista',
    tier: 'Conjurador',
    cor: '#5a8fd8',
    descricao: 'Mestres dos elementos primordiais, alternando entre destruição e controle de campo.',
    habilidades: [
      'elementalista_lanca_fulgurante',
      'elementalista_esfera_ignea',
      'elementalista_manto_gelido',
      'elementalista_muralha_telurica',
      'elementalista_corrente_tempestuosa',
      'elementalista_sinfonia_elemental'
    ]
  },
  {
    id: 'entropista',
    nome: 'Entropista',
    tier: 'Ocultista',
    cor: '#7a5b8c',
    descricao: 'Manipuladores do acaso e da decadência, capazes de corroer destino e matéria.',
    habilidades: [
      'entropista_marca_da_ruina',
      'entropista_queda_de_probabilidade',
      'entropista_esfacelar',
      'entropista_caos_controlado',
      'entropista_debito_entripico',
      'entropista_colapso_local'
    ]
  },
  {
    id: 'erudito',
    nome: 'Erudito',
    tier: 'Tático',
    cor: '#b79a68',
    descricao: 'Acadêmicos brilhantes que vencem conflitos com estratégia, análise e conhecimento.',
    habilidades: [
      'erudito_analise_tatica',
      'erudito_ponto_fraco',
      'erudito_teorema_defensivo',
      'erudito_arquivo_vivo',
      'erudito_plano_impecavel',
      'erudito_hipotese_suprema'
    ]
  },
  {
    id: 'espiritualista',
    nome: 'Espiritualista',
    tier: 'Suporte',
    cor: '#d0b46f',
    descricao: 'Mediadores entre mundo material e espiritual, curando, protegendo e purificando.',
    habilidades: [
      'espiritualista_luz_reparadora',
      'espiritualista_selo_protetor',
      'espiritualista_prece_renovadora',
      'espiritualista_exorcismo',
      'espiritualista_vigilia_sagrada',
      'espiritualista_milagre_do_alvorecer'
    ]
  },
  {
    id: 'furioso',
    nome: 'Furioso',
    tier: 'Ofensivo',
    cor: '#d06752',
    descricao: 'Guerreiros de fúria primal que convertem dor em força brutal e pressão constante.',
    habilidades: [
      'furioso_furia_incandescente',
      'furioso_impacto_brutal',
      'furioso_sangue_quente',
      'furioso_ataque_avassalador',
      'furioso_ignorar_dor',
      'furioso_ultimato_selvagem'
    ]
  },
  {
    id: 'guardiao',
    nome: 'Guardião',
    tier: 'Defensivo',
    cor: '#5f80b9',
    descricao: 'Defensores incansáveis que protegem aliados e controlam o ritmo dos confrontos.',
    habilidades: [
      'guardiao_muralha_humana',
      'guardiao_interposicao',
      'guardiao_postura_firme',
      'guardiao_contra_ofensiva',
      'guardiao_baluarte',
      'guardiao_ultima_linha'
    ]
  },
  {
    id: 'guerreiro_sombrio',
    nome: 'Guerreiro Sombrio',
    tier: 'Ocultista',
    cor: '#6d5f95',
    descricao: 'Combatentes que fundem técnica marcial e poder sombrio para dominar duelos.',
    habilidades: [
      'guerreiro_sombrio_lamina_noturna',
      'guerreiro_sombrio_aura_dread',
      'guerreiro_sombrio_golpe_vazio',
      'guerreiro_sombrio_pacto_escuro',
      'guerreiro_sombrio_passo_no_breu',
      'guerreiro_sombrio_crepusculo_absoluto'
    ]
  },
  {
    id: 'inventor',
    nome: 'Inventor',
    tier: 'Técnico',
    cor: '#9d7a52',
    descricao: 'Engenheiros de campo que resolvem batalhas com engenhos, bombas e automações.',
    habilidades: [
      'inventor_dispositivo_utilitario',
      'inventor_granada_reativa',
      'inventor_kit_reparo',
      'inventor_torreta_portatil',
      'inventor_sobrecarga_circuito',
      'inventor_matriz_experimental'
    ]
  },
  {
    id: 'ladino',
    nome: 'Ladino',
    tier: 'Ágil',
    cor: '#63a279',
    descricao: 'Especialistas em furtividade e oportunismo, letais quando atacam no momento certo.',
    habilidades: [
      'ladino_ataque_furtivo',
      'ladino_bomba_de_fumaca',
      'ladino_esquiva_reflexa',
      'ladino_passo_sombrio',
      'ladino_maos_leves',
      'ladino_execucao_precisa'
    ]
  },
  {
    id: 'mestre_de_armas',
    nome: 'Mestre de Armas',
    tier: 'Marcial',
    cor: '#c89b4f',
    descricao: 'Peritos em estilos de combate que adaptam técnica e postura a qualquer adversário.',
    habilidades: [
      'mestre_de_armas_postura_variavel',
      'mestre_de_armas_desarme',
      'mestre_de_armas_golpe_circular',
      'mestre_de_armas_ritmo_marcial',
      'mestre_de_armas_alcance_controlado',
      'mestre_de_armas_forma_perfeita'
    ]
  },
  {
    id: 'orador',
    nome: 'Orador',
    tier: 'Suporte',
    cor: '#b168a5',
    descricao: 'Líderes carismáticos que alteram o moral do campo com voz, presença e retórica.',
    habilidades: [
      'orador_discurso_inspirador',
      'orador_ordem_tatica',
      'orador_palavra_cortante',
      'orador_comando_resoluto',
      'orador_retomar_moral',
      'orador_manifesto_vitorioso'
    ]
  },
  {
    id: 'quimerista',
    nome: 'Quimerista',
    tier: 'Especialista',
    cor: '#78b36e',
    descricao: 'Canalizadores de traços bestiais e formas mutáveis, equilibrando adaptação e ferocidade.',
    habilidades: [
      'quimerista_forma_hibrida',
      'quimerista_garra_predatoria',
      'quimerista_couro_mutavel',
      'quimerista_instinto_bestial',
      'quimerista_uivo_regenerativo',
      'quimerista_apice_quimerico'
    ]
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
