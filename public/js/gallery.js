/**
 * SPD Kandidaten - Mobile Swipe Gallery
 * Ermöglicht Touch-Swipe auf mobilen Geräten
 */

(function() {
    'use strict';

    // Nur auf mobilen Geräten initialisieren
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (!isMobile) {
        return;
    }

    const galleryTrack = document.querySelector('.gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.gallery-pagination .dot');

    if (!galleryTrack || slides.length === 0) {
        return;
    }

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const slideCount = slides.length;

    // Gallery-Position aktualisieren
    function updateGallery(animate = true) {
        if (animate) {
            galleryTrack.style.transition = 'transform 0.3s ease';
        } else {
            galleryTrack.style.transition = 'none';
        }
        galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Dots aktualisieren
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Zum nächsten Slide
    function nextSlide() {
        if (currentIndex < slideCount - 1) {
            currentIndex++;
            updateGallery();
        }
    }

    // Zum vorherigen Slide
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateGallery();
        }
    }

    // Zu bestimmtem Slide springen
    function goToSlide(index) {
        if (index >= 0 && index < slideCount) {
            currentIndex = index;
            updateGallery();
        }
    }

    // Touch Events
    function handleTouchStart(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
        galleryTrack.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!isDragging) return;

        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const baseTranslate = -currentIndex * 100;
        const percentDiff = (diff / galleryTrack.offsetWidth) * 100;

        // Widerstand an den Rändern
        let resistance = 1;
        if ((currentIndex === 0 && diff > 0) ||
            (currentIndex === slideCount - 1 && diff < 0)) {
            resistance = 0.3;
        }

        galleryTrack.style.transform = `translateX(${baseTranslate + (percentDiff * resistance)}%)`;
    }

    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const diff = currentX - startX;
        const threshold = galleryTrack.offsetWidth * 0.2; // 20% Schwellenwert

        if (diff > threshold) {
            prevSlide();
        } else if (diff < -threshold) {
            nextSlide();
        } else {
            updateGallery();
        }
    }

    // Event Listener hinzufügen
    galleryTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
    galleryTrack.addEventListener('touchmove', handleTouchMove, { passive: true });
    galleryTrack.addEventListener('touchend', handleTouchEnd);

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

    // Bei Resize prüfen ob noch mobile
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isNowMobile = window.matchMedia('(max-width: 767px)').matches;
            if (!isNowMobile) {
                // Reset auf Desktop-Ansicht
                galleryTrack.style.transform = 'none';
                galleryTrack.style.transition = 'none';
            } else {
                updateGallery(false);
            }
        }, 100);
    });

    // Initial position
    updateGallery(false);

})();
