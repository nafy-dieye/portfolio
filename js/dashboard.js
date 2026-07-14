import { animateCount } from './utils.js';

const DASH_DATA = {
  stores: ['Plateau', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès'],
  bars: {
    tous: [82, 65, 90, 58, 74],
    alimentaire: [95, 70, 88, 60, 80],
    textile: [55, 80, 60, 90, 50],
    electronique: [70, 55, 95, 40, 85]
  },
  baseCA: { tous: 18.4, alimentaire: 9.6, textile: 5.1, electronique: 6.8 },
  baseBasket: { tous: 12500, alimentaire: 8200, textile: 21000, electronique: 45000 },
  growth: { tous: [4.2, 6.8, 9.1], alimentaire: [5.1, 7.4, 10.2], textile: [2.8, 4.9, 6.3], electronique: [6.5, 9.2, 13.4] },
  stockRisk: { tous: [6, 8, 11], alimentaire: [9, 12, 15], textile: [4, 6, 8], electronique: [7, 10, 13] }
};

const PERIODS = ['semaine', 'mois', 'trimestre'];
const PERIOD_FACTOR = { semaine: 1, mois: 4.2, trimestre: 12.8 };
let dashState = { cat: 'tous', period: 'mois' };

function buildBars(svg) {
  if (!svg) return;
  svg.innerHTML = '';
  const w = 300;
  const h = 150;
  const barW = 34;
  const gap = (w - DASH_DATA.stores.length * barW) / (DASH_DATA.stores.length + 1);
  const base = 124;
  const maxH = 96;

  DASH_DATA.stores.forEach((store, index) => {
    const x = gap + index * (barW + gap);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('id', `dashBar${index}`);
    rect.setAttribute('x', x);
    rect.setAttribute('width', barW);
    rect.setAttribute('rx', 2);
    rect.setAttribute('y', base);
    rect.setAttribute('height', 0);
    rect.setAttribute('fill', index % 2 === 0 ? '#E3A93B' : '#4FB3A0');
    svg.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + barW / 2);
    label.setAttribute('y', 140);
    label.setAttribute('text-anchor', 'middle');
    label.textContent = store;
    svg.appendChild(label);
  });
}

function trendPath(points) {
  const w = 300;
  const n = points.length;
  const step = w / (n - 1);
  let d = `M0,${points[0]}`;
  points.forEach((y, index) => {
    if (index > 0) d += ` L${(index * step).toFixed(1)},${y}`;
  });
  return d;
}

function updateDashboard() {
  const svg = document.getElementById('dashBarChart');
  const linePath = document.getElementById('dashLinePath');
  const areaPath = document.getElementById('dashAreaPath');
  if (!svg || !linePath || !areaPath) return;

  const bars = DASH_DATA.bars[dashState.cat];
  const base = 124;
  const maxH = 96;
  bars.forEach((value, index) => {
    const rect = document.getElementById(`dashBar${index}`);
    if (!rect) return;
    const height = (value / 100) * maxH;
    rect.setAttribute('height', height);
    rect.setAttribute('y', base - height);
  });

  const periodIndex = PERIODS.indexOf(dashState.period);
  const factor = PERIOD_FACTOR[dashState.period];
  const ca = DASH_DATA.baseCA[dashState.cat] * factor;
  const basket = Math.round(DASH_DATA.baseBasket[dashState.cat] * (1 + periodIndex * 0.015));
  const growth = DASH_DATA.growth[dashState.cat][periodIndex];
  const stock = DASH_DATA.stockRisk[dashState.cat][periodIndex];

  animateCount(document.getElementById('dashKpi1'), ca, 700, 1);
  animateCount(document.getElementById('dashKpi2'), basket, 700, 0);
  document.getElementById('dashKpi3').textContent = `+${growth.toFixed(1)}%`;
  document.getElementById('dashKpi4').textContent = `${stock}%`;

  const avg = bars.reduce((sum, value) => sum + value, 0) / bars.length;
  const points = [];
  for (let index = 0; index < 9; index += 1) {
    const seed = (index * 13 + periodIndex * 7 + dashState.cat.length * 5);
    const wave = Math.sin(seed * 0.6) * 14;
    const trendUp = (8 - index) * (growth / 6);
    points.push(Math.max(6, Math.min(100, 100 - (avg * 0.7 + wave + trendUp))));
  }
  const line = trendPath(points);
  linePath.setAttribute('d', line);
  areaPath.setAttribute('d', `${line} L300,110 L0,110 Z`);
}

function bindDashboardFilters() {
  document.querySelectorAll('#dashCatFilters .filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('#dashCatFilters .filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      dashState.cat = button.dataset.cat;
      updateDashboard();
    });
  });

  document.querySelectorAll('#dashPeriodFilters .filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('#dashPeriodFilters .filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      dashState.period = button.dataset.period;
      updateDashboard();
    });
  });
}

export async function initDashboardSection() {
  const svg = document.getElementById('dashBarChart');
  if (!svg) return;
  buildBars(svg);
  bindDashboardFilters();
  updateDashboard();
}
