import { createElement } from './utils.js';

const CONTENT_ENDPOINTS = {
  skills: './data/skills.json',
  timeline: './data/timeline.json',
  certifications: './data/certifications.json',
  cases: './data/cases.json',
  results: './data/results.json'
};

async function loadJson(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Unable to load ${endpoint}`);
  return response.json();
}

function createSkillCard(group) {
  const card = createElement('article', 'skill-card');
  card.innerHTML = `
    <div class="g-title">${group.title}</div>
    ${group.items.map((item) => `
      <div class="bar-item">
        <div class="bar-top">
          <span>${item.name}</span>
          <span class="pct">${item.level}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" data-pct="${item.level}"></div>
        </div>
      </div>
    `).join('')}
  `;
  return card;
}

function createTimelineItem(item) {
  const el = createElement('article', 'tl-item');
  el.dataset.type = item.type;
  el.innerHTML = `
    <div class="tl-date">${item.date}<span class="tl-type">${item.typeLabel}</span></div>
    <div class="tl-role">${item.title}</div>
    <div class="tl-org">${item.company}</div>
    ${item.bullets ? `<ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>` : `<p class="tl-desc">${item.description}</p>`}
  `;
  return el;
}

function createCertificationCard(item) {
  const el = createElement('article', item.comingSoon ? 'cert-card empty' : 'cert-card');
  el.innerHTML = `
    <div class="cert-plat">${item.platform}</div>
    <div class="cert-name">${item.name}</div>
    <div class="cert-date">${item.date}</div>
    ${item.comingSoon ? '<div class="cert-empty-tag">Bientôt</div>' : ''}
  `;
  return el;
}

function createCaseTab(item, index) {
  const button = createElement('button', 'cs-tab');
  button.type = 'button';
  button.dataset.cstab = item.slug;
  button.textContent = `${String(index + 1).padStart(2, '0')} — ${item.title}`;
  if (index === 0) button.classList.add('active');
  return button;
}

function createCasePanel(item, index) {
  const panel = createElement('div', 'cs-panel');
  if (index === 0) panel.classList.add('active');
  panel.id = `cs-${item.slug}`;
  panel.setAttribute('role', 'tabpanel');
  panel.innerHTML = `
    <div class="cs-head">
      <div>
        <h3>${item.title}</h3>
        <div class="cs-org">${item.stack}</div>
      </div>
      ${item.repo ? `<a class="btn btn-ghost btn-sm" href="${item.repo}" target="_blank" rel="noopener">Voir le repo ↗</a>` : ''}
    </div>
    <div class="cs-grid">
      <div class="cs-block">
        <div class="cs-lab"><span class="n">01</span>Le problème</div>
        <p>${item.problem}</p>
      </div>
      <div class="cs-block">
        <div class="cs-lab"><span class="n">02</span>Les données</div>
        <p>${item.data}</p>
      </div>
      <div class="cs-block">
        <div class="cs-lab"><span class="n">03</span>Le nettoyage</div>
        <ul>${item.cleaning.map((entry) => `<li>${entry}</li>`).join('')}</ul>
      </div>
      <div class="cs-block">
        <div class="cs-lab"><span class="n">04</span>Les analyses</div>
        <ul>${item.analysis.map((entry) => `<li>${entry}</li>`).join('')}</ul>
      </div>
      <div class="cs-block">
        <div class="cs-lab"><span class="n">05</span>Visualisations</div>
        <p>${item.visualization}</p>
      </div>
      <div class="cs-block">
        <div class="cs-lab"><span class="n">06</span>Recommandations &amp; conclusion</div>
        <p>${item.conclusion}</p>
      </div>
    </div>
  `;
  return panel;
}

function createResultCard(result) {
  const card = createElement('article', 'result-card');
  card.innerHTML = `
    <div class="result-head">
      <span class="result-icon">${result.index}</span>
      <h3>${result.title}</h3>
    </div>
    <div class="result-kpis">
      ${result.kpis.map((kpi) => `
        <div class="result-kpi">
          <div class="rk-lab">${kpi.label}</div>
          <div class="rk-val">${kpi.value}</div>
        </div>
      `).join('')}
    </div>
  `;
  return card;
}

function bindTimelineFilters(items) {
  const filterContainer = document.getElementById('timelineFilters');
  const cards = Array.from(document.querySelectorAll('#tlContainer .tl-item'));
  if (!filterContainer || cards.length === 0) return;

  const filters = ['all', ...new Set(items.map((item) => item.type))];
  filterContainer.innerHTML = '';
  filters.forEach((filter, index) => {
    const button = createElement('button', 'filter-btn');
    button.type = 'button';
    button.dataset.tlf = filter;
    button.textContent = index === 0 ? 'Tout' : filter === 'experience' ? 'Experiences' : filter === 'formation' ? 'Formation' : filter === 'projet' ? 'Projets' : 'Certifications';
    if (index === 0) button.classList.add('active');
    filterContainer.appendChild(button);
  });

  filterContainer.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      filterContainer.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const selected = button.dataset.tlf;
      cards.forEach((card) => {
        const matches = selected === 'all' || card.dataset.type === selected;
        card.classList.toggle('hide', !matches);
      });
    });
  });
}

export async function initContentSection() {
  try {
    const [skills, timeline, certifications, cases, results] = await Promise.all([
      loadJson(CONTENT_ENDPOINTS.skills),
      loadJson(CONTENT_ENDPOINTS.timeline),
      loadJson(CONTENT_ENDPOINTS.certifications),
      loadJson(CONTENT_ENDPOINTS.cases),
      loadJson(CONTENT_ENDPOINTS.results)
    ]);

    const skillsGrid = document.getElementById('skillsGrid');
    if (skillsGrid) {
      skillsGrid.innerHTML = '';
      skills.forEach((group) => skillsGrid.appendChild(createSkillCard(group)));
    }

    const tlContainer = document.getElementById('tlContainer');
    if (tlContainer) {
      tlContainer.innerHTML = '';
      timeline.forEach((item) => tlContainer.appendChild(createTimelineItem(item)));
      bindTimelineFilters(timeline);
    }

    const certGrid = document.getElementById('certGrid');
    if (certGrid) {
      certGrid.innerHTML = '';
      certifications.forEach((item) => certGrid.appendChild(createCertificationCard(item)));
    }

    const caseTabs = document.getElementById('caseStudyTabs');
    const casePanels = document.getElementById('caseStudyPanels');
    if (caseTabs && casePanels) {
      caseTabs.innerHTML = '';
      casePanels.innerHTML = '';
      cases.forEach((caseItem, index) => {
        caseTabs.appendChild(createCaseTab(caseItem, index));
        casePanels.appendChild(createCasePanel(caseItem, index));
      });

      caseTabs.querySelectorAll('.cs-tab').forEach((button) => {
        button.addEventListener('click', () => {
          caseTabs.querySelectorAll('.cs-tab').forEach((item) => item.classList.remove('active'));
          button.classList.add('active');
          const selected = button.dataset.cstab;
          casePanels.querySelectorAll('.cs-panel').forEach((panel) => {
            panel.classList.toggle('active', panel.id === `cs-${selected}`);
          });
        });
      });
    }

    const resultsGrid = document.getElementById('resultsGrid');
    if (resultsGrid) {
      resultsGrid.innerHTML = '';
      results.forEach((result, index) => resultsGrid.appendChild(createResultCard({ ...result, index: String(index + 1).padStart(2, '0') })));
    }

    document.querySelectorAll('.bar-fill').forEach((fill) => {
      fill.style.width = `${fill.dataset.pct}%`;
    });
  } catch (error) {
    console.error('Unable to initialize content sections', error);
  }
}
