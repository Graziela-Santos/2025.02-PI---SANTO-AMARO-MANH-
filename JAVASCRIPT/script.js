// script.js - Funcionalidade do carrinho
let cartCount = 0;

function addToCart() {
    cartCount++;
    document.getElementById('cartCount').textContent = cartCount;
}

function swapImage(img, newSrc) {
    img.src = newSrc;
}
// Carrossel: navegação e autoplay
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('perfumeCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('.carousel__btn.prev');
    const next = carousel.querySelector('.carousel__btn.next');

    // scroll amount = width of carousel viewport
    const viewport = carousel.querySelector('.carousel__viewport');

    function scrollByAmount(dir = 1) {
        const card = track.querySelector('.product-card');
        if (!card) return;
        const cardStyle = window.getComputedStyle(card);
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const cardWidth = card.getBoundingClientRect().width + gap;
        viewport.scrollBy({ left: dir * cardWidth * 2, behavior: 'smooth' });
    }

    prev.addEventListener('click', () => scrollByAmount(-1));
    next.addEventListener('click', () => scrollByAmount(1));

    // autoplay
    let autoplayId = setInterval(() => scrollByAmount(1), 4000);
    // pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayId));
    carousel.addEventListener('mouseleave', () => {
        autoplayId = setInterval(() => scrollByAmount(1), 4000);
    });
    
    // Keyboard navigation (when carousel focused)
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByAmount(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollByAmount(1); }
    });

    // Pointer drag (mouse / touch) for the viewport
    let isDown = false;
    let startX;
    let scrollStart;

    viewport.addEventListener('pointerdown', (e) => {
        isDown = true;
        viewport.setPointerCapture(e.pointerId);
        startX = e.pageX;
        scrollStart = viewport.scrollLeft;
        // pause autoplay while dragging
        clearInterval(autoplayId);
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        const dx = e.pageX - startX;
        viewport.scrollLeft = scrollStart - dx;
    });

    function endDrag(e) {
        if (!isDown) return;
        isDown = false;
        // resume autoplay after short delay
        clearInterval(autoplayId);
        autoplayId = setInterval(() => scrollByAmount(1), 4000);
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('pointerleave', endDrag);
});

