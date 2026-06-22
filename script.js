document.addEventListener('DOMContentLoaded', function () {
  'use strict';


  //  СЛАЙДЕР 1: exercises

(function () {
    'use strict';

    const track = document.getElementById('exercisesTrack');
    if (!track) return;

    const prevBtn = document.querySelector('.exercises__nav--prev');
    const nextBtn = document.querySelector('.exercises__nav--next');
    const cards = track.querySelectorAll('.exercises__card');

    let currentIndex = 0;
    let cardWidth = 0;
    const gap = 16;
    let visibleCount = 4;

    let isAnimating = false;
    const SPAM_DELAY = 300; 

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 480) return 1;
      if (w <= 768) return 2;
      if (w <= 1024) return 3;
      return 4;
    }

    function updateDimensions() {
      visibleCount = getVisibleCount();
      const containerWidth = track.parentElement.offsetWidth;
      cardWidth = (containerWidth - (visibleCount - 1) * gap) / visibleCount;

      cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}px`;
      });

      clampIndex();
      render(false);
    }

    function clampIndex() {
      const maxIndex = Math.max(0, cards.length - visibleCount);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
    }

    function render(animated = true) {
      const offset = Math.round(currentIndex * (cardWidth + gap));
      track.style.transition = animated ? 'transform 0.3s ease' : 'none';
      track.style.transform = `translateX(-${offset}px)`;
    }

    function triggerLock() {
      isAnimating = true;
      setTimeout(() => {
        isAnimating = false;
      }, SPAM_DELAY);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (isAnimating) return;

        const maxIndex = Math.max(0, cards.length - visibleCount);
        if (currentIndex < maxIndex) {
          triggerLock();
          currentIndex++;
          render(true);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (isAnimating) return;

        if (currentIndex > 0) {
          triggerLock();
          currentIndex--;
          render(true);
        }
      });
    }

    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 100);
    });

    updateDimensions();
})();



  //  СЛАЙДЕР 2: interests

  
(function () {
  'use strict';

  const slidesContainer = document.querySelector('.interests__slides');
  if (!slidesContainer) return;

  const slides = [...slidesContainer.children];
  const prevBtn = document.querySelector('.interests__nav-btn--prev');
  const nextBtn = document.querySelector('.interests__nav-btn--next');

  const AUTO_DELAY = 4000;
  const SPAM_DELAY = 300; 
  let autoplay;
  let currentIndex = 0;
  let isAnimating = false; 
  function render() {
    const total = slides.length;

    slides.forEach((slide, index) => {
      let offset = (index - currentIndex + total) % total;
      
      if (offset > total / 2) offset -= total;

      const pos = Math.max(-4, Math.min(4, offset));

      slide.className = slide.className
        .split(' ')
        .filter(cls => !cls.startsWith('interests__slide--pos'))
        .join(' ');

      slide.classList.add(`interests__slide--pos${pos}`);
    });
  }

  function next() {
    if (isAnimating) return; 
    triggerLock();

    currentIndex = (currentIndex + 1) % slides.length;
    render();
  }

  function prev() {
    if (isAnimating) return; 
    triggerLock();

    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    render();
  }

  function triggerLock() {
    isAnimating = true;
    setTimeout(() => {
      isAnimating = false;
    }, SPAM_DELAY);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(next, AUTO_DELAY);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      startAutoplay();
    });
  }

  slidesContainer.addEventListener('mouseenter', stopAutoplay);
  slidesContainer.addEventListener('mouseleave', startAutoplay);

  render();
  startAutoplay();
})();

  




/* ================================== PROMO =================================== */




(function() {
    'use strict';

    const screensContainer = document.querySelector('.promo__screens');
    const slides = Array.from(document.querySelectorAll('.promo__screen'));
    const steps = document.querySelectorAll('.promo__step');
    
    if (!screensContainer || slides.length === 0) {
        console.warn('Элементы слайдера не найдены');
        return;
    }

    let currentIndex = 0;
    const totalSlides = slides.length;
    let startX = 0;
    let dragOffset = 0;
    let isDragging = false;

    function getGapValue() {
        const gapStyle = getComputedStyle(screensContainer).getPropertyValue('--gap') || '0px';
        return parseFloat(gapStyle) || 0;
    }

    function updateSlider(animated = true, dragShiftInPx = 0) {
        const gap = getGapValue();

        slides.forEach((slide, index) => {
            if (!animated) {
                slide.style.transition = 'none';
            } else {
                slide.style.transition = 'transform 0.3s ease-out';
            }

            let offset = index - currentIndex;
            

            const percentMove = offset * 100;

            const gapMoveInPx = offset * gap; 

            const totalPxMove = gapMoveInPx + dragShiftInPx;

            if (totalPxMove !== 0) {
                slide.style.transform = `translateX(calc(${percentMove}% + ${totalPxMove}px))`;
            } else {
                slide.style.transform = `translateX(${percentMove}%)`;
            }
        });

        steps.forEach((step, idx) => {
            if (idx === currentIndex) {
                step.classList.add('promo__step--active');
            } else {
                step.classList.remove('promo__step--active');
            }
        });
    }

    function changeSlide(targetIndex) {
        currentIndex = Math.max(0, Math.min(targetIndex, totalSlides - 1));
        updateSlider(true);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function dragStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        dragOffset = 0;
    }

    function dragMove(event) {
        if (!isDragging) return;
        const currentX = getPositionX(event);
        dragOffset = currentX - startX;
        
        if ((currentIndex === 0 && dragOffset > 0) || (currentIndex === totalSlides - 1 && dragOffset < 0)) {
            dragOffset *= 0.3;
        }

        updateSlider(false, dragOffset);
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;

        const threshold = screensContainer.offsetWidth * 0.15;

        if (dragOffset < -threshold && currentIndex < totalSlides - 1) {
            changeSlide(currentIndex + 1);
        } else if (dragOffset > threshold && currentIndex > 0) {
            changeSlide(currentIndex - 1);
        } else {
            changeSlide(currentIndex);
        }
    }

    steps.forEach((step, index) => {
        step.addEventListener('click', function() {
            changeSlide(index);
        });
    });

    screensContainer.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    screensContainer.addEventListener('touchstart', dragStart, { passive: true });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);

    screensContainer.addEventListener('dragstart', (e) => e.preventDefault());

    updateSlider(false);
})();






/* ========= slider 4 ============ */

(function() {
    'use strict';

    const slidesContainer = document.querySelector('.testimonials__slides');
    const prevBtn = document.querySelector('.testimonials__nav-btn--prev');
    const nextBtn = document.querySelector('.testimonials__nav-btn--next');

    if (!slidesContainer || !prevBtn || !nextBtn) return;

    let initialSlides = slidesContainer.querySelectorAll('.testimonials__slide');
    if (initialSlides.length > 0 && initialSlides.length < 6) {
        const originalContent = slidesContainer.innerHTML;
        slidesContainer.innerHTML = originalContent + originalContent;
    }

    let isMoving = false;
    const gap = 16; 

    const getSlides = () => slidesContainer.querySelectorAll('.testimonials__slide');

    function moveNext() {
        if (isMoving) return;
        isMoving = true;

        const currentSlides = getSlides();
        const step = currentSlides[0].offsetWidth + gap;

        currentSlides.forEach(slide => {
            slide.style.transition = 'transform 0.3s ease-in-out';
            slide.style.transform = `translateX(-${step}px)`;
        });

        function handleTransitionEnd(e) {
            if (e.target !== currentSlides[0]) return; 
            currentSlides[0].removeEventListener('transitionend', handleTransitionEnd);

            const updatedSlides = getSlides();
            updatedSlides.forEach(slide => {
                slide.style.transition = 'none';
            });

            slidesContainer.appendChild(updatedSlides[0]);

            const finalSlides = getSlides();
            finalSlides.forEach(slide => {
                slide.style.transform = 'translateX(0)';
            });

            slidesContainer.offsetHeight;

            isMoving = false;
        }

        currentSlides[0].addEventListener('transitionend', handleTransitionEnd);
    }

    function movePrev() {
        if (isMoving) return;
        isMoving = true;

        const currentSlides = getSlides();
        const lastSlide = currentSlides[currentSlides.length - 1];
        const step = lastSlide.offsetWidth + gap;

        slidesContainer.insertBefore(lastSlide, slidesContainer.firstElementChild);

        const updatedSlides = getSlides();
        updatedSlides.forEach(slide => {
            slide.style.transition = 'none';
            slide.style.transform = `translateX(-${step}px)`;
        });

        slidesContainer.offsetHeight;

        updatedSlides.forEach(slide => {
            slide.style.transition = 'transform 0.3s ease-in-out';
            slide.style.transform = 'translateX(0)';
        });

        function handleTransitionEnd(e) {
            if (e.target !== updatedSlides[0]) return;
            updatedSlides[0].removeEventListener('transitionend', handleTransitionEnd);
            isMoving = false;
        }

        updatedSlides[0].addEventListener('transitionend', handleTransitionEnd);
    }

    nextBtn.addEventListener('click', moveNext);
    prevBtn.addEventListener('click', movePrev);

})();
















});
