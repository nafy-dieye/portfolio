import { createElement } from './utils.js';

const PROJECTS_ENDPOINT = './data/projects.json';

const filterButtons = [];

async function loadProjects() {
  const response = await fetch(PROJECTS_ENDPOINT);
  if (!response.ok) throw new Error('Unable to load projects data');
  return response.json();
}

function getProjectFilters(project) {
  if (Array.isArray(project.filters) && project.filters.length > 0) return project.filters;
  if (project.category) return [project.category];
  return ['Autre'];
}

function renderProjectCard(project, index) {
  const article = createElement('article', 'proj');
  const category = project.category || 'Autre';
  const filters = getProjectFilters(project);
  article.dataset.tags = filters.join(' ');

  const media = createElement('div', 'proj-media');
  media.innerHTML = `
    <span class="tag-chip">${category}</span>
    <svg viewBox="0 0 300 90" preserveAspectRatio="none">
      <polyline points="0,60 30,65 60,45 90,55 120,35 150,45 180,25 210,38 240,20 270,30 300,15" fill="none" stroke="#${project.featured ? 'E3A93B' : '4FB3A0'}" stroke-width="2" />
    </svg>
  `;

  const body = createElement('div', 'proj-body');
  const kpis = Array.isArray(project.kpis) && project.kpis.length > 0
    ? project.kpis
    : [
        { value: project.date || '2024', label: 'Date' },
        { value: project.link ? 'GitHub' : '—', label: 'Source' },
        { value: project.demo ? 'Live' : 'Repo', label: 'Déploiement' },
      ];

  body.innerHTML = `
    <div class="proj-top"><span class="proj-icon">${String(index + 1).padStart(2, '0')} · ${category}</span></div>
    <h3>${project.title}</h3>
    <p class="desc">${project.description}</p>
    <div class="proj-tags"></div>
    <div class="proj-kpis"></div>
    <div class="proj-actions"></div>
  `;

  const tags = body.querySelector('.proj-tags');
  const tagList = Array.isArray(project.tags) ? project.tags : [];
  tagList.forEach((tech) => {
    const span = createElement('span', '', tech);
    tags.appendChild(span);
  });

  const kpiList = body.querySelector('.proj-kpis');
  kpis.forEach((kpi) => {
    const item = createElement('div', '', '');
    item.innerHTML = `<div class="k-num">${kpi.value}</div><div class="k-lab">${kpi.label}</div>`;
    kpiList.appendChild(item);
  });

  const actions = body.querySelector('.proj-actions');
  if (project.link) {
    const githubLink = createElement('a', 'btn btn-ghost btn-sm', 'GitHub ↗');
    githubLink.href = project.link;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener';
    actions.appendChild(githubLink);
  }
  if (project.caseStudy) {
    const caseLink = createElement('a', 'btn btn-teal btn-sm', 'Étude de cas');
    caseLink.href = `#casestudies`;
    caseLink.dataset.cs = project.caseStudy;
    caseLink.rel = 'noopener';
    actions.appendChild(caseLink);
  }

  article.appendChild(media);
  article.appendChild(body);
  return article;
}

function bindFilters(projects) {
  const container = document.getElementById('projectFilters');
  if (!container) return;

  filterButtons.length = 0;
  const categories = ['all', ...new Set(projects.flatMap((project) => getProjectFilters(project)))];
  container.innerHTML = '';
  categories.forEach((category) => {
    const button = createElement('button', 'filter-btn', category === 'all' ? 'Tous' : category);
    button.dataset.filter = category;
    if (category === 'all') button.classList.add('active');
    container.appendChild(button);
    filterButtons.push(button);
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      const cards = document.querySelectorAll('#projGrid .proj');
      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.tags.includes(filter);
        card.classList.toggle('hidden', !matches);
      });
    });
  });
}

export async function initProjectsSection() {
  const grid = document.getElementById('projGrid');
  if (!grid) return;

  const projects = await loadProjects();
  grid.innerHTML = '';
  projects.forEach((project, index) => grid.appendChild(renderProjectCard(project, index)));
  bindFilters(projects);
}
