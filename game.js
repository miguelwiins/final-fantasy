// Lista das 7 rodadas da batalha com dificuldade crescente
const turnosBatalha = [
  {
    situacao: "O Titã de Aço baixou a guarda! Qual comando aplica um corte rápido com a espada?",
    opcoes: ["Slash", "Sleep", "Run", "Hide"],
    correta: "Slash",
    explicacaoAcerto: "Isso! 'Slash' significa cortar/golpear com lâmina. Dano direto!",
    explicacaoErro: "Ops! 'Slash' é o comando para cortar. As outras palavras significam dormir, correr ou esconder.",
    danoChefe: 20,
    efeito: "SLASH! -20 HP"
  },
  {
    situacao: "Alerta! O robô está mirando um laser pesado em você. Como ativar sua defesa?",
    opcoes: ["Jump", "Shield", "Eat", "Sing"],
    correta: "Shield",
    explicacaoAcerto: "Perfeito! 'Shield' ativa o escudo e bloqueia o laser.",
    explicacaoErro: "Cuidado! 'Shield' significa escudo. Você não se protegeu a tempo!",
    danoChefe: 15,
    efeito: "SHIELD BLOCK!"
  },
  {
    situacao: "A armadura metálica do chefe conduz eletricidade! Qual magia causa curto-circuito?",
    opcoes: ["Water", "Thunder", "Leaf", "Stone"],
    correta: "Thunder",
    explicacaoAcerto: "Crítico! 'Thunder' significa trovão/raio, perfeito contra metal!",
    explicacaoErro: "Não funcionou! 'Thunder' (trovão/raio) era a fraqueza do robô.",
    danoChefe: 25,
    efeito: "THUNDER! -25 HP"
  },
  {
    situacao: "Você recebeu faíscas e sua energia caiu. Qual comando recupera sua vida?",
    opcoes: ["Heal", "Break", "Drop", "Fall"],
    correta: "Heal",
    explicacaoAcerto: "Boa! 'Heal' significa curar. Sua barra de energia subiu!",
    explicacaoErro: "Comando errado! 'Heal' é o comando usado para curar energia.",
    curaHeroi: 20,
    danoChefe: 10,
    efeito: "HEAL! +20 HP"
  },
  {
    situacao: "O chefe lançou uma cortina de fumaça e vai avançar rápido. Como desviar do golpe?",
    opcoes: ["Stop", "Wait", "Dodge", "Sit"],
    correta: "Dodge",
    explicacaoAcerto: "Reflexo rápido! 'Dodge' significa desviar ou esquivar de um ataque.",
    explicacaoErro: "Você ficou parado! 'Dodge' significa desviar do ataque inimigo.",
    danoChefe: 20,
    efeito: "DODGE COUNTER! -20 HP"
  },
  {
    situacao: "O núcleo do Titã superaqueceu e ficou exposto! Use uma explosão de fogo para derretê-lo.",
    opcoes: ["Ice", "Wind", "Fire", "Shadow"],
    correta: "Fire",
    explicacaoAcerto: "Mandou bem! 'Fire' significa fogo e derreteu o núcleo superaquecido!",
    explicacaoErro: "Quase! Para derreter o núcleo exposto o comando certo era 'Fire' (fogo).",
    danoChefe: 25,
    efeito: "FIRE BLAST! -25 HP"
  },
  {
    situacao: "BARRA DE LIMITE CHEIA! Qual comando libera o golpe supremo final para vencer?",
    opcoes: ["Limit Break", "Game Over", "Low Battery", "Turn Off"],
    correta: "Limit Break",
    explicacaoAcerto: "INCRÍVEL! 'Limit Break' libera o poder máximo do herói!",
    explicacaoErro: "Que pena! 'Limit Break' era o golpe especial final para derrotar o chefe.",
    danoChefe: 35,
    efeito: "LIMIT BREAK! -35 HP"
  }
];

// Estado atual do jogo
let turnoAtual = 0;
let pontos = 0;
let hpHeroi = 100;
const hpHeroiMax = 100;
let hpChefe = 140;
const hpChefeMax = 140;
let tempoInicio = Date.now();
let respondeuTurno = false;

// Referências dos elementos da tela
const textoTurno = document.getElementById("textoTurno");
const textoPontos = document.getElementById("textoPontos");
const textoSituacao = document.getElementById("textoSituacao");
const textoFeedback = document.getElementById("textoFeedback");
const gradeBotoes = document.getElementById("gradeBotoes");
const btnProximo = document.getElementById("btnProximo");
const painelComandos = document.getElementById("painelComandos");
const telaFinal = document.getElementById("telaFinal");
const tituloFinal = document.getElementById("tituloFinal");
const resumoFinal = document.getElementById("resumoFinal");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnTema = document.getElementById("btnTema");

const barraVidaHeroi = document.getElementById("barraVidaHeroi");
const hpHeroiTexto = document.getElementById("hpHeroiTexto");
const barraVidaChefe = document.getElementById("barraVidaChefe");
const hpChefeTexto = document.getElementById("hpChefeTexto");
const efeitoGolpe = document.getElementById("efeitoGolpe");
const boxHeroi = document.getElementById("boxHeroi");
const boxChefe = document.getElementById("boxChefe");

// Atualiza as barras de vida e placar na tela
function atualizarInterface() {
  textoTurno.textContent = `TURNO ${Math.min(turnoAtual + 1, turnosBatalha.length)} / ${turnosBatalha.length}`;
  textoPontos.textContent = `PONTOS: ${pontos}`;

  const percHeroi = Math.max(0, (hpHeroi / hpHeroiMax) * 100);
  barraVidaHeroi.style.width = percHeroi + "%";
  hpHeroiTexto.textContent = `HP ${Math.max(0, hpHeroi)} / ${hpHeroiMax}`;

  const percChefe = Math.max(0, (hpChefe / hpChefeMax) * 100);
  barraVidaChefe.style.width = percChefe + "%";
  hpChefeTexto.textContent = `HP ${Math.max(0, hpChefe)} / ${hpChefeMax}`;
}

// Mostra texto flutuante de golpe na arena
function mostrarEfeitoArena(texto, alvoBox) {
  efeitoGolpe.textContent = texto;
  alvoBox.classList.remove("animar-dano");
  void alvoBox.offsetWidth;
  alvoBox.classList.add("animar-dano");

  setTimeout(() => {
    efeitoGolpe.textContent = "";
  }, 1100);
}

// Carrega o turno atual na tela
function carregarTurno() {
  respondeuTurno = false;
  btnProximo.classList.add("oculto");
  textoFeedback.textContent = "";
  textoFeedback.className = "texto-feedback";

  const dados = turnosBatalha[turnoAtual];
  textoSituacao.textContent = dados.situacao;
  gradeBotoes.innerHTML = "";

  dados.opcoes.forEach((opcao) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn-comando";
    botao.textContent = opcao;
    botao.addEventListener("click", () => verificarEscolha(opcao, botao));
    gradeBotoes.appendChild(botao);
  });

  atualizarInterface();
  notificarAlturaPortal();
}

// Verifica se o jogador escolheu o comando certo
function verificarEscolha(opcaoEscolhida, botaoClicado) {
  if (respondeuTurno) return;
  respondeuTurno = true;

  const dados = turnosBatalha[turnoAtual];
  const todosBotoes = gradeBotoes.querySelectorAll("button");

  todosBotoes.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === dados.correta) {
      btn.classList.add("correto");
    }
  });

  if (opcaoEscolhida === dados.correta) {
    pontos += 100;
    if (dados.curaHeroi) {
      hpHeroi = Math.min(hpHeroiMax, hpHeroi + dados.curaHeroi);
    }
    hpChefe = Math.max(0, hpChefe - dados.danoChefe);
    textoFeedback.textContent = "✔ " + dados.explicacaoAcerto;
    textoFeedback.classList.add("acerto");
    mostrarEfeitoArena(dados.efeito, boxChefe);
  } else {
    botaoClicado.classList.add("errado");
    hpHeroi = Math.max(0, hpHeroi - 25);
    textoFeedback.textContent = "✖ " + dados.explicacaoErro;
    textoFeedback.classList.add("erro");
    mostrarEfeitoArena("DANO! -25 HP", boxHeroi);
  }

  atualizarInterface();

  if (hpHeroi <= 0 || hpChefe <= 0 || turnoAtual === turnosBatalha.length - 1) {
    btnProximo.textContent = "VER RESULTADO DA BATALHA ▶";
  } else {
    btnProximo.textContent = "PRÓXIMO TURNO ▶";
  }

  btnProximo.classList.remove("oculto");
  notificarAlturaPortal();
}

// Avança para o próximo turno ou encerra o jogo
function avancarTurno() {
  if (hpHeroi <= 0 || hpChefe <= 0 || turnoAtual >= turnosBatalha.length - 1) {
    finalizarJogo();
    return;
  }
  turnoAtual++;
  carregarTurno();
}

// Mostra a tela final e envia pontuação para o portal
function finalizarJogo() {
  painelComandos.classList.add("oculto");
  telaFinal.classList.remove("oculto");

  const tempoTotalMs = Date.now() - tempoInicio;
  const maxPontos = turnosBatalha.length * 100;

  if (hpHeroi > 0 && pontos >= 400) {
    tituloFinal.textContent = "VITÓRIA ÉPICA!";
    resumoFinal.textContent = `Você derrotou o Titã de Aço MK-VII e dominou os comandos de batalha! Pontuação final: ${pontos} de ${maxPontos}.`;
  } else {
    tituloFinal.textContent = "FIM DE BATALHA!";
    resumoFinal.textContent = `O Titã de Aço resistiu desta vez, mas você já aprendeu vários comandos em inglês! Pontuação final: ${pontos} de ${maxPontos}.`;
  }

  // Contrato obrigatório do portal ao finalizar
  window.parent.postMessage(
    {
      type: "vrgame:finish",
      score: pontos,
      maxScore: maxPontos,
      timeMs: tempoTotalMs,
      detail: { jogo: "cyber-blade-turnos-de-aco" }
    },
    "*"
  );

  notificarAlturaPortal();
}

// Reinicia a partida do zero
function reiniciarJogo() {
  turnoAtual = 0;
  pontos = 0;
  hpHeroi = hpHeroiMax;
  hpChefe = hpChefeMax;
  tempoInicio = Date.now();

  telaFinal.classList.add("oculto");
  painelComandos.classList.remove("oculto");
  carregarTurno();
}

// Alterna tema claro e escuro
function alternarTema(forcarTema) {
  const atual = document.documentElement.getAttribute("data-theme");
  const novoTema = forcarTema || (atual === "light" ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", novoTema);
}

// Envia altura atual para o portal ajustar a janela
function notificarAlturaPortal() {
  const altura = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "vrgame:resize", height: altura }, "*");
}

// Eventos de botões
btnProximo.addEventListener("click", avancarTurno);
btnReiniciar.addEventListener("click", reiniciarJogo);
btnTema.addEventListener("click", () => alternarTema());

// Escuta mensagens enviadas pelo portal (tema e tela cheia)
window.addEventListener("message", (evento) => {
  const dados = evento.data;
  if (!dados || typeof dados !== "object") return;

  if (dados.type === "vrgame:theme" && (dados.theme === "light" || dados.theme === "dark")) {
    alternarTema(dados.theme);
  }

  if (dados.type === "vrgame:fullscreen") {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
});

window.addEventListener("resize", notificarAlturaPortal);

// Inicializa o jogo e avisa ao portal que está pronto
window.addEventListener("DOMContentLoaded", () => {
  carregarTurno();
  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  notificarAlturaPortal();
});