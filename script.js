document.addEventListener('DOMContentLoaded', function() {
  // Основные элементы интерфейса
  const rubInput = document.getElementById('rub-input');
  const tonInput = document.getElementById('ton-input');
  const rateInfoElement = document.getElementById('rate-info');
  const rateCalculationElement = document.getElementById('rate-calculation');
  const exchangeButton = document.querySelector('.blob-btn');
  const mobileMenuButton = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Состояние приложения
  let currentRate = null;
  let baseRate = null;
  let isLoading = true;

  // Инициализация анимации логотипа
  const initLogoAnimation = () => {
    const logoAnimation = lottie.loadAnimation({
      container: document.getElementById('logo-animation'),
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'animations/logo.json'
    });

    const logoContainer = document.getElementById('logo-container');
    if (logoContainer) {
      logoContainer.addEventListener('mouseenter', () => {
        logoAnimation.play();
      });

      logoAnimation.addEventListener('complete', () => {
        setTimeout(() => logoAnimation.goToAndStop(0, true), 1000);
      });
    }
  };

  // Инициализация анимации алмаза
  const initDiamondAnimation = () => {
    const diamondContainer = document.getElementById('diamond-animation');
    if (diamondContainer) {
      const diamondAnim = lottie.loadAnimation({
        container: diamondContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'animations/diamond.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      });

      diamondAnim.addEventListener('DOMLoaded', () => {
        const randomFrame = Math.floor(Math.random() * diamondAnim.totalFrames);
        diamondAnim.goToAndStop(randomFrame, true);
        window.addEventListener('resize', () => diamondAnim.goToAndStop(randomFrame, true));
      });
    }
  };

  // Инициализация слайдера отзывов
  const initReviewsSwiper = () => {
    if (document.querySelector('.reviews-swiper')) {
      new Swiper('.reviews-swiper', {
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
    }
  };

  // Инициализация кастомного select
  const initCustomSelect = () => {
    document.querySelectorAll('.custom-select').forEach(select => {
      const selected = select.querySelector('.select-selected');
      const items = select.querySelector('.select-items');
      
      selected.addEventListener('click', function(e) {
        e.stopPropagation();
        items.classList.toggle('open');
        document.querySelectorAll('.select-items').forEach(item => {
          if (item !== items) item.classList.remove('open');
        });
      });
      
      items.querySelectorAll('div').forEach(option => {
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

    document.addEventListener('click', () => {
      document.querySelectorAll('.select-items').forEach(item => {
        item.classList.remove('open');
      });
    });
  };

  // Управление мобильным меню
  const initMobileMenu = () => {
    mobileMenuButton.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        
        if (window.innerWidth <= 900) {
          navMenu.classList.remove('active');
          mobileMenuButton.classList.remove('active');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
        navMenu.classList.remove('active');
        mobileMenuButton.classList.remove('active');
      }
    });
  };

  // Функции для работы с курсом валют
  const updateRateDisplay = () => {
    if (!currentRate || !baseRate) return;
    
    const changePercent = ((currentRate - baseRate) / baseRate * 100).toFixed(2);
    const changeSign = changePercent >= 0 ? '+' : '';
    
    if (rateInfoElement) {
      rateInfoElement.textContent = `1 TON ≈ ${currentRate.toFixed(2)} RUB (${changeSign}${changePercent}%)`;
    }
  };

  const updateRateCalculation = () => {
    if (!currentRate || !baseRate) return;
    
    if (rateCalculationElement) {
      rateCalculationElement.innerHTML = `
        TON = ${baseRate.toFixed(2)} RUB<br>
        После комиссий: ${currentRate.toFixed(2)} RUB<br><br>
        <strong>Самая низкая комиссия на рынке!</strong>
      `;
    }
  };

  const calculateTonToRub = (ton) => {
    const amountAfterFee = ton * 0.92 - 0.01; // Учет комиссий 8% + 0.01 TON
    return parseFloat((amountAfterFee * currentRate).toFixed(2));
  };

  const calculateRubToTon = (rub) => {
    const tonBeforeFee = rub / currentRate;
    return parseFloat(((tonBeforeFee + 0.01) / 0.92).toFixed(6));
  };

  // Инициализация калькулятора
  const initCalculator = () => {
    rubInput.addEventListener('input', function() {
      if (this.value) {
        const rub = parseFloat(this.value);
        const ton = calculateRubToTon(rub);
        tonInput.value = ton > 0 ? ton : '0';
      } else {
        tonInput.value = '';
      }
    });

    tonInput.addEventListener('input', function() {
      if (this.value) {
        const ton = parseFloat(this.value);
        const rub = calculateTonToRub(ton);
        rubInput.value = rub > 0 ? rub : '0';
      } else {
        rubInput.value = '';
      }
    });
  };

  // Обработчик кнопки обмена
  const initExchangeButton = () => {
    exchangeButton.addEventListener('click', function() {
      if (!rubInput.value && !tonInput.value) {
        alert('Введите сумму для обмена');
        return;
      }
      
      // Здесь будет логика обработки обмена
      alert('Обмен выполнен успешно!');
    });
  };

  // Подписка на изменения курса
  const subscribeToRateUpdates = () => {
    window.ExchangeRates.subscribe(({ TON_RUB, baseRate: newBaseRate }) => {
      currentRate = TON_RUB;
      baseRate = newBaseRate;
      isLoading = false;
      
      updateRateDisplay();
      updateRateCalculation();
      
      // Разблокируем поля ввода после получения первого курса
      rubInput.disabled = false;
      tonInput.disabled = false;
    });
  };

  // Адаптация под разные размеры экрана
  const handleResponsiveLayout = () => {
    const diamond = document.getElementById('diamond-animation');
    if (!diamond) return;
    
    diamond.style.width = window.innerWidth <= 1024 ? '180px' : '240px';
    diamond.style.height = window.innerWidth <= 1024 ? '180px' : '240px';
    diamond.style.right = window.innerWidth <= 1024 ? '-50px' : '-100px';
  };

  // Инициализация всего приложения
  const initApp = () => {
    // Блокируем поля ввода до получения курса
    rubInput.disabled = true;
    tonInput.disabled = true;
    
    // Показываем сообщение о загрузке
    rateInfoElement.textContent = 'Загрузка курса...';
    rateCalculationElement.textContent = 'Получаем актуальный курс...';
    
    // Инициализация всех компонентов
    initLogoAnimation();
    initDiamondAnimation();
    initReviewsSwiper();
    initCustomSelect();
    initMobileMenu();
    initCalculator();
    initExchangeButton();
    subscribeToRateUpdates();
    handleResponsiveLayout();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', handleResponsiveLayout);
  };

  // Запускаем приложение
  initApp();
});
