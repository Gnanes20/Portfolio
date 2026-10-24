/**
 * GNANESWARAN S — LIQUID ANIMATION & GLASSMORPHISM LOGIC
 * Features:
 * 1. Interactive Category Cards with Liquid Highlight & Fluid Staggered Reveal
 * 2. Pure Media Showcase: Zero text overlays, zero file names, clean artwork & videos
 * 3. In-page Lightbox Modal with proper close button and arrow navigation
 */

(function () {
  'use strict';

  let currentActiveCategory = 'SM Post';
  let filteredItems = [];
  let currentModalIndex = 0;

  // DOM Elements
  const categoryCardsGrid = document.getElementById('categoryCardsGrid');
  const galleryGrid = document.getElementById('galleryGrid');
  const activeCategoryTitle = document.getElementById('activeCategoryTitle');

  // Lightbox Modal Elements
  const workModal = document.getElementById('workModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');
  const modalMediaHolder = document.getElementById('modalMediaHolder');
  const modalIndexCounter = document.getElementById('modalIndexCounter');

  // =========================================================================
  // 1. LIQUID MEDIA SHOWCASE (Zero Text Badges or Filenames)
  // =========================================================================
  function renderGallery() {
    if (!PORTFOLIO_CATALOG || !galleryGrid) return;

    const items = PORTFOLIO_CATALOG[currentActiveCategory] || [];
    filteredItems = items;

    if (activeCategoryTitle) {
      activeCategoryTitle.textContent = `Displaying ${currentActiveCategory}`;
    }

    // Liquid Fade Out then Re-render with Staggered Entrance
    galleryGrid.style.opacity = '0';

    setTimeout(() => {
      galleryGrid.innerHTML = '';

      if (filteredItems.length === 0) {
        galleryGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
            <p>No works found in this section.</p>
          </div>
        `;
        galleryGrid.style.opacity = '1';
        return;
      }

      filteredItems.forEach((filename, idx) => {
        const isVideo = filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.webm');
        const filePath = `${encodeURIComponent(currentActiveCategory)}/${encodeURIComponent(filename)}`;

        const itemCard = document.createElement('div');
        itemCard.className = 'liquid-work-card';
        itemCard.setAttribute('data-category', currentActiveCategory);
        itemCard.setAttribute('data-index', idx);
        
        // Staggered liquid entrance animation delay
        itemCard.style.animationDelay = `${Math.min(0.5, idx * 0.035)}s`;

        if (isVideo) {
          itemCard.innerHTML = `
            <div class="video-play-disc-clean"><i class="fa-solid fa-play"></i></div>
            <video class="media-pure-video" preload="metadata" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()">
              <source src="${filePath}" type="video/mp4">
            </video>
          `;
        } else {
          itemCard.innerHTML = `
            <img class="media-pure-img" loading="lazy" src="${filePath}" alt="Visual Work">
          `;
        }

        // Click to open inside in-page lightbox modal
        itemCard.addEventListener('click', () => {
          openWorkModal(idx);
        });

        galleryGrid.appendChild(itemCard);
      });

      galleryGrid.style.opacity = '1';
    }, 180);
  }

  function setActiveCategory(cat) {
    currentActiveCategory = cat;

    // Highlight the selected Category Card
    if (categoryCardsGrid) {
      categoryCardsGrid.querySelectorAll('.category-liquid-card').forEach(card => {
        if (card.getAttribute('data-category') === cat) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }

    renderGallery();
  }

  // Interactive Category Cards Click Handling (Liquid Selection)
  if (categoryCardsGrid) {
    categoryCardsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-liquid-card');
      if (!card) return;
      const cat = card.getAttribute('data-category');
      if (cat && cat !== currentActiveCategory) {
        setActiveCategory(cat);
      }
    });
  }

  // =========================================================================
  // 2. IN-PAGE LIGHTBOX (PROPER CLOSE BUTTON & CONTROLS)
  // =========================================================================
  function openWorkModal(index) {
    if (!filteredItems || index < 0 || index >= filteredItems.length) return;
    currentModalIndex = index;
    updateModalContent();

    workModal.classList.add('active');
    workModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeWorkModal() {
    workModal.classList.remove('active');
    workModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    const video = modalMediaHolder.querySelector('video');
    if (video) {
      video.pause();
    }
    modalMediaHolder.innerHTML = '';
  }

  function updateModalContent() {
    const filename = filteredItems[currentModalIndex];
    if (!filename) return;

    const isVideo = filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.webm');
    const filePath = `${encodeURIComponent(currentActiveCategory)}/${encodeURIComponent(filename)}`;

    modalMediaHolder.innerHTML = '';

    if (isVideo) {
      const vid = document.createElement('video');
      vid.src = filePath;
      vid.controls = true;
      vid.autoplay = true;
      vid.loop = true;
      vid.playsInline = true;
      modalMediaHolder.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = filePath;
      img.alt = 'Portfolio Work';
      modalMediaHolder.appendChild(img);
    }

    if (modalIndexCounter) {
      modalIndexCounter.textContent = `${currentModalIndex + 1} / ${filteredItems.length}`;
    }
  }

  function showNextModalItem() {
    if (filteredItems.length <= 1) return;
    currentModalIndex = (currentModalIndex + 1) % filteredItems.length;
    updateModalContent();
  }

  function showPrevModalItem() {
    if (filteredItems.length <= 1) return;
    currentModalIndex = (currentModalIndex - 1 + filteredItems.length) % filteredItems.length;
    updateModalContent();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeWorkModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeWorkModal);
  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextModalItem();
    });
  }
  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevModalItem();
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!workModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeWorkModal();
    else if (e.key === 'ArrowRight') showNextModalItem();
    else if (e.key === 'ArrowLeft') showPrevModalItem();
  });

  // =========================================================================
  // 3. INITIALIZATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    renderGallery();
  });

})();
