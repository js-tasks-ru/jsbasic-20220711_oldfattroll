import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]
  cartItem = {};
  modal = null;

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (product) {
      const originalItem = this.cartItems.find((it) => it.product.id === product.id);

      if (originalItem) {
        this.cartItems.map((item) => {
          if (item.product.id === originalItem.product.id) {
            item.count += 1;
            this.cartItem = item;
          }
        });
      } else {
        this.cartItem = {
          product: product,
          count: 1
        };

        this.cartItems.push(this.cartItem);
      }
    } else {
      return;
    }

    this.onProductUpdate(this.cartItem);
  }

  updateProductCount(productId, amount) {
    this.cartItems.map((item => {
      if (item.product.id === productId) {
        item.count += amount;
        this.cartItem = item;
        if (item.count === 0) {
          this.cartItems = this.cartItems.filter((item) => item.product.id !== productId);
          let cartElems = Array.from(document.body.querySelectorAll('[data-product-id]'));
          cartElems.map((e)=> {
            if (e.getAttribute('data-product-id') === item.product.id) {
              e.remove();
            }
          });
        }
      }
    }));

    this.onProductUpdate(this.cartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;

    this.cartItems.map((item)=> {
      totalCount += item.count;
    });

    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;

    this.cartItems.map((item)=> {
      totalPrice += (item.product.price * item.count);
    });

    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`
    <form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle("Your order");
    let cart = createElement(`<div></div>`);

    this.cartItems.map((item) => cart.append(this.renderProduct(item.product, item.count)));
    cart.append(this.renderOrderForm());

    this.modal.setBody(cart);

    const buttonMinus = Array.from(cart.querySelectorAll('.cart-counter__button_minus'));
    const buttonPlus = Array.from(cart.querySelectorAll('.cart-counter__button_plus'));

    buttonMinus.map((button)=> {
      button.onclick = ({ target }) => {
        const productId = target.closest('div[data-product-id]').getAttribute('data-product-id');
        this.updateProductCount(productId, -1);
      };
    });

    buttonPlus.map((button)=> {
      button.onclick = ({ target }) => {
        const productId = target.closest('div[data-product-id]').getAttribute('data-product-id');
        this.updateProductCount(productId, 1);
      };
    });

    const form = cart.querySelector('.cart-form');
    form.addEventListener('submit', (event) => this.onSubmit(event));

    this.modal.open();
  }

  onProductUpdate(cartItem) {
    let isModalOpen = document.querySelector('.is-modal-open');

    if (isModalOpen) {
      let cartItemsIsEmpty = this.isEmpty();

      if (!cartItemsIsEmpty) {
        if (cartItem.count > 0) {
          let productId = cartItem.product.id;
          let productCount = document.body.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
          let productPrice = document.body.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
          let infoPrice = document.body.querySelector(`.cart-buttons__info-price`);

          productCount.innerHTML = cartItem.count;
          productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
          infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
        }
      } else {
        this.modal.close();
      }

    }

    this.cartIcon.update(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const buttonSubmit = document.body.querySelector('.cart-buttons__button');
    buttonSubmit.classList.add('is-loading');

    const form = document.querySelector('.cart-form');
    const formData = new FormData(form);

    const promise = fetch('https://httpbin.org/post', {
      body: formData,
      method: 'POST'
    });

    promise.then(() => {
      const modalTitle = document.querySelector('.modal__title');
      modalTitle.removeChild(modalTitle.childNodes[0]);

      this.modal.setTitle('Success!');
      this.cartItems = [];
      this.modal.setBody(createElement(`
        <div class="modal__body-inner">
            <p>
                Order successful! Your order is being cooked :) <br>
                We’ll notify you about delivery time shortly.<br>
                <img src="/assets/images/delivery.gif" alt="">
            </p>
        </div>`)
      );
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
