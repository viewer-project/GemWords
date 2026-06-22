/* document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var track = document.getElementById('exercisesTrack');
  var prevBtn = document.querySelector('.exercises__nav--prev');
  var nextBtn = document.querySelector('.exercises__nav--next');
  var cards = track.querySelectorAll('.exercises__card');

  var currentIndex = 0;
  var cardWidth = 0;
  var gap = 16;
  var visibleCount = 4;

  function getVisibleCount() {
    var w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
  }

  function updateDimensions() {
    visibleCount = getVisibleCount();
    var containerWidth = track.parentElement.offsetWidth;
    cardWidth = (containerWidth - (visibleCount - 1) * gap) / visibleCount;

    for (var i = 0; i < cards.length; i++) {
      cards[i].style.flex = '0 0 ' + cardWidth + 'px';
    }

    clampIndex();
    render(); // ← ВАЖНО: вызываем render для обновления позиции
  }

  function clampIndex() {
    var maxIndex = Math.max(0, cards.length - visibleCount);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
  }

  function render() {
    // Используем Math.round для избежания дробных значений
    var offset = Math.round(currentIndex * (cardWidth + gap));
    track.style.transform = 'translateX(-' + offset + 'px)';
  }

  nextBtn.addEventListener('click', function () {
    var maxIndex = Math.max(0, cards.length - visibleCount);
    if (currentIndex < maxIndex) {
      currentIndex++;
      render();
    }
  });

  prevBtn.addEventListener('click', function () {
    if (currentIndex > 0) {
      currentIndex--;
      render();
    }
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateDimensions, 100);
  });

  // Инициализация
  updateDimensions();







    const slider = document.querySelector('.interests__slider');
  const slidesContainer = slider.querySelector('.interests__slides');
  const slides = Array.from(slidesContainer.querySelectorAll('.interests__slide'));
  const prevBtn = slider.querySelector('.interests__nav-btn--prev');
  const nextBtn = slider.querySelector('.interests__nav-btn--next');

  const TOTAL = slides.length;
  let currentIndex = 2; // Начинаем с центра (индекс 2 из 5)
  let autoplayInterval = null;
  let isTransitioning = false;

  // ============================================
  //  КОНФИГУРАЦИЯ
  // ============================================
  const CONFIG = {
    autoplayDelay: 3000,
    gap: 20,
    transition: '0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    breakpoints: {
      // Количество видимых слайдов в зависимости от ширины экрана
      visibleCount: {
        480: 1,   // <= 480px - 1 слайд
        768: 3,   // <= 768px - 3 слайда
        1024: 5,  // <= 1024px - 5 слайдов
        default: 5
      }
    }
  };

  // ============================================
  //  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ============================================
  
  // Получаем количество видимых слайдов
  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 3;
    if (w <= 1024) return 5;
    return 5;
  }

  // Получаем ширину слайда
  function getSlideWidth(visibleCount) {
    const containerWidth = slider.offsetWidth;
    return (containerWidth - (visibleCount - 1) * CONFIG.gap) / visibleCount;
  }

  // ============================================
  //  ОСНОВНАЯ ЛОГИКА
  // ============================================
  
  function render() {
    const visibleCount = getVisibleCount();
    const slideWidth = getSlideWidth(visibleCount);
    
    // 1. Задаём ширину каждому слайду
    slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });

    // 2. Вычисляем сдвиг для центрирования активного слайда
    const containerWidth = slider.offsetWidth;
    const centerOffset = containerWidth / 2 - slideWidth / 2;
    const offset = currentIndex * (slideWidth + CONFIG.gap) - centerOffset;
    
    // 3. Сдвигаем контейнер
    slidesContainer.style.transform = `translateX(-${Math.max(0, offset)}px)`;
    slidesContainer.style.transition = `transform ${CONFIG.transition}`;

    // 4. Применяем масштабирование
    slides.forEach((slide, index) => {
      const distance = Math.abs(index - currentIndex);
      let scale, opacity, zIndex;

      if (distance === 0) {
        scale = 1;
        opacity = 1;
        zIndex = 10;
      } else if (distance === 1) {
        scale = 0.85;
        opacity = 0.8;
        zIndex = 5;
      } else if (distance === 2) {
        scale = 0.7;
        opacity = 0.5;
        zIndex = 1;
      } 

      slide.style.transform = `scale(${scale})`;
      slide.style.opacity = opacity;
      slide.style.zIndex = zIndex;
      slide.style.transition = `all ${CONFIG.transition}`;
    });

    // Снимаем блокировку после анимации
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  // ============================================
  //  НАВИГАЦИЯ
  // ============================================
  
  function goTo(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Зацикливание
    if (index < 0) index = TOTAL - 1;
    if (index >= TOTAL) index = 0;

    currentIndex = index;
    render();
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  // ============================================
  //  АВТОПРОКРУТКА
  // ============================================
  
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(next, CONFIG.autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // ============================================
  //  ОБРАБОТЧИКИ СОБЫТИЙ
  // ============================================
  
  // Кнопки
  prevBtn.addEventListener('click', () => {
    stopAutoplay();
    prev();
    startAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    stopAutoplay();
    next();
    startAutoplay();
  });

  // Пауза при наведении на слайдер
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Touch-события для мобильных
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    startAutoplay();
  }, { passive: true });

  // Адаптация при ресайзе
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      render();
    }, 100);
  });

  // ============================================
  //  ЗАПУСК
  // ============================================
  
  render();
  startAutoplay();




});
 */


document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ============================================
  //  СЛАЙДЕР 1: exercises
  // ============================================
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
    
    // Переменные для защиты от спама
    let isAnimating = false;
    const SPAM_DELAY = 300; // Блокировка на 300мс

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
      render(false); // При ресаизе двигаем без анимации, чтобы не ловить баги
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

    // Вспомогательная функция триггера лока
    function triggerLock() {
      isAnimating = true;
      setTimeout(() => {
        isAnimating = false;
      }, SPAM_DELAY);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (isAnimating) return; // Защита от спама

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
        if (isAnimating) return; // Защита от спама

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



  // ============================================
  //  СЛАЙДЕР 2: interests
  // ============================================

  /* (function () {
    const slidesContainer = document.querySelector('.interests__slides');
    if (!slidesContainer) return;

    let slides = [...slidesContainer.children];
    const prevBtn = document.querySelector('.interests__nav-btn--prev');
    const nextBtn = document.querySelector('.interests__nav-btn--next');

    const AUTO_DELAY = 4000;
    let autoplay;

    // Количество видимых слайдов
    const VISIBLE_COUNT = 5;
    // Позиции для видимых слайдов
    const POSITIONS = [
      'interests__slide--outer',
      'interests__slide--middle',
      'interests__slide--center',
      'interests__slide--middle',
      'interests__slide--outer'
    ];

    function render() {
      // Сначала скрываем все слайды и удаляем классы позиций
      slides.forEach(slide => {
        slide.style.display = 'none';
        slide.className = slide.className
          .split(' ')
          .filter(cls => !cls.startsWith('interests__slide--'))
          .join(' ');
      });

      // Определяем, какие 5 слайдов показывать
      // Центральным должен быть слайд с индексом 2 (третий по счету)
      // Поэтому показываем слайды с индексами 0, 1, 2, 3, 4
      const visibleSlides = slides.slice(0, VISIBLE_COUNT);

      // Показываем и применяем классы позиций к видимым слайдам
      visibleSlides.forEach((slide, index) => {
        slide.style.display = '';
        slide.classList.add(POSITIONS[index]);
        slidesContainer.appendChild(slide);
      });

      // Остальные слайды (невидимые) просто добавляем в конец контейнера
      slides.slice(VISIBLE_COUNT).forEach(slide => {
        slidesContainer.appendChild(slide);
      });
    }

    function next() {
      // Перемещаем первый элемент в конец массива
      slides.push(slides.shift());
      render();
    }

    function prev() {
      // Перемещаем последний элемент в начало массива
      slides.unshift(slides.pop());
      render();
    }

    function startAutoplay() {
      stopAutoplay();
      autoplay = setInterval(next, AUTO_DELAY);
    }

    function stopAutoplay() {
      clearInterval(autoplay);
    }

    // Обработчики кнопок
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

    // Пауза при наведении
    slidesContainer.addEventListener('mouseenter', stopAutoplay);
    slidesContainer.addEventListener('mouseleave', startAutoplay);

    // Инициализация
    render();
    startAutoplay();
  })(); */

  
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

    // Получаем значение gap из CSS (переводим "20px" в число 20)
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
            
            // Базовый сдвиг в процентах
            const percentMove = offset * 100;
            // Дополнительный сдвиг в пикселях за счет накопившихся gap
            const gapMoveInPx = offset * gap; 
            
            // Итоговый сдвиг с учетом свайпа мышкой (dragShiftInPx)
            const totalPxMove = gapMoveInPx + dragShiftInPx;

            if (totalPxMove !== 0) {
                slide.style.transform = `translateX(calc(${percentMove}% + ${totalPxMove}px))`;
            } else {
                slide.style.transform = `translateX(${percentMove}%)`;
            }
        });

        // Синхронизация табов/шагов
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
        
        // Резиновый эффект на краях
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





















});