const GITHUB_USERNAME = 'nafy-dieye';

const TOP_LANGUAGES = [
  { label: 'Python', value: 'Data analysis' },
  { label: 'Jupyter Notebook', value: 'Notebooks' },
  { label: 'SQL', value: 'Requetes' },
  { label: 'HTML / CSS', value: 'Portfolio' }
];

function createStatCard(label, value) {
  const card = document.createElement('div');
  card.className = 'gh-stat';
  card.innerHTML = `
    <div class="n">${label}</div>
    <div class="l">${value}</div>
  `;
  return card;
}

function createStreakCard() {
  const wrap = document.createElement('div');
  wrap.className = 'gh-img-wrap gh-streak-card';
  wrap.innerHTML = `
    <div class="gh-streak-head">
      <span class="gh-fire" aria-hidden="true">🔥</span>
      <span>Contribution Streak</span>
    </div>
    <div class="gh-streak-media" align="center">
      <img
        src="https://streak-stats.demolab.com/?user=${GITHUB_USERNAME}&theme=dark&hide_border=true&background=161F1B&stroke=4FB3A0&ring=E3A93B&fire=E0725A&currStreakNum=EFEDE4&sideNums=EFEDE4&currStreakLabel=4FB3A0&sideLabels=B9C2BA&dates=B9C2BA"
        alt="GitHub Streak"
        loading="lazy"
      />
    </div>
    <a class="gh-fb-link" href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener">Voir le profil GitHub ↗</a>
  `;
  return wrap;
}

export async function initGitHubSection() {
  const statsContainer = document.getElementById('githubStats');
  const cardsContainer = document.getElementById('githubCards');
  if (!statsContainer || !cardsContainer) return;

  statsContainer.innerHTML = '';
  cardsContainer.innerHTML = '';

  TOP_LANGUAGES.forEach((language) => {
    statsContainer.appendChild(createStatCard(language.label, language.value));
  });

  cardsContainer.appendChild(createStreakCard());
}
