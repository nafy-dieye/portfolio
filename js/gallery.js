import { createElement } from './utils.js';

const GALLERY_ITEMS = [
  {
    title: 'Eau Potable Dans Le Monde',
    description: 'Power BI · Machine Learning',
    caption: 'Eau Potable Dans Le Monde — Dashboard Power BI : cartes choroplèthes, tendances de potabilité et prédiction ML par pays.',
    image: 'assets/dashboards/Vue Continentale.png',
    alt: 'Aperçu du dashboard Power BI — Eau Potable Dans Le Monde'
  },
  {
    title: 'Analyse des ventes Retail',
    description: 'Power BI · KPI commerciaux',
    caption: 'Analyse des ventes Retail — Dashboard Power BI : KPI commerciaux, performance par magasin et prédiction des ventes.',
    image: 'assets/dashboards/vente retail 1.png',
    alt: 'Aperçu du dashboard Power BI — Analyse des ventes Retail'
  },
  {
    title: 'WASH Dashboard',
    description: 'Power BI · DAX · Storytelling',
    caption: 'WASH Dashboard — Accès à l\'eau potable et à l\'assainissement dans le monde, mesures DAX avancées.',
    image: 'assets/dashboards/Vue Nationale.png',
    alt: 'Aperçu du dashboard Power BI — WASH Dashboard'
  },
  {
    title: 'Fifa World Cup 2026',
    description: 'Machine Learning · Django',
    caption: 'Fifa World Cup 2026 — Interface web de prédiction de matchs (Django) branchée sur un modèle RandomForest.',
    image: 'assets/dashboards/fifa.png',
    alt: 'Aperçu de l\'application — Fifa World Cup 2026'
  },
  {
    title: 'Analyse des Demandes de Crédit',
    description: 'Statistiques · Reporting',
    caption: 'Analyse des Demandes de Crédit — segmentation des demandeurs et tests statistiques d\'association.',
    image: 'assets/dashboards/credit.png',
    alt: 'Aperçu de l\'analyse — Demandes de Crédit'
  }
];

function renderGalleryItem(item, index) {
  const button = createElement('button', 'gallery-item');
  button.type = 'button';
  button.dataset.caption = item.caption;
  button.innerHTML = `
    <div class="gallery-media">
      <img loading="lazy" src="${item.image}" alt="${item.alt}" />
      <div class="gallery-fallback" aria-hidden="true">
        <svg viewBox="0 0 260 150">
          <rect x="0" y="0" width="260" height="150" fill="#161F1B" />
          <rect x="14" y="14" width="60" height="10" rx="2" fill="#E3A93B" />
          <rect x="14" y="34" width="110" height="34" rx="3" fill="#1C2721" stroke="#4FB3A0" stroke-width="1" />
          <circle cx="45" cy="51" r="14" fill="none" stroke="#4FB3A0" stroke-width="6" stroke-dasharray="60 28" />
          <rect x="132" y="34" width="114" height="34" rx="3" fill="#1C2721" />
          <polyline points="140,58 160,44 178,50 196,32 214,40 232,26" fill="none" stroke="#E3A93B" stroke-width="2" />
          <rect x="14" y="76" width="232" height="60" rx="3" fill="#1C2721" />
          <rect x="24" y="118" width="14" height="10" fill="#4FB3A0" />
          <rect x="46" y="104" width="14" height="24" fill="#4FB3A0" />
          <rect x="68" y="112" width="14" height="16" fill="#E3A93B" />
          <rect x="90" y="96" width="14" height="32" fill="#4FB3A0" />
          <rect x="112" y="108" width="14" height="20" fill="#E0725A" />
          <rect x="134" y="90" width="14" height="38" fill="#4FB3A0" />
          <rect x="156" y="100" width="14" height="28" fill="#E3A93B" />
          <rect x="178" y="86" width="14" height="42" fill="#4FB3A0" />
          <rect x="200" y="94" width="14" height="34" fill="#E0725A" />
          <rect x="222" y="80" width="14" height="48" fill="#4FB3A0" />
        </svg>
      </div>
      <span class="gallery-zoom" aria-hidden="true">⤢</span>
    </div>
    <div class="gallery-caption">
      <span class="gallery-title">${item.title}</span>
      <span class="gallery-desc">${item.description}</span>
    </div>
  `;

  const image = button.querySelector('img');
  image.addEventListener('load', () => {
    image.style.display = 'block';
    image.closest('.gallery-media').classList.add('has-img');
  });
  image.addEventListener('error', () => image.remove());

  return button;
}

function openLightbox(item) {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if (!lightbox || !lightboxContent || !lightboxCaption) return;

  const media = item.querySelector('.gallery-media');
  if (!media) return;

  lightboxContent.innerHTML = '';
  const img = media.querySelector("img").cloneNode();

  lightboxContent.innerHTML = "";
  lightboxContent.appendChild(img);
  lightboxCaption.textContent = item.dataset.caption || '';
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('lightboxClose').focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export async function initGallerySection() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = '';
  GALLERY_ITEMS.forEach((item) => grid.appendChild(renderGalleryItem(item)));

  document.querySelectorAll('.gallery-item[data-caption]').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(item);
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('show')) closeLightbox();
  });
}
