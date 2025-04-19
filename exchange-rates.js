class ExchangeRates {
  constructor() {
    this.rates = null;
    this.callbacks = [];
    this.commission = 0.08; // 8% комиссия
    this.fixedFee = 0.01; // Фиксированная комиссия 0.01 TON
  }

  async fetchRates() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=rub');
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const marketRate = data['the-open-network'].rub;

      // Валидация ответа
      if (!marketRate || marketRate < 100 || marketRate > 1000) {
        throw new Error(`Invalid rate: ${marketRate}`);
      }

      const baseRate = parseFloat(marketRate.toFixed(2));
      
      // Возвращаем чистый курс без комиссий (комиссии будут учитываться при расчетах)
      this.rates = {
        TON_RUB: baseRate,
        baseRate: baseRate,
        updatedAt: new Date()
      };

      this.notifySubscribers();
      return this.rates;

    } catch (error) {
      console.error('Failed to fetch rates:', error);
      // Возвращаем последние известные курсы или null
      return this.rates || null;
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);
    if (this.rates) callback(this.rates);
    return () => this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  notifySubscribers() {
    this.callbacks.forEach(cb => cb(this.rates));
  }

  startAutoRefresh(interval = 60000) {
    this.fetchRates().catch(console.error);
    this.intervalId = setInterval(() => {
      this.fetchRates().catch(console.error);
    }, interval);
  }
}

// Инициализация
const ratesManager = new ExchangeRates();
ratesManager.startAutoRefresh();

// Экспорт
window.ExchangeRates = {
  getRate: () => ratesManager.rates?.TON_RUB || Promise.reject('Rates not loaded'),
  getBaseRate: () => ratesManager.rates?.baseRate || Promise.reject('Rates not loaded'),
  subscribe: (callback) => ratesManager.subscribe(callback),
  getCommission: () => ratesManager.commission,
  getFixedFee: () => ratesManager.fixedFee
};
