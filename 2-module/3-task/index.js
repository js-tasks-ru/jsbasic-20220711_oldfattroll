let calculator = {
  read(a, b) {
    this.number_a = a;
    this.number_b = b;
  },
  sum() { return this.number_a + this.number_b },
  mul() { return this.number_a * this.number_b },
};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
