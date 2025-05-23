
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
                }, 15);
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
            setTimeout(digitar, 15);
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
        setTimeout(removeUnderline, 500);
    } 

    setTimeout(digitar, 400);
    
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
    
}



const menu = document.querySelector("#menu");
const background = document.querySelector("#background");

window.onload = ()=>{
    background.style.animation = "background-animation 2s ease-in-out forwards";
    menu.style.animation = "aparecer 2s ease-in-out forwards";
    apresentacao.style.animation = "fadeIn 2s ease-in-out forwards";
    if(iniciado){
        pular = true;
    }
};



const username = "ditimon01";

const projectsContainer = document.getElementById("projects");
const filterContainer = document.getElementById("language-filter");

let allRepos = [];
let selectedLanguage = "Todos";

async function fetchRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);
    const data = await res.json();
    allRepos = data;
    renderLanguages();
    renderProjects("Todos");
  } catch (error) {
    projectsContainer.innerHTML = "<p>Erro ao carregar projetos.</p>";
  }
}

function getLanguageIcon(language) {
  switch (language) {
    case "JavaScript": return '<i class="fab fa-js"></i>';
    case "HTML": return '<i class="fab fa-html5"></i>';
    case "CSS": return '<i class="fab fa-css3-alt"></i>';
    case "Python": return '<i class="fab fa-python"></i>';
    case "Java": return '<i class="fab fa-java"></i>';
    case "C++": return '<i class="fas fa-code"></i>';
    default: return '<i class="fas fa-code"></i>';
  }
}

function renderLanguages() {
  const languages = new Set(allRepos.map(repo => repo.language).filter(Boolean));
  const buttons = ['Todos', ...languages];

  buttons.forEach(lang => {
    const botao = document.createElement("button");
    botao.classList.add("lang-btn");
    if (lang === "Todos") botao.classList.add("active");
    botao.innerHTML = `${lang === "Todos" ? '<i class="fas fa-globe"></i>' : getLanguageIcon(lang)} ${lang}`;
    botao.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      botao.classList.add("active");
      selectedLanguage = lang;
      renderProjects(lang);
    });
    filterContainer.appendChild(botao);
  });
}

function renderProjects(lang) {
  projectsContainer.innerHTML = "";
  const filtered = lang === "Todos"
    ? allRepos
    : allRepos.filter(repo => repo.language === lang);

  if (filtered.length === 0) {
    projectsContainer.innerHTML = "<p>Nenhum projeto encontrado.</p>";
    return;
  }

  filtered.forEach((repo, index) => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <a href="https://github.com/${username}/${repo.name}" target="_blank">
        <div class="project-title">${repo.name}</div>
        <div class="project-lang">${repo.language || "Sem linguagem definida"}</div>
        <div class="project-desc">${repo.description || "Sem descrição."}</div>
      </a>
    `;

    projectsContainer.appendChild(card);
  });

  projectsContainer.scrollIntoView({ behavior: "smooth" });
}

let verProjetos = document.querySelector("#verProjetos");

verProjetos.addEventListener("click", async ()=>{
    verProjetos.remove();
    await preencherTerminal();
    fetchRepos();
})



