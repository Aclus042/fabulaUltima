/* ═══════════════════════════════════════════════════════════════
   skills.js — Habilidades Oficiais das Classes
   Fabula Ultima – Ficha de Personagem
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────
// TIPOS DE HABILIDADE
// ─────────────────────────────────────────────────

const SKILL_TYPES = {
  passiva:  { label: 'Passiva', border: '#5a7fc0', bg: 'rgba(90,127,192,0.16)', color: '#c9d8ff' },
  ativa:    { label: 'Ativa',   border: '#4f9d7b', bg: 'rgba(40,120,80,0.16)', color: '#b8ffd8' },
  reacao:   { label: 'Reação',  border: '#b38a44', bg: 'rgba(120,80,20,0.18)', color: '#ffe1a8' },
  magia:    { label: 'Magia',   border: '#8b63d9', bg: 'rgba(100,60,180,0.18)', color: '#e2ccff' },
  ritual:   { label: 'Ritual',  border: '#a06a4a', bg: 'rgba(110,60,30,0.18)', color: '#ffd0b8' },
  especial: { label: 'Especial',border: '#c05466', bg: 'rgba(120,20,30,0.2)',  color: '#ffc0ca' },
};

// ─────────────────────────────────────────────────
// HABILIDADES — Dados Reais das Classes
// ─────────────────────────────────────────────────

const SKILLS = {
  // ══════════════ ANDARILHO ══════════════
  andarilho_cacador_de_tesouros: {
    nome: 'Caçador de Tesouros',
    classe: 'andarilho',
    tipo: 'passiva',
    custo: 'ç2',
    requisito: null,
    descricao: 'Quando seu grupo se aventura pelo mapa do mundo, você faz uma descoberta se tira 【r NP + 1】 ou menos na rolagem de viagem (em vez de apenas 1).',
    detalhes: 'Quando seu grupo se aventura pelo mapa do mundo, você faz uma descoberta se tira 【r NP + 1】 ou menos na rolagem de viagem (em vez de apenas 1).'
  },
  andarilho_companheiro_fiel: {
    nome: 'Companheiro Fiel',
    classe: 'andarilho',
    tipo: 'especial',
    custo: 'ç5',
    requisito: null,
    descricao: 'Crie um NPC construto, elemental, fera ou planta de nível 5 para ser seu companheiro.',
    detalhes: 'Com a ajuda do grupo, crie um NPC (veja a p. 302) construto, elemental, fera ou planta de nível 5 para ser seu companheiro: essa criatura não tem iniciativa e não sobe de nível, pode ter no máximo dois ataques básicos, ganha um bônus em testes de Precisão e Magia igual a 【NP】 e seus PV máximos são iguais a 【(NP x o dado básico de Vigor do companheiro) + metade do seu nível】.\nVocê pode gastar sua ação para fazê-lo realizar uma ação no seu turno (uma vez por turno) — ele não age de outra forma. Se o seu companheiro for afetado por efeitos de turno (p. 77), ele é afetado no seu turno.\nSeu companheiro entra e sai de cena com você e ganha os mesmos benefícios de descanso. Se ficar com 0 PV, ele foge e reencontra você no início da próxima cena em que estiver. Quando reaparece, está com metade dos PV máximos.'
  },
  andarilho_papo_de_taverna: {
    nome: 'Papo de Taverna',
    classe: 'andarilho',
    tipo: 'especial',
    custo: 'ç3',
    requisito: null,
    descricao: 'Ao descansar em uma estalagem ou taverna, você pode fazer 【NP】 perguntas ao mestre sobre os arredores e habitantes.',
    detalhes: 'Ao descansar em uma estalagem ou taverna, você pode fazer 【NP】 perguntas ao mestre sobre os arredores e habitantes. O mestre deve responder com informações verdadeiras, mas você deve descrever como obteve tais informações.'
  },
  andarilho_pratico: {
    nome: 'Prático',
    classe: 'andarilho',
    tipo: 'passiva',
    custo: 'ç4',
    requisito: null,
    descricao: 'Você recupera 【NP】 PI após cada rolagem de viagem (veja a página 106).',
    detalhes: 'Você recupera 【NP】 PI após cada rolagem de viagem (veja a página 106).'
  },
  andarilho_viajante: {
    nome: 'Viajante',
    classe: 'andarilho',
    tipo: 'passiva',
    custo: '—',
    requisito: null,
    descricao: 'Reduz o dado rolado em suas rolagens de viagem em um (mínimo d6).',
    detalhes: 'Você reduz o dado rolado em suas rolagens de viagem em um (mínimo d6). Se mais de um personagem tiver este poder, os efeitos não são cumulativos.'
  },

  // ══════════════ ARCANISTA ══════════════
  arcanista_arcanismo_ritualista: {
    nome: 'Arcanismo Ritualista',
    classe: 'arcanista',
    tipo: 'ritual',
    custo: '—',
    requisito: null,
    descricao: 'Permite realizar rituais da disciplina arcanismo usando 【VON + VON】.',
    detalhes: 'Você pode fazer rituais da disciplina arcanismo, desde que seus efeitos estejam entre os domínios de um ou mais Arcanos que você vinculou (veja pp. 180-183).\nRituais de arcanismo usam 【VON + VON】 no teste de Magia.'
  },
  arcanista_arcano_emergencial: {
    nome: 'Arcano Emergencial',
    classe: 'arcanista',
    tipo: 'passiva',
    custo: 'ç6',
    requisito: null,
    descricao: 'Em crise, o custo de invocar seu Arcano é reduzido em 【NP × 5】.',
    detalhes: 'Enquanto estiver em crise, o custo de invocar seu Arcano é reduzido em 【NP × 5】.'
  },
  arcanista_circulo_arcano: {
    nome: 'Círculo Arcano',
    classe: 'arcanista',
    tipo: 'passiva',
    custo: 'ç4',
    requisito: null,
    descricao: 'Após dispensar um Arcano voluntariamente, pode fazer a ação Feitiço sem custo.',
    detalhes: 'Em seu turno, após dispensar voluntariamente um Arcano durante um conflito, se esse Arcano não foi invocado durante esse mesmo turno e você tem uma arma arcana equipada, você pode imediatamente fazer a ação Feitiço sem custo.\nO feitiço que você conjurar dessa forma deve ter um custo total de PM igual ou inferior a 【NP × 5】 e você ainda deve pagar seu custo em PM.'
  },
  arcanista_regeneracao_arcana: {
    nome: 'Regeneração Arcana',
    classe: 'arcanista',
    tipo: 'passiva',
    custo: 'ç2',
    requisito: null,
    descricao: 'Ao invocar um Arcano, recupera 【NP × 5】 PV.',
    detalhes: 'Ao invocar um Arcano, você imediatamente recupera 【NP × 5】 PV.'
  },
  arcanista_vincular_e_invocar: {
    nome: 'Vincular e Invocar',
    classe: 'arcanista',
    tipo: 'especial',
    custo: '—',
    requisito: null,
    descricao: 'Vincule Arcanos à sua alma para invocá-los posteriormente.',
    detalhes: 'Você pode vincular Arcanos à sua alma para invocá-los em um momento posterior.\nNa primeira vez que você encontrar o Arcano em questão, o mestre lhe dirá os detalhes que envolvem cada processo de vinculação.\nVocê pode usar uma ação e gastar 40 PM para invocar um Arcano que já vinculou.\nSe escolher este poder na criação de personagem, você começa o jogo já vinculado a um Arcano à sua escolha.'
  },

  // ══════════════ ATIRADOR ══════════════
  atirador_barragem: {
    nome: 'Barragem',
    classe: 'atirador',
    tipo: 'ativa',
    custo: '—',
    requisito: null,
    descricao: 'Gaste 10 PM ao atacar à distância para ganhar multi (2) ou aumentar multi em +1.',
    detalhes: 'Ao fazer um ataque à distância, você pode gastar 10 PM para escolher uma opção: o ataque ganha multi (2); ou você aumenta em +1 a propriedade multi do ataque, até o máximo de multi (3).'
  },
  atirador_fogo_cruzado: {
    nome: 'Fogo Cruzado',
    classe: 'atirador',
    tipo: 'reacao',
    custo: '—',
    requisito: null,
    descricao: 'Gaste PM igual ao teste de Precisão de uma criatura para anular seu ataque à distância.',
    detalhes: 'Quando uma criatura que você possa ver faz um ataque à distância, pode gastar um total de PM igual ao teste de Precisão dela para fazer o ataque falhar automaticamente contra todos os alvos. Você só pode usar este poder se tiver uma arma à distância equipada. Este poder não funciona se o teste de Precisão da criatura for um sucesso crítico.'
  },
  atirador_maestria_distancia: {
    nome: 'Maestria com Armas à Distância',
    classe: 'atirador',
    tipo: 'passiva',
    custo: 'ç4',
    requisito: null,
    descricao: 'Bônus igual a 【NP】 em testes de Precisão à distância.',
    detalhes: 'Você ganha um bônus igual a 【NP】 em testes de Precisão à distância.'
  },
  atirador_olhos_de_aguia: {
    nome: 'Olhos de Águia',
    classe: 'atirador',
    tipo: 'especial',
    custo: 'ç5',
    requisito: null,
    descricao: 'Ao usar Guarda sem dar cobertura, ganhe dano adicional ou faça um ataque livre.',
    detalhes: 'Quando faz a ação Guarda, se escolher não dar cobertura a outra criatura, você pode escolher uma opção: o próximo ataque à distância que você fizer na cena atual causa 【NP × 2】 de dano adicional ou você pode imediatamente fazer um ataque livre com um arco ou arma de fogo equipada, considerando sua RA como 0 ao calcular o dano causado por este ataque.'
  },
  atirador_tiro_de_aviso: {
    nome: 'Tiro de Aviso',
    classe: 'atirador',
    tipo: 'especial',
    custo: 'ç4',
    requisito: null,
    descricao: 'Após atingir alvos à distância, pode não causar dano e aplicar abalado, lento ou drenar PM.',
    detalhes: 'Depois de atingir um ou mais alvos com um ataque à distância, você pode escolher não causar dano. Se fizer isso, escolha uma opção: cada alvo atingido pelo ataque fica abalado; ou fica lento; ou perde 【NP × 10】 PM. Descreva como você faz essa manobra!'
  },
};

// ─────────────────────────────────────────────────
// ARCANOS — Sistema Especial do Arcanista
// ─────────────────────────────────────────────────

const ARCANOS = {
  espada: {
    nome: 'Arcano da Espada',
    icone: 'assets/icons/arcano/espada.png',
    dominios: ['conquista', 'heroísmo', 'liderança'],
    fundir: 'Seu dano não tem tipo.\nVocê recebe +5 ao dano.\nVocê pode ganhar multi (dispensa automática após uso).',
    dispensar: null
  },
  forja: {
    nome: 'Arcano da Forja',
    icone: 'assets/icons/arcano/forja.png',
    dominios: ['calor', 'fogo', 'metal'],
    fundir: 'Você ganha resistência a fogo.\nSeu dano de fogo ignora resistência.',
    dispensar: 'Forja: cria uma arma, armadura ou escudo.\nInferno: causa 30 dano de fogo em múltiplos alvos.'
  },
  geada: {
    nome: 'Arcano da Geada',
    icone: 'assets/icons/arcano/geada.png',
    dominios: ['frio', 'gelo', 'silêncio'],
    fundir: 'Você ganha resistência a gelo.\nVocê fica imune a enfurecido.\nSeu dano de gelo ignora resistência.',
    dispensar: 'Causa 30 dano de gelo em múltiplos alvos.'
  },
  roda: {
    nome: 'Arcano da Roda',
    icone: 'assets/icons/arcano/roda.png',
    dominios: ['destino', 'tempo', 'velocidade'],
    fundir: 'Você fica imune a lento.\nVocê recebe +1 Defesa.',
    dispensar: 'Aplica lento ou reduz ações de alvos.'
  },
  torre: {
    nome: 'Arcano da Torre',
    icone: 'assets/icons/arcano/torre.png',
    dominios: ['julgamento', 'proteção', 'sacrifício'],
    fundir: 'Aliados ganham resistência a um tipo de dano.',
    dispensar: 'Causa 30 dano de luz em múltiplos alvos.'
  },
  carvalho: {
    nome: 'Arcano do Carvalho',
    icone: 'assets/icons/arcano/carvalho.png',
    dominios: ['plantas', 'terra', 'veneno'],
    fundir: 'Você ganha resistência a terra e veneno.\nVocê fica imune a envenenado.\nVocê recebe +5 PV ao curar.',
    dispensar: 'Envenena inimigos e cura aliados.'
  },
  ceu: {
    nome: 'Arcano do Céu',
    icone: 'assets/icons/arcano/ceu.png',
    dominios: ['chuva', 'névoa', 'tempestades'],
    fundir: 'Você ganha resistência a ar e raio.\nVocê pode fazer previsão climática.',
    dispensar: 'Causa 30 dano de raio.'
  },
  grimorio: {
    nome: 'Arcano do Grimório',
    icone: 'assets/icons/arcano/grimorio.png',
    dominios: ['compreensão', 'conhecimento', 'revelações'],
    fundir: 'Você entende todos os idiomas.\nSua AST aumenta 1 passo.',
    dispensar: 'Você pode fazer uma pergunta ao mestre.'
  },
  portao: {
    nome: 'Arcano do Portão',
    icone: 'assets/icons/arcano/portao.png',
    dominios: ['espaço', 'vazio', 'viagens'],
    fundir: 'Você ganha resistência a trevas.\nVocê recebe +1 Defesa Mágica.',
    dispensar: 'Oblívio: causa 30 dano de trevas.\nTranslocar: teleporte.'
  },
};

// ─────────────────────────────────────────────────
// REGRAS GERAIS DOS ARCANOS
// ─────────────────────────────────────────────────

const ARCANO_RULES = {
  fundir: 'Ao invocar um Arcano, você ganha seus benefícios de fundição até ser dispensado.',
  dispensar: 'O Arcano é dispensado ao fim da cena, ao ficar inconsciente, ao sair de cena ou voluntariamente. Efeitos de dispensar só ocorrem quando dispensado voluntariamente.',
  escala: 'Dano de dispensar escala em níveis altos (+10 no nível 20, +20 no nível 40).',
  dominios: 'Domínios são usados para rituais e narrativa.'
};

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────

function getSkillById(id) {
  return SKILLS[id] ? { id, ...SKILLS[id] } : null;
}

function getSkillsByClass(classId) {
  return Object.entries(SKILLS)
    .filter(([, skill]) => skill.classe === classId)
    .map(([id, skill]) => ({ id, ...skill }));
}

function getSkillTypeStyle(tipo) {
  return SKILL_TYPES[tipo] || {
    label: tipo || 'Especial',
    border: '#5a7fc0',
    bg: 'rgba(90,127,192,0.16)',
    color: '#c9d8ff',
  };
}

function getArcanoById(id) {
  return ARCANOS[id] ? { id, ...ARCANOS[id] } : null;
}

function getAllArcanos() {
  return Object.entries(ARCANOS).map(([id, arc]) => ({ id, ...arc }));
}
