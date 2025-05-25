
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





const username = "ditimon01";

const projectsContainer = document.getElementById("projects");
const filterContainer = document.getElementById("language-filter");
const techIconsContainer = document.getElementById("icones-tecnologias");

let allRepos = [];
let allLanguages = new Set();
let selectedLanguage = "Todos";


const languageMap = {
  "C++": "C++",
  "C": "C",
  "Shell": "Shell",
  "HTML": "HTML",
  "CSS": "CSS",
  "JavaScript": "JavaScript",
  "TypeScript": "TypeScript",
  "Java": "Java",
  "Python": "Python",
  "PHP": "PHP"
};

function normalizarLinguagem(lang) {
  return languageMap[lang] || "Outros";
}


const iconesSimples = {
  JavaScript: '<i class="fab fa-js"></i>',
  HTML: '<i class="fab fa-html5"></i>',
  CSS: '<i class="fab fa-css3-alt"></i>',
  Python: '<i class="fab fa-python"></i>',
  Java: '<i class="fab fa-java"></i>',
  "C++": '<i class="fas fa-code"></i>',
  TypeScript: '<i class="fab fa-js"></i>',
  Shell: '<i class="fas fa-terminal"></i>',
  PHP: '<i class="fab fa-php"></i>',
  default: '<i class="fas fa-code"></i>',
  Outros: '<i class="fas fa-code"></i>'
};

const iconesColoridos = {
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  Shell: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  "C": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "Outros": './icones/code.png'
};



function getIconeSimples(linguagem) {
  return iconesSimples[linguagem] || iconesSimples["default"];
}


async function fetchRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);

    if (!res.ok) throw new Error("Erro na API do GitHub");

    const repositorio = await res.json();

    const repositorioLinguagens = await Promise.all(repositorio.map(async (repositorio) => {
      const langRes = await fetch(repositorio.languages_url);
      const languages = await langRes.json();
      let langList = Object.keys(languages);

      if(langList.length === 0) {
        langList = ["Outros"];
      }

      langList = langList.map(normalizarLinguagem);

      langList.forEach(l => allLanguages.add(l));
      return { ...repositorio, languages: langList };
    }));

    allRepos = repositorioLinguagens;

  } catch (error) {
    projectsContainer.innerHTML = "<p>Erro ao carregar projetos.</p>";
    console.error(error);
  }
}


function renderLanguages() {
  filterContainer.innerHTML = "";

  const buttons = ['Todos', ...Array.from(allLanguages)];

  buttons.forEach(lang => {

    const botao = document.createElement("button");
    botao.classList.add("lang-btn");
    if (lang === "Todos") botao.classList.add("active");
    botao.innerHTML = `${lang === "Todos" ? '<i class="fas fa-globe"></i>' : getIconeSimples(lang)} ${lang}`;

    botao.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      botao.classList.add("active");
      selectedLanguage = lang;
      renderProjects(lang);
    });

    filterContainer.appendChild(botao);
  });
}


function renderTechIcons() {
  techIconsContainer.innerHTML = '';

  Array.from(allLanguages).forEach(lang => {
    const img = document.createElement('img');
    img.src = iconesColoridos[lang] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/code/code-original.svg';
    img.alt = lang;
    img.title = lang;
    img.classList.add("tech-icon");
    techIconsContainer.appendChild(img);
  });
}


function renderProjects(lang) {
  projectsContainer.innerHTML = "";

  const filtered = lang === "Todos"
    ? allRepos
    : allRepos.filter(repo => repo.languages.includes(lang));

    if (filtered.length === 0) {
      projectsContainer.innerHTML = "<p>Nenhum projeto encontrado.</p>";
      return;
    }

    filtered.forEach((repo, index) => {
      const linguagens = (repo.languages || []).map(l => getIconeSimples(l)).join(' ');

      const card = document.createElement("div");
      card.classList.add("project-card");
      card.style.animationDelay = `${index * 0.1}s`;

      card.innerHTML = `
        <a href="https://github.com/${username}/${repo.name}" target="_blank">
          <div class="project-title">${repo.name}</div>
          <div class="project-lang">${linguagens}</div>
          <div class="project-desc">${repo.description || "Sem descrição."}</div>
        </a>
      `;

    projectsContainer.appendChild(card);
  });

  projectsContainer.scrollIntoView({ behavior: "smooth" });
}

function renderTudo() {
  renderLanguages();
  renderProjects("Todos");
}




const menu = document.querySelector("#menu");
const background = document.querySelector("#background");

window.onload = async () => {
  background.style.animation = "background-animation 2s ease-in-out forwards";
  menu.style.animation = "aparecer 2s ease-in-out forwards";
  apresentacao.style.animation = "fadeIn 2s ease-in-out forwards";

  if(iniciado){
    pular = true;
  }

  await fetchRepos();
  renderTechIcons();
}

verProjetos = document.getElementById("verProjetos");

verProjetos.addEventListener("click", async ()=>{
    verProjetos.remove();
    await preencherTerminal();
    renderTudo();
});






