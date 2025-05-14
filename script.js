
let iniciado = false;
let pular = false;
const somClique = new Audio('sons/clique.mp3');

async function criarLinha(conteudoTexto, container, under){

    return new Promise(resolve =>{
    const pai = document.querySelector(container);

    let underline;

    if(under == true){
    underline = document.createElement("span");
    underline.id = "underline";
    underline.textContent = "_";
    }

    if(pai.children.length == 1){
        pai.style.animation = "fadeIn 1s ease-in-out";
        pai.style.opacity = 1;
    }

    const seta = document.createElement("span");
    seta.textContent = "➜ ";

    const texto = document.createElement("span");

    let i = 0;
    function digitar(){
        if(pular){
            if(under){
                texto.innerHTML = conteudoTexto + '<span id="underline">_</span>';
                setTimeout(()=>{
                    if(under){
                        underline = texto.querySelector("#underline");
                        underline.remove();
                    }
                    somClique.pause();
                    resolve();
                }, 100);
                return;
            }

            texto.innerHTML = conteudoTexto;
            resolve();
            return;
        }
        if(i <= conteudoTexto.length) {
            somClique.play();
            if(under){
                texto.innerHTML = conteudoTexto.substring(0, i) + '<span id="underline">_</span>';
            }else{
                texto.innerHTML = conteudoTexto.substring(0, i);
            }
             
            i++;
            setTimeout(digitar, 100);
        }else{
            setTimeout(()=>{
                if(under){
                    underline = texto.querySelector("#underline");
                    underline.remove();
                }
                somClique.pause();
                resolve();
            }, 500);
        }
    }

    const div = document.createElement("div");

    div.appendChild(seta);

    if(under == true) {
        div.appendChild(underline);
    }

    div.appendChild(texto);
    pai.appendChild(div);

    

    if(under == true){
        function removeUnderline(){
            div.removeChild(underline)
        }
        setTimeout(removeUnderline, 700);
    } 

    setTimeout(digitar, 650);
    
    })}

async function criarUnderline(container){
    const pai = document.querySelector(container);

    const seta = document.createElement("span");
    seta.textContent = "➜ ";

    const underline = document.createElement("span");
    underline.id = "underline";
    underline.textContent = "_";

    const div = document.createElement("div");

    div.appendChild(seta);
    div.appendChild(underline);
    pai.appendChild(div);

}

async function preencherTerminal(){

    await criarLinha("cd /portfolio", ".terminal-box", true);
    await criarLinha("echo \"Desenvolvedor em construção...\"", ".terminal-box", true);
    await criarLinha("sleep 1", ".terminal-box", true);
    await criarLinha("fetch --projects --from github", ".terminal-box", true);
    await criarUnderline(".terminal-box");
    mostrarBotoes();
    
}

async function mostrarBotoes() {

    const botao = document.querySelectorAll(".buttons");
    botao.forEach(a => {
        a.style.opacity = 1;
    });
}


const apresentacao = document.querySelector("#apresentacao");

document.addEventListener("click",()=>{
    apresentacao.style.animation = "fadeIn 2s ease-in-out"
    apresentacao.style.opacity = 1;
    if(iniciado){
        pular = true;
    }
    iniciado = true;
})


apresentacao.addEventListener("animationend", ()=>{
    preencherTerminal();
    
}, {once: true});


document.addEventListener("click", ()=>{
    
});

