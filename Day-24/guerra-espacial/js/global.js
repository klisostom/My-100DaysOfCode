/**
 * Inicializa o jogo e dá o play.
 */
var jogo = new Jogo();

/**
 * Cria o objeto "Desenhavel" que será a classe base para
 * todos os objetos desenháveis do jogo. Define também as variáveis padrão
 * que todos os objetos filhos herdarão, assim como as funções padrão.
 */
function Desenhavel() {
    this.velocidade = 0;
    this.larguraCanvas = 0;
    this.alturaCanvas = 0;

    // Define uma função abastrata para ser sobrescrita nos objetos filho
    this.desenhar = function () {

    };

    this.iniciar = function (_x, _y, _largura, _altura) {
        // Variáveis padrão do eixo cartesiano
        this.x = _x;
        this.y = _y;
        this.largura = _altura;
        this.altura = _altura;
    };

    this.mover = function () { };
}

function Combo() {
    this.vivo = false; // Será marcado como true se o combo estiver em uso

    // Valores dos combos
    this.configurar = function (_x, _y, _velocidade) {
        this.x = _x;
        this.y = _y;
        this.velocidade = _velocidade;
        this.vivo = true;
    };

    // Função que desenha os combos
    this.desenhar = function () {
        this.context.clearRect(this.x, this.y, this.largura, this.altura);
        this.x += this.velocidade;

        if (this.x <= 0 - this.largura) {
            return true;
        } else {
            this.context.drawImage(repositorio.combo, this.x, this.y);
        }
    };

    // Reiniciar as propriedades do combo
    this.limpar = function () {
        this.x = 0;
        this.y = 0;
        this.velocidade = 0;
        this.vivo = false;
    };
}

Combo.prototype = new Desenhavel();

/**
 * Define um objeto para manter todas as nossas imagens do jogo para 
 * evitar que elas sejam criadas mais de uma vez.
 */
var repositorio = new function () {
    // Define os objetos de imagens
    this.planofundo = new Image();
    this.player = new Image();
    this.combo = new Image();

    var numImagens = 3;
    var numCarregados = 0;

    function imgCarregada() {
        numCarregados += 1;

        if (numCarregados === numImagens) {
            window.iniciar();
        }
    }

    this.planofundo.onload = function () {
        imgCarregada();
    };

    this.player.onload = function () {
        imgCarregada();
    };

    this.combo.onload = function () {
        imgCarregada();
    };

    // configura os caminhos (src) das imagens
    this.planofundo.src = "img/pf2.png";
    this.player.src = "img/player1.png";
    this.combo.src = "img/combo1.png";
}

/**
 * Cria o objeto PlanoFundo que se tornará um filho do
 * objeto Desenhavel. O plano de fundo será desenhado nesse objeto
 * e criará a ilusão de movimento ao deslocar a imagem.
 */
function PlanoFundo() {
    this.velocidade = 1;// Redefine a velocidade do plano de fundo para pintura

    // Implementa a função abstrata
    this.desenhar = function () {
        // Pinta o plano de fundo
        this.x -= this.velocidade;
        this.context.drawImage(repositorio.planofundo, this.x, this.y);

        // Desenha outra imagem na borda superior da primeira imagem
        this.context.drawImage(repositorio.planofundo, this.x + this.larguraCanvas, this.y);

        // Se a imagem for deslocada para fora da tela, redefine-a
        if (Math.abs(this.x) >= this.larguraCanvas) {
            this.x = 0;
        }
    };
}

// Define o PlanoFundo como herdeiro das propriedades de Desenhavel
PlanoFundo.prototype = new Desenhavel();

/**
 * Cria um objeto mais genérico que se encarregará de lidar com os dados do jogo.
 */
function Jogo() {
    this.iniciar = function () {
        // Recupera o elemento canvas
        this.pfCanvas = document.getElementById('planoDeFundo');
        this.playerCanvas = document.getElementById('player_mov');
        this.principalCanvas = document.getElementById('principal');
        var retorno = false;

        // Testa para verificar se o canvas é suportado
        if (this.pfCanvas.getContext) {
            // inicializa o objeto de plano de fundo
            this.planofundo = new PlanoFundo();
            this.planofundo.iniciar(0, 0); // Inicia no ponto 0,0

            this.pfContext = this.pfCanvas.getContext('2d');
            this.playerContext = this.playerCanvas.getContext('2d');
            this.principalContext = this.principalCanvas.getContext('2d');

            // inicializa os objetos configurando as propriedades em questão
            PlanoFundo.prototype.context = this.pfContext;
            PlanoFundo.prototype.larguraCanvas = this.pfCanvas.width;
            PlanoFundo.prototype.alturaCanvas = this.pfCanvas.height;

            Player.prototype.context = this.playerContext;
            Player.prototype.larguraCanvas = this.playerCanvas.width;
            Player.prototype.alturaCanvas = this.playerCanvas.height;

            Combo.prototype.context = this.principalContext;
            Combo.prototype.larguraCanvas = this.principalCanvas.width;
            Combo.prototype.alturaCanvas = this.principalCanvas.height;

            // Inicializa o objeto player
            this.player = new Player();
            // Configura o player para aparecer no meio da tela à esquerda
            var playerIniX = repositorio.player.width / 4;
            var playerIniY = this.playerCanvas.height / 3 + repositorio.player.height;
            this.player.iniciar(playerIniX, playerIniY, repositorio.player.width, repositorio.player.height);

            retorno = true;
        }
        return retorno;
    };

    // Inicia o loop de animação
    this.jogar = function () {
        this.player.desenhar();
        animar();
    };
}

/**
 * O loop de animação. Chama a função requestAnimationFrame
 * para otimizar o loop do jogo e desenha todos os objetos do jogo. Esta
 * função deve ser uma função gobal e não pode estar dentro de um objeto.
 */
function animar() {
    getFrameAnimacao(animar);
    jogo.planofundo.desenhar();
    jogo.player.mover();
    jogo.player.poolCombos.animar();
}

/**    
 * Essa é uma função criada por Paul Irish que
 * tenta encontrar a primeira API que trabalhe com otimização
 * de loops, caso contrário executa um setTimeout().
 */
window.getFrameAnimacao = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMEelement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function iniciar() {
    if (jogo.iniciar()) {
        jogo.jogar();
    }
}

function Pool(tamanhoMax) {
    var tamanho = tamanhoMax; // Máximo de combos permitidos no pool
    var pool = [];

    // Popula o vetor de pool com objetos de combo
    this.iniciar = function () {
        for (let i = 0; i < tamanho; i++) {
            // Inicializa o objeto de combo
            var combo = new Combo();
            combo.iniciar(0, 0, repositorio.combo.width, repositorio.combo.height);
            pool[i] = combo;
        }
    };

    // Pega o último item da lista e inicializa-o e empurra-o para a frente do vetor.
    this.get = function (x, y, velocidade) {
        if (!pool[tamanho - 1].vivo) {
            pool[tamanho - 1].configurar(x, y, velocidade);
            pool.unshift(pool.pop());
        }
    };

    /*
    * Usado para que o player seja capaz de obter dois combos de uma só vez. Se
    * apenas a função get() for usada duas vezes, o player é capaz de
    * de atacar com um combinação de 1 em vez de 2.
    */
    this.getDois = function (x1, y1, velocidade1, x2, y2, velocidade2) {
        if (!pool[tamanho - 1].vivo &&
            !pool[tamanho - 2].vivo) {
            this.get(x1, y1, velocidade1);
            this.get(x2, y2, velocidade2);
        }
    };

    // Desenha quaisquer combos. Se um combo vai para fora da tela, ele o limpa e o empurra para a frente do vetor.
    this.animar = function () {
        for (let i = 0; i < tamanho; i++) {
            // Apenas desenha quando encontrarmos um combo que não está vivo
            if (pool[i].vivo) {
                if (pool[i].desenhar()) {
                    pool[i].limpar();
                    pool.push((pool.splice(i, 1))[0]);
                }
            } else {
                break;
            }
        }
    };
}

function Player() {
    this.velocidade = 3;
    this.poolCombos = new Pool(50);
    this.poolCombos.iniciar();

    var intervaloTiros = 15;
    var cont = 0;

    this.desenhar = function () {
        this.context.drawImage(repositorio.player, this.x, this.y);
    };

    this.mover = function () {
        cont += 1;

        // Determina se vamos mover o player
        if (STATUS_CHAVES.left || STATUS_CHAVES.right || STATUS_CHAVES.down || STATUS_CHAVES.up) {
            // Assim que o player for redesenhado, apagamos a imagem antiga
            this.context.clearRect(this.x, this.y, this.largura, this.altura);

            // Atualiza as coordenados dos eixos e redesenha.
            if (STATUS_CHAVES.left) {
                this.x -= this.velocidade;
                if (this.x <= 0) { // Mantém o player dentro
                    this.x = 0;
                }
            } else if (STATUS_CHAVES.right) {
                this.x += this.velocidade;
                if (this.x >= this.larguraCanvas / 8 * 2) {
                    this.x = this.larguraCanvas / 8 * 2;
                }
            } else if (STATUS_CHAVES.up) {
                this.y -= this.velocidade;
                if (this.y <= this.alturaCanvas / 100) {
                    this.y = this.alturaCanvas / 100;
                }
            } else if (STATUS_CHAVES.down) {
                this.y += this.velocidade;
                if (this.y >= this.alturaCanvas - this.altura) {
                    this.y = this.alturaCanvas - this.largura;
                }
            }

            // Finaliza redesenhando o player
            this.desenhar();
        }

        if (STATUS_CHAVES.space && cont >= intervaloTiros) {
            this.atirar();
            cont = 0;
        }
    };

    // Atira dois combos
    this.atirar = function () {
        this.poolCombos.getDois(this.x + 46, this.y + 16, 3,
            this.x + 73, this.y + 26, 3);
    };
}

Player.prototype = new Desenhavel();

/*
* Os códigos de teclas que serão mapeados quando o usuário pressiona um botão.
* Código original por Doug McInnes
*/
CODIGOS_TECLAS = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
}

/* Cria uma matriz para guardar os CODIGOS_TECLAS e define todos os seus valores
* como false. Verificando true/false é a maneira mais rápida para verificar o estado
* de uma tecla pressionada e qual foi pressionada ao determinar
* quando mover e em qual direção.
*/
STATUS_CHAVES = {};

for (const codigo in CODIGOS_TECLAS) {
    STATUS_CHAVES[CODIGOS_TECLAS[codigo]] = false;
}

/**
 * Configura o documento para ouvir eventos onkeydown (disparado quando
 * qualquer tecla do teclado é pressionada para baixo). Quando uma tecla é pressionada,
 * ele define a direção adequada para true para que possamos saber qual
 * chave era.
 */
document.onkeydown = function (e) {
    //  Firefox and opera use charCode instead of keyCode to return wich key was pressed.
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (CODIGOS_TECLAS[keyCode]) {
        e.preventDefault();
        STATUS_CHAVES[CODIGOS_TECLAS[keyCode]] = true;
    }
};

/**
 * Configura o documento para ouvir eventos ownkeyup (disparado quando
 * qualquer tecla do teclado é liberada). Quando uma tecla é liberada,
 * ele define a direção adequada para false para que possamos saber qual
 * chave era.
 */
document.onkeyup = function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (CODIGOS_TECLAS[keyCode]) {
        e.preventDefault();
        STATUS_CHAVES[CODIGOS_TECLAS[keyCode]] = false;
    }
};