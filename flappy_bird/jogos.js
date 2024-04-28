console.log("flappy bird");
let frames = 0
const HIT = new Audio()
const sprites = new Image();
sprites.src = './sprites.png';
HIT.src = './efeitos/hit.wav';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

function fazColisao(flappyBird, chao){
  const flappyBirdy = flappyBird.y  + flappyBird.altura
  const chaoy = chao.y

  if(flappyBirdy >= chaoy){
     return true
  }
     return false

}
//flappyBird
function criaFlappyBird(){
    const flappyBird = {
        spriteX:0,
        spriteY:0,
        largura : 33,
        altura:24,
        x:10,
        y:50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula(){
            flappyBird.velocidade = -flappyBird.pulo
        },
        atualiza(){
            if(fazColisao(flappyBird,globais.chao)){
                HIT.play()
                setTimeout(()=>{
                    mudaParaTela(TELAS.INICIO);
                },500)
                return
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            {spriteX:0, spriteY:0,},//asa para cima
            {spriteX:0, spriteY:26,}, //asa no meio
            {spriteX:0, spriteY:52,}, //asa para baixo
        ],
        frameAtual:0,
        atualizaFrameAtual(){
            const intervalDeFrames =10
            const passouDoIntervalo = frames % intervalDeFrames  === 0

          if(passouDoIntervalo){
            const baseDoIncremento = 1
            const incremento = baseDoIncremento + flappyBird.frameAtual
            const baseRepeticao = flappyBird.movimentos.length
            flappyBird.frameAtual = incremento  % baseRepeticao
            // console.log("[incremento]",incremento)
            // console.log("[baseRepeticao]",baseRepeticao)
            // console.log("[flappyBird.frameAtual]",flappyBird.frameAtual)
          }
            
        },
        desenha(){
            flappyBird.atualizaFrameAtual()
            const {spriteX,spriteY} = flappyBird.movimentos[flappyBird.frameAtual]
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    
    }

    return flappyBird
}

function criaChao(){
  const chao = {
    spriteX:0,
    spriteY:610,
    largura :224,
    altura:112,
    x:0,
    y:canvas.height-112,
    desenha(){
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );

        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
        );
    },
    atualiza(){
        const movimentoChao = 1;
        const repeteEm = chao.largura/2
        const movimentacao  = chao.x -movimentoChao

        //console.log(['movimentoChao'],movimentoChao)
        //console.log(['repeteEm'],repeteEm)
       // console.log(['movimentação'],movimentacao)

       chao.x =movimentacao % repeteEm

      }
  }

  return chao
}


const planoDeFundo = {
    spriteX:390,
    spriteY:0,
    largura : 275,
    altura:204,
    x:0,
    y:canvas.height-204,
    desenha(){
        contexto.fillStyle ='#70c5ce';
        contexto.fillRect(0,0,canvas.width,canvas.height)
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x+planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

const mensagemGetReady = {
    spriteX:134,
    spriteY:0,
    largura : 174,
    altura:152,
    x: (canvas.width / 2)-174/2,
    y:50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    }
}
const globais = {}
let telaAtiva ={}
function mudaParaTela(novaTela){
    telaAtiva = novaTela

    if(telaAtiva.inicializa){
        telaAtiva.inicializa()
        
    }
}
const TELAS = {
    INICIO:{
        inicializa(){
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao()
        },
        desenha(){
            planoDeFundo.desenha()
            globais.chao.desenha()
            globais.flappyBird.desenha()
            mensagemGetReady.desenha()
        },
        click(){
            mudaParaTela(TELAS.JOGO)
        },
        atualiza(){
            globais.chao.atualiza()
        }

    },
    JOGO : {
        desenha(){
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
        },
        click(){
            globais.flappyBird.pula();
        },
        atualiza(){
            globais.flappyBird.atualiza();
        }
    }
}



function loop(){
    telaAtiva.desenha()
    telaAtiva.atualiza()
    frames = frames +1;
    requestAnimationFrame(loop);
}

window.addEventListener('click',function(){
    if(telaAtiva.click){
        telaAtiva.click()

    }
})

mudaParaTela(TELAS.INICIO)

loop();
