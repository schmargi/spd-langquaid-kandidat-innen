/**
 * SPD Kandidaten - Mobile Gallery mit Pfeil-Navigation
 */

(function() {
    'use strict';

    const galleryContainer = document.querySelector('.gallery-container');
    const galleryTrack = document.querySelector('.gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.gallery-pagination .dot');

    if (!galleryTrack || slides.length === 0) {
        return;
    }

    // Nur auf Mobile initialisieren
    function isMobileView() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    if (!isMobileView()) {
        return;
    }

    let currentIndex = 0;
    const slideCount = slides.length;

    // Pfeil-Buttons erstellen
    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav gallery-nav-prev';
    prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>';
    prevBtn.setAttribute('aria-label', 'Vorheriges Bild');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav gallery-nav-next';
    nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>';
    nextBtn.setAttribute('aria-label', 'Nächstes Bild');

    galleryContainer.style.position = 'relative';
    galleryContainer.appendChild(prevBtn);
    galleryContainer.appendChild(nextBtn);

    // Gallery-Position aktualisieren
    function updateGallery() {
        galleryTrack.style.transition = 'transform 0.3s ease';
        galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Dots aktualisieren
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Buttons ein-/ausblenden
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

        nextBtn.style.opacity = currentIndex === slideCount - 1 ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex === slideCount - 1 ? 'none' : 'auto';
    }

    // Navigation
    function nextSlide() {
        if (currentIndex < slideCount - 1) {
            currentIndex++;
            updateGallery();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateGallery();
        }
    }

    function goToSlide(index) {
        if (index >= 0 && index < slideCount) {
            currentIndex = index;
            updateGallery();
        }
    }

    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Dots Click Events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Initial
    updateGallery();

})();
