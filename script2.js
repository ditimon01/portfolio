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

function renderLanguages() {
  const languages = new Set(allRepos.map(repo => repo.language).filter(Boolean));
  const buttons = ['Todos', ...languages];

  buttons.forEach(lang => {
    const botao = document.createElement("button");
    botao.classList.add("lang-btn");
    if (lang === "Todos") botao.classList.add("active");
    botao.innerText = lang;
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

  filtered.forEach(repo => {
    const card = document.createElement("div");
    card.classList.add("project-card");


    card.innerHTML = `
    <a href="https://github.com/${username}/${repo.name}">
      <div class="project-title">${repo.name}</div>
      <div class="project-lang">${repo.language || "Sem linguagem definida"}</div>
      <div class="project-desc">${repo.description || "Sem descrição."}</div>
      </a>
    `;

    projectsContainer.appendChild(card);
  });
}





fetchRepos();
