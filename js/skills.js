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
// TODAS AS HABILIDADES (15 classes x 6 habilidades)
// ─────────────────────────────────────────────────

const SKILLS = {
  // ANDARILHO
  andarilho_trilha_invisivel: {
    nome: 'Trilha Invisível', classe: 'andarilho', tipo: 'passiva', custo: '—', requisito: null,
    descricao: 'Move-se em terrenos difíceis sem deixar rastros evidentes.',
    detalhes: 'Ignora penalidades de deslocamento em terreno difícil e concede +2 em testes de exploração para rastrear ou evitar rastreamento.'
  },
  andarilho_instinto_natural: {
    nome: 'Instinto Natural', classe: 'andarilho', tipo: 'ativa', custo: 'IP 1', requisito: null,
    descricao: 'Lê sinais do ambiente para antecipar emboscadas.',
    detalhes: 'Até o início do próximo turno, aliados próximos recebem +1 em Defesa e você revela ameaças ocultas em curto alcance.'
  },
  andarilho_passo_longo: {
    nome: 'Passo Longo', classe: 'andarilho', tipo: 'ativa', custo: 'IP 1', requisito: null,
    descricao: 'Acelera o deslocamento e reposiciona o grupo com eficiência.',
    detalhes: 'Você se move sem provocar reação e pode permitir que um aliado adjacente se mova metade do deslocamento.'
  },
  andarilho_mapa_vivo: {
    nome: 'Mapa Vivo', classe: 'andarilho', tipo: 'ritual', custo: 'PM 4', requisito: null,
    descricao: 'Cria uma leitura precisa da área ao redor.',
    detalhes: 'Durante a cena, o grupo não pode se perder e obtém vantagem narrativa para encontrar rotas seguras ou saídas ocultas.'
  },
  andarilho_cacador_errante: {
    nome: 'Caçador Errante', classe: 'andarilho', tipo: 'ativa', custo: 'IP 1', requisito: null,
    descricao: 'Marca um alvo e aumenta pressão sobre ele.',
    detalhes: 'Escolha um inimigo. Até o fim da cena, seu primeiro acerto por rodada nesse alvo causa dano extra igual ao nível.'
  },
  andarilho_refugio_rapido: {
    nome: 'Refúgio Rápido', classe: 'andarilho', tipo: 'especial', custo: 'PM 8', requisito: 'Nível 10',
    descricao: 'Ergue proteção improvisada para o grupo em poucos segundos.',
    detalhes: 'Cria cobertura temporária para aliados em área pequena; concede resistência a dano à distância por 2 rodadas.'
  },

  // ARCANISTA
  arcanista_raio_arcano: { nome: 'Raio Arcano', classe: 'arcanista', tipo: 'magia', custo: 'PM 4', requisito: null, descricao: 'Disparo concentrado de energia arcana.', detalhes: 'Ataque mágico de alvo único com bom alcance; ignora parte da resistência mágica básica.' },
  arcanista_escudo_mistico: { nome: 'Escudo Místico', classe: 'arcanista', tipo: 'reacao', custo: 'PM 3', requisito: null, descricao: 'Barreira instantânea de energia.', detalhes: 'Quando sofreria dano, reduza o dano recebido e converta parte em proteção temporária.' },
  arcanista_teia_de_runas: { nome: 'Teia de Runas', classe: 'arcanista', tipo: 'ativa', custo: 'PM 5', requisito: null, descricao: 'Runas flutuantes limitam movimentos inimigos.', detalhes: 'Cria zona arcana que reduz deslocamento de inimigos e penaliza ataques de quem está dentro.' },
  arcanista_sobrecarga_arcana: { nome: 'Sobrecarga Arcana', classe: 'arcanista', tipo: 'especial', custo: 'PM 6', requisito: null, descricao: 'Amplifica o próximo feitiço lançado.', detalhes: 'Seu próximo efeito mágico na rodada ganha aumento de dano e alcance, mas você perde 1 PM adicional no fim do turno.' },
  arcanista_concentracao_perfeita: { nome: 'Concentração Perfeita', classe: 'arcanista', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Foco superior para manter efeitos mágicos.', detalhes: 'Recebe bônus para manter concentração e reduz chance de interrupção ao sofrer dano.' },
  arcanista_reescrever_formula: { nome: 'Reescrever Fórmula', classe: 'arcanista', tipo: 'ritual', custo: 'PM 9', requisito: 'Nível 12', descricao: 'Altera propriedades de uma magia em execução.', detalhes: 'Permite trocar elemento ou área de um feitiço aliado sem recast completo, ajustando custo em +2 PM.' },

  // ATIRADOR
  atirador_tiro_certeiro: { nome: 'Tiro Certeiro', classe: 'atirador', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Disparo preciso em ponto vulnerável.', detalhes: 'Ataque à distância com bônus de acerto e pequeno dano extra em alvo único.' },
  atirador_disparo_duplo: { nome: 'Disparo Duplo', classe: 'atirador', tipo: 'ativa', custo: 'IP 2', requisito: null, descricao: 'Dois tiros rápidos no mesmo turno.', detalhes: 'Realiza dois ataques à distância com penalidade leve no segundo disparo.' },
  atirador_mira_fria: { nome: 'Mira Fria', classe: 'atirador', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Mantém precisão mesmo sob pressão.', detalhes: 'Reduz penalidades por cobertura parcial e por longo alcance.' },
  atirador_tiro_perfurante: { nome: 'Tiro Perfurante', classe: 'atirador', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Projétil atravessa defesa e blindagem.', detalhes: 'Ataque com menor dano base, mas ignora parte substancial de armadura/defesa física.' },
  atirador_cobertura_tatica: { nome: 'Cobertura Tática', classe: 'atirador', tipo: 'reacao', custo: 'IP 1', requisito: null, descricao: 'Reposiciona e responde a avanço inimigo.', detalhes: 'Ao ser alvo de ataque à distância, move-se curta distância e recebe bônus defensivo até seu próximo turno.' },
  atirador_chuva_de_projeteis: { nome: 'Chuva de Projéteis', classe: 'atirador', tipo: 'especial', custo: 'IP 3', requisito: 'Nível 10', descricao: 'Volume de fogo para conter grupos.', detalhes: 'Atinge área em cone e aplica dano moderado a múltiplos alvos; inimigos afetados ficam Lentos por 1 rodada.' },

  // ELEMENTALISTA
  elementalista_lanca_fulgurante: { nome: 'Lança Fulgurante', classe: 'elementalista', tipo: 'magia', custo: 'PM 4', requisito: null, descricao: 'Raio elementar concentrado em linha.', detalhes: 'Ataque mágico linear com chance de causar condição Abalado em alvos frágeis.' },
  elementalista_esfera_ignea: { nome: 'Esfera Ígnea', classe: 'elementalista', tipo: 'magia', custo: 'PM 6', requisito: null, descricao: 'Explosão de fogo em área curta.', detalhes: 'Causa dano em área e deixa zona ardente por 1 rodada, ferindo quem atravessa.' },
  elementalista_manto_gelido: { nome: 'Manto Gélido', classe: 'elementalista', tipo: 'ativa', custo: 'PM 4', requisito: null, descricao: 'Camada de frio que endurece proteção.', detalhes: 'Concede defesa adicional e aplica redução de movimento a inimigos corpo-a-corpo que acertarem você.' },
  elementalista_muralha_telurica: { nome: 'Muralha Telúrica', classe: 'elementalista', tipo: 'ritual', custo: 'PM 5', requisito: null, descricao: 'Eleva barreira de pedra no campo.', detalhes: 'Cria obstáculo temporário que bloqueia linha de visão e ataques diretos.' },
  elementalista_corrente_tempestuosa: { nome: 'Corrente Tempestuosa', classe: 'elementalista', tipo: 'magia', custo: 'PM 5', requisito: null, descricao: 'Encadeia eletricidade entre inimigos próximos.', detalhes: 'Dano elétrico salta entre até 3 alvos em alcance médio com dano decrescente.' },
  elementalista_sinfonia_elemental: { nome: 'Sinfonia Elemental', classe: 'elementalista', tipo: 'especial', custo: 'PM 10', requisito: 'Nível 12', descricao: 'Combina elementos em efeito devastador.', detalhes: 'Ataque de área ampla com escolha de elemento dominante e efeito secundário correspondente.' },

  // ENTROPISTA
  entropista_marca_da_ruina: { nome: 'Marca da Ruína', classe: 'entropista', tipo: 'magia', custo: 'PM 4', requisito: null, descricao: 'Sinal entrópico que enfraquece o alvo.', detalhes: 'Alvo marcado sofre penalidade em Defesa e recebe dano adicional de fontes sombrias.' },
  entropista_queda_de_probabilidade: { nome: 'Queda de Probabilidade', classe: 'entropista', tipo: 'reacao', custo: 'PM 3', requisito: null, descricao: 'Distorce chance de sucesso inimiga.', detalhes: 'Ao inimigo rolar alto, force nova rolagem e mantenha o menor resultado.' },
  entropista_esfacelar: { nome: 'Esfacelar', classe: 'entropista', tipo: 'magia', custo: 'PM 5', requisito: null, descricao: 'Acelera desgaste estrutural do alvo.', detalhes: 'Causa dano necrótico e reduz resistência física por 2 rodadas.' },
  entropista_caos_controlado: { nome: 'Caos Controlado', classe: 'entropista', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Converte efeitos aleatórios em vantagem tática.', detalhes: 'Escolha entre dois efeitos sorteados e aplique o melhor para a situação atual.' },
  entropista_debito_entripico: { nome: 'Débito Entrópico', classe: 'entropista', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Acumula energia de decadência durante a luta.', detalhes: 'A cada 2 turnos, ganha 1 carga entrópica; gaste cargas para ampliar dano ou alcance de habilidades de entropia.' },
  entropista_colapso_local: { nome: 'Colapso Local', classe: 'entropista', tipo: 'especial', custo: 'PM 9', requisito: 'Nível 12', descricao: 'Instabiliza uma área até o ponto de ruptura.', detalhes: 'Cria zona que causa dano contínuo e aplica debuffs severos a inimigos que permanecerem nela.' },

  // ERUDITO
  erudito_analise_tatica: { nome: 'Análise Tática', classe: 'erudito', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Lê padrões de combate em segundos.', detalhes: 'Revela fraqueza de um alvo e concede bônus de acerto para o próximo ataque aliado.' },
  erudito_ponto_fraco: { nome: 'Ponto Fraco', classe: 'erudito', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Detecta vulnerabilidades anatômicas e mecânicas.', detalhes: 'Quando identifica um inimigo, seus ataques contra ele causam dano adicional moderado.' },
  erudito_teorema_defensivo: { nome: 'Teorema Defensivo', classe: 'erudito', tipo: 'ativa', custo: 'PM 3', requisito: null, descricao: 'Aplica lógica de contenção no campo.', detalhes: 'Aliados em curto alcance recebem bônus de Resistência Mágica por 2 rodadas.' },
  erudito_arquivo_vivo: { nome: 'Arquivo Vivo', classe: 'erudito', tipo: 'ritual', custo: 'PM 4', requisito: null, descricao: 'Recupera conhecimento útil imediatamente.', detalhes: 'Garante informação crítica sobre criatura, local ou artefato relevante para a cena.' },
  erudito_plano_impecavel: { nome: 'Plano Impecável', classe: 'erudito', tipo: 'especial', custo: 'IP 2', requisito: null, descricao: 'Coordena o grupo com precisão de relógio.', detalhes: 'Até dois aliados podem reposicionar-se e executar ação menor extra na mesma rodada.' },
  erudito_hipotese_suprema: { nome: 'Hipótese Suprema', classe: 'erudito', tipo: 'especial', custo: 'PM 8', requisito: 'Nível 10', descricao: 'Converte previsão teórica em resultado real.', detalhes: 'Escolha uma rolagem aliada nesta cena para ser tratada como sucesso crítico controlado.' },

  // ESPIRITUALISTA
  espiritualista_luz_reparadora: { nome: 'Luz Reparadora', classe: 'espiritualista', tipo: 'magia', custo: 'PM 4', requisito: null, descricao: 'Cura ferimentos com energia espiritual.', detalhes: 'Restaura PV de um aliado em alcance médio com escalonamento por VON.' },
  espiritualista_selo_protetor: { nome: 'Selo Protetor', classe: 'espiritualista', tipo: 'ativa', custo: 'PM 3', requisito: null, descricao: 'Marca aliada com proteção espiritual.', detalhes: 'Concede redução de dano e imunidade curta a uma condição negativa comum.' },
  espiritualista_prece_renovadora: { nome: 'Prece Renovadora', classe: 'espiritualista', tipo: 'ritual', custo: 'PM 6', requisito: null, descricao: 'Ritual breve que restaura grupo inteiro.', detalhes: 'Ao fim da invocação, todos aliados próximos recuperam PV e removem um efeito menor.' },
  espiritualista_exorcismo: { nome: 'Exorcismo', classe: 'espiritualista', tipo: 'magia', custo: 'PM 5', requisito: null, descricao: 'Expulsa influência espiritual hostil.', detalhes: 'Causa dano extra contra entidades sombrias e pode dissipar encantamentos maliciosos.' },
  espiritualista_vigilia_sagrada: { nome: 'Vigília Sagrada', classe: 'espiritualista', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Mantém proteção contínua sobre aliados próximos.', detalhes: 'Aliados dentro da aura recebem bônus contra medo e confusão.' },
  espiritualista_milagre_do_alvorecer: { nome: 'Milagre do Alvorecer', classe: 'espiritualista', tipo: 'especial', custo: 'PM 10', requisito: 'Nível 12', descricao: 'Canaliza bênção máxima em momento crítico.', detalhes: 'Revive aliado abatido com parte dos PV e remove condições debilitantes graves.' },

  // FURIOSO
  furioso_furia_incandescente: { nome: 'Fúria Incandescente', classe: 'furioso', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Entra em estado agressivo de combate.', detalhes: 'Ganha bônus de dano corpo-a-corpo por 2 rodadas, com leve redução de defesa.' },
  furioso_impacto_brutal: { nome: 'Impacto Brutal', classe: 'furioso', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Golpe pesado que desequilibra o alvo.', detalhes: 'Ataque com dano elevado e chance de aplicar condição Lento.' },
  furioso_sangue_quente: { nome: 'Sangue Quente', classe: 'furioso', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Quanto mais ferido, mais perigoso fica.', detalhes: 'Abaixo de 50% PV, recebe bônus progressivo de dano e resistência a controle.' },
  furioso_ataque_avassalador: { nome: 'Ataque Avassalador', classe: 'furioso', tipo: 'ativa', custo: 'IP 2', requisito: null, descricao: 'Investida violenta contra linha inimiga.', detalhes: 'Avança e atinge até dois alvos alinhados, empurrando-os curta distância.' },
  furioso_ignorar_dor: { nome: 'Ignorar Dor', classe: 'furioso', tipo: 'reacao', custo: 'IP 1', requisito: null, descricao: 'Suporta golpe crítico sem recuar.', detalhes: 'Reduz dano recebido e evita interrupção de ação em andamento.' },
  furioso_ultimato_selvagem: { nome: 'Ultimato Selvagem', classe: 'furioso', tipo: 'especial', custo: 'IP 3', requisito: 'Nível 10', descricao: 'Explosão final de agressividade.', detalhes: 'Realiza sequência de ataques com dano crescente até errar ou encerrar a rodada.' },

  // GUARDIÃO
  guardiao_muralha_humana: { nome: 'Muralha Humana', classe: 'guardiao', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Transforma-se em barreira para o time.', detalhes: 'Aliados adjacentes recebem bônus de defesa quando você estiver em postura defensiva.' },
  guardiao_interposicao: { nome: 'Interposição', classe: 'guardiao', tipo: 'reacao', custo: 'IP 1', requisito: null, descricao: 'Assume ataque destinado a um aliado.', detalhes: 'Troca de posição com aliado próximo e recebe o ataque no lugar dele com dano reduzido.' },
  guardiao_postura_firme: { nome: 'Postura Firme', classe: 'guardiao', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Fortalece defesa sem perder presença.', detalhes: 'Ganha grande bônus de defesa por 1 rodada e impede empurrões/derrubadas.' },
  guardiao_contra_ofensiva: { nome: 'Contra-Ofensiva', classe: 'guardiao', tipo: 'reacao', custo: 'IP 1', requisito: null, descricao: 'Responde após bloquear com sucesso.', detalhes: 'Após reduzir dano de ataque, desfere contra-ataque imediato com dano moderado.' },
  guardiao_baluarte: { nome: 'Baluarte', classe: 'guardiao', tipo: 'ativa', custo: 'PM 4', requisito: null, descricao: 'Cria zona de proteção ao redor.', detalhes: 'Aliados em área pequena recebem resistência a dano físico por 2 rodadas.' },
  guardiao_ultima_linha: { nome: 'Última Linha', classe: 'guardiao', tipo: 'especial', custo: 'IP 3', requisito: 'Nível 12', descricao: 'Defesa absoluta em situação crítica.', detalhes: 'Por 1 rodada, você não pode ser deslocado e reduz drasticamente dano recebido por aliados próximos.' },

  // GUERREIRO SOMBRIO
  guerreiro_sombrio_lamina_noturna: { nome: 'Lâmina Noturna', classe: 'guerreiro_sombrio', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Golpe envolto em energia escura.', detalhes: 'Ataque corpo-a-corpo com dano sombrio adicional e chance de causar Abalado.' },
  guerreiro_sombrio_aura_dread: { nome: 'Aura Dread', classe: 'guerreiro_sombrio', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Presença opressiva desestabiliza inimigos.', detalhes: 'Inimigos próximos recebem penalidade leve em testes de resistência mental.' },
  guerreiro_sombrio_golpe_vazio: { nome: 'Golpe do Vazio', classe: 'guerreiro_sombrio', tipo: 'ativa', custo: 'PM 4', requisito: null, descricao: 'Ataque que drena vigor do alvo.', detalhes: 'Causa dano e converte parte em cura para você.' },
  guerreiro_sombrio_pacto_escuro: { nome: 'Pacto Escuro', classe: 'guerreiro_sombrio', tipo: 'especial', custo: 'PV 8', requisito: null, descricao: 'Troca vitalidade por poder imediato.', detalhes: 'Perde PV para receber bônus significativo de dano e acerto por 2 rodadas.' },
  guerreiro_sombrio_passo_no_breu: { nome: 'Passo no Breu', classe: 'guerreiro_sombrio', tipo: 'reacao', custo: 'PM 3', requisito: null, descricao: 'Deslocamento instantâneo entre sombras.', detalhes: 'Teleporta curta distância ao ser alvo de ataque, podendo evitar o golpe.' },
  guerreiro_sombrio_crepusculo_absoluto: { nome: 'Crepúsculo Absoluto', classe: 'guerreiro_sombrio', tipo: 'especial', custo: 'PM 9', requisito: 'Nível 12', descricao: 'Encobre área com trevas de combate.', detalhes: 'Zona de sombras amplia seu dano e reduz precisão de inimigos por 2 rodadas.' },

  // INVENTOR
  inventor_dispositivo_utilitario: { nome: 'Dispositivo Utilitário', classe: 'inventor', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Aciona ferramenta multifunção em combate.', detalhes: 'Escolha entre efeitos curtos: luz, tranca, distração sonora ou scanner tático.' },
  inventor_granada_reativa: { nome: 'Granada Reativa', classe: 'inventor', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Explosivo de curto atraso para controle de área.', detalhes: 'Causa dano em pequena área e empurra inimigos no centro da explosão.' },
  inventor_kit_reparo: { nome: 'Kit de Reparo', classe: 'inventor', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Repara equipamento ou estabiliza aliado.', detalhes: 'Recupera PV moderado de aliado ou restaura integridade de dispositivo mecânico.' },
  inventor_torreta_portatil: { nome: 'Torreta Portátil', classe: 'inventor', tipo: 'especial', custo: 'IP 2', requisito: null, descricao: 'Implanta unidade autônoma de suporte ofensivo.', detalhes: 'Torreta realiza ataque automático leve por rodada durante curto período.' },
  inventor_sobrecarga_circuito: { nome: 'Sobrecarga de Circuito', classe: 'inventor', tipo: 'ativa', custo: 'PM 4', requisito: null, descricao: 'Curto-circuita artefato ou armadura inimiga.', detalhes: 'Aplica debuff em alvo tecnológico/mecânico e causa dano elétrico instantâneo.' },
  inventor_matriz_experimental: { nome: 'Matriz Experimental', classe: 'inventor', tipo: 'especial', custo: 'IP 3', requisito: 'Nível 10', descricao: 'Protótipo extremo com efeito poderoso.', detalhes: 'Escolha entre ataque de área, escudo coletivo ou impulsionador de aliados.' },

  // LADINO
  ladino_ataque_furtivo: { nome: 'Ataque Furtivo', classe: 'ladino', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Explora distração para dano extra.', detalhes: 'Quando acerta alvo sob condição ou flanqueado, causa dano adicional escalonado.' },
  ladino_bomba_de_fumaca: { nome: 'Bomba de Fumaça', classe: 'ladino', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Obscurece visão e facilita fuga.', detalhes: 'Cria zona de fumaça curta; você pode reposicionar sem reação inimiga.' },
  ladino_esquiva_reflexa: { nome: 'Esquiva Reflexa', classe: 'ladino', tipo: 'reacao', custo: 'IP 1', requisito: null, descricao: 'Desvia no último instante.', detalhes: 'Ao sofrer ataque, reduza ou anule dano com teste de DES bem-sucedido.' },
  ladino_passo_sombrio: { nome: 'Passo Sombrio', classe: 'ladino', tipo: 'ativa', custo: 'IP 2', requisito: null, descricao: 'Desloca-se entre pontos cobertos.', detalhes: 'Move para cobertura próxima e recebe bônus de acerto no próximo ataque.' },
  ladino_maos_leves: { nome: 'Mãos Leves', classe: 'ladino', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Manipulação furtiva de objetos e mecanismos.', detalhes: 'Bônus relevante para abrir fechaduras, desarmar armadilhas e furtar sob pressão.' },
  ladino_execucao_precisa: { nome: 'Execução Precisa', classe: 'ladino', tipo: 'especial', custo: 'IP 3', requisito: 'Nível 10', descricao: 'Golpe decisivo contra alvo vulnerável.', detalhes: 'Ataque único de alto impacto contra alvo sob condição negativa ou surpreendido.' },

  // MESTRE DE ARMAS
  mestre_de_armas_postura_variavel: { nome: 'Postura Variável', classe: 'mestre_de_armas', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Alterna estilo ofensivo e defensivo.', detalhes: 'Escolha postura que concede bônus de dano ou bônus de defesa até o próximo turno.' },
  mestre_de_armas_desarme: { nome: 'Desarme', classe: 'mestre_de_armas', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Retira arma do adversário com técnica.', detalhes: 'Teste marcial para remover arma principal do alvo e arremessá-la curta distância.' },
  mestre_de_armas_golpe_circular: { nome: 'Golpe Circular', classe: 'mestre_de_armas', tipo: 'ativa', custo: 'IP 2', requisito: null, descricao: 'Varredura que atinge múltiplos inimigos adjacentes.', detalhes: 'Realiza ataque em arco contra todos inimigos ao redor com dano moderado.' },
  mestre_de_armas_ritmo_marcial: { nome: 'Ritmo Marcial', classe: 'mestre_de_armas', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Mantém fluidez e sequência de ataques.', detalhes: 'Após acertar, recebe bônus crescente para o próximo ataque no mesmo turno/cena curta.' },
  mestre_de_armas_alcance_controlado: { nome: 'Alcance Controlado', classe: 'mestre_de_armas', tipo: 'reacao', custo: 'IP 1', requisito: null, descricao: 'Controla espaço de combate com precisão.', detalhes: 'Quando inimigo entra em seu alcance, pode fazer ataque de oportunidade aprimorado.' },
  mestre_de_armas_forma_perfeita: { nome: 'Forma Perfeita', classe: 'mestre_de_armas', tipo: 'especial', custo: 'IP 3', requisito: 'Nível 12', descricao: 'Execução impecável da técnica máxima.', detalhes: 'Durante 1 rodada, seus ataques ignoram parte da defesa e não sofrem penalidades situacionais.' },

  // ORADOR
  orador_discurso_inspirador: { nome: 'Discurso Inspirador', classe: 'orador', tipo: 'ativa', custo: 'PM 3', requisito: null, descricao: 'Eleva moral dos aliados com palavras certeiras.', detalhes: 'Aliados em alcance de voz recebem bônus de acerto por 2 rodadas.' },
  orador_ordem_tatica: { nome: 'Ordem Tática', classe: 'orador', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Comando imediato para reposicionamento.', detalhes: 'Um aliado executa movimento curto ou ação menor fora do turno, sem provocar reação.' },
  orador_palavra_cortante: { nome: 'Palavra Cortante', classe: 'orador', tipo: 'magia', custo: 'PM 4', requisito: null, descricao: 'Ataque verbal que abala foco inimigo.', detalhes: 'Alvo sofre dano psíquico leve e penalidade no próximo ataque.' },
  orador_comando_resoluto: { nome: 'Comando Resoluto', classe: 'orador', tipo: 'reacao', custo: 'PM 2', requisito: null, descricao: 'Reforça aliado no instante de falha.', detalhes: 'Quando aliado falha teste crucial, permita repetir com bônus moderado.' },
  orador_retomar_moral: { nome: 'Retomar Moral', classe: 'orador', tipo: 'ritual', custo: 'PM 5', requisito: null, descricao: 'Recupera coesão do grupo após pressão intensa.', detalhes: 'Remove uma condição mental leve de cada aliado e concede proteção contra medo.' },
  orador_manifesto_vitorioso: { nome: 'Manifesto Vitorioso', classe: 'orador', tipo: 'especial', custo: 'PM 8', requisito: 'Nível 10', descricao: 'Pronunciamento máximo de comando.', detalhes: 'Toda equipe recebe bônus de dano e defesa por 1 rodada decisiva.' },

  // QUIMERISTA
  quimerista_forma_hibrida: { nome: 'Forma Híbrida', classe: 'quimerista', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Assume traços bestiais temporários.', detalhes: 'Ganha bônus físico e acesso a ataque natural por 2 rodadas.' },
  quimerista_garra_predatoria: { nome: 'Garra Predatória', classe: 'quimerista', tipo: 'ativa', custo: 'IP 1', requisito: null, descricao: 'Golpe rasgante de alto impacto.', detalhes: 'Ataque corpo-a-corpo com chance de sangramento leve no alvo.' },
  quimerista_couro_mutavel: { nome: 'Couro Mutável', classe: 'quimerista', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Corpo adapta-se a ameaças recorrentes.', detalhes: 'Após sofrer dano de um tipo, recebe pequena resistência a esse tipo por curto tempo.' },
  quimerista_instinto_bestial: { nome: 'Instinto Bestial', classe: 'quimerista', tipo: 'passiva', custo: '—', requisito: null, descricao: 'Percepção aguçada de predador.', detalhes: 'Bônus para detectar emboscadas, rastrear inimigos e agir antes em confrontos.' },
  quimerista_uivo_regenerativo: { nome: 'Uivo Regenerativo', classe: 'quimerista', tipo: 'especial', custo: 'PM 5', requisito: null, descricao: 'Canaliza vitalidade selvagem em recuperação.', detalhes: 'Recupera PV próprios e de aliados próximos em quantidade moderada.' },
  quimerista_apice_quimerico: { nome: 'Ápice Quimérico', classe: 'quimerista', tipo: 'especial', custo: 'IP 3', requisito: 'Nível 12', descricao: 'Transformação máxima de combate.', detalhes: 'Por 1 rodada, recebe grandes bônus de mobilidade, dano e resistência a controle.' },
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
