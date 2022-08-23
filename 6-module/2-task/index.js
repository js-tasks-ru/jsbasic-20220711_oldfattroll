export default class ProductCard {

  #elem = null;
  #product = null;

  #html() {
    return `
    <div class="card">
      <div class="card__top">
        <img src="/assets/images/products/${this.#product.image}" class="card__image" alt="product">
        <span class="card__price">€${this.#product.price.toFixed(2)}</span>
      </div>
      <div class="card__body">
        <div class="card__title">${this.#product.name}</div>
        <button type="button" class="card__button">
          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>`;
  }

  constructor(product) {
    this.#product = product;
    this.#elem = this.render();

  }

  render() {
    const div = document.createElement('div');
    div.innerHTML = this.#html();
    let productCard = div.firstElementChild;

    const addButton = productCard.querySelector('.card__button');

    addButton.onclick = () => {
      const productCardEvent = new CustomEvent("product-add",
        { detail: this.#product.id,
          bubbles: true});

      productCard.dispatchEvent(productCardEvent);
    };
    return productCard;
  }

  get elem() {
    return this.#elem;
  }
}
