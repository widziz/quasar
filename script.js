document.addEventListener('DOMContentLoaded', function() {
  // 1. Инициализация анимации логотипа
  const logoAnimation = lottie.loadAnimation({
    container: document.getElementById('logo-animation'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'logo.json'
  });

  // Остановка на первом кадре при загрузке логотипа
  logoAnimation.addEventListener('DOMLoaded', function() {
    logoAnimation.goToAndStop(0, true);
  });

  // Анимация при наведении на логотип
  const logoContainer = document.getElementById('logo-container');
  logoContainer.addEventListener('mouseenter', function() {
    logoAnimation.play();
  });

  // Возврат к первому кадру после анимации
  logoAnimation.addEventListener('complete', function() {
    setTimeout(() => logoAnimation.goToAndStop(0, true), 1000);
  });

  // 2. Инициализация алмазика (остановка на случайном кадре)
  const diamondContainer = document.getElementById('diamond-animation');
  if (diamondContainer) {
    const diamondAnim = lottie.loadAnimation({
      container: diamondContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'diamond.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    });

    diamondAnim.addEventListener('DOMLoaded', function() {
      const randomFrame = Math.floor(Math.random() * diamondAnim.totalFrames);
      diamondAnim.goToAndStop(randomFrame, true);
      
      // Сохраняем позицию при ресайзе
      window.addEventListener('resize', () => {
        diamondAnim.goToAndStop(randomFrame, true);
      });
    });
  }

  // 3. Мобильное меню
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Закрытие меню при клике вне его
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
      navMenu.classList.remove('active');
      menuBtn.classList.remove('active');
    }
  });

  // 4. Инициализация Swiper для отзывов
  const reviewsSwiper = new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      480: {
        slidesPerView: 1.2,
      }
    }
  });

  // 5. Кастомный select для способов оплаты
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(select => {
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');
    const options = items.querySelectorAll('div');
    
    selected.addEventListener('click', function(e) {
      e.stopPropagation();
      items.classList.toggle('open');
      
      // Закрываем другие селекты
      document.querySelectorAll('.select-items').forEach(item => {
        if (item !== items) item.classList.remove('open');
      });
    });
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        selected.innerHTML = `
          <div class="payment-info">
            ${this.querySelector('.payment-option').innerHTML}
            <span class="payment-percent">
              ${this.querySelector('.payment-percent').textContent}
            </span>
          </div>`;
        items.classList.remove('open');
      });
    });
  });
  
  // Закрытие селекта при клике вне его
  document.addEventListener('click', function() {
    document.querySelectorAll('.select-items').forEach(item => {
      item.classList.remove('open');
    });
  });
  
  // 6. Калькулятор обмена валют
  const rubInput = document.getElementById('rub-input');
  const tonInput = document.getElementById('ton-input');
  const rate = 310.99;
  const fee = 0.01;
  const appFee = 0.12;
  
  rubInput.addEventListener('input', function() {
    if (this.value) {
      const rub = parseFloat(this.value);
      const ton = (rub / rate) * (1 - appFee) - fee;
      tonInput.value = ton > 0 ? ton.toFixed(4) : '0';
    } else {
      tonInput.value = '';
    }
  });
  
  tonInput.addEventListener('input', function() {
    if (this.value) {
      const ton = parseFloat(this.value);
      const rub = (ton + fee) / (1 - appFee) * rate;
      rubInput.value = rub > 0 ? Math.round(rub) : '0';
    } else {
      rubInput.value = '';
    }
  });

  // 7. Адаптация алмазика при ресайзе
  function handleDiamondResize() {
    const diamond = document.getElementById('diamond-animation');
    if (!diamond) return;
    
    if (window.innerWidth <= 1024) {
      diamond.style.width = '180px';
      diamond.style.height = '180px';
      diamond.style.right = '-50px';
    } else {
      diamond.style.width = '240px';
      diamond.style.height = '240px';
      diamond.style.right = '-100px';
    }
  }

  // Инициализация и отслеживание ресайза
  window.addEventListener('resize', handleDiamondResize);
  handleDiamondResize();
});

// Обмен валют
document.getElementById('rub-input').addEventListener('input', function(e) {
  const rubValue = parseFloat(e.target.value) || 0;
  const tonValue = rubValue / 350;
  document.getElementById('ton-input').value = tonValue.toFixed(6);
});

document.getElementById('ton-input').addEventListener('input', function(e) {
  const tonValue = parseFloat(e.target.value) || 0;
  const rubValue = tonValue * 350;
  document.getElementById('rub-input').value = rubValue.toFixed(2);
});

// Мобильное меню
const menuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
});