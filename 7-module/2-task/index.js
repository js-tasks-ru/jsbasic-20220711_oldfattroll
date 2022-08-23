import createElement from '../../assets/lib/create-element.js';

function ModalTemplate() {
  return `
    <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
            <div class="modal__header">
                <button type="button" class="modal__close">
                    <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
                </button>
            <h3 class="modal__title"></h3>
        </div>
        <div class="modal__body"></div>
        </div>
    </div>`;
}

export default class Modal {
  #template = null;
  #container = null;

  constructor() {
    // eslint-disable-next-line new-cap
    this.#template = ModalTemplate();
    this.#container = this.render();
  }

  render() {
    const modal = createElement(this.#template);

    const removeModalButton = modal.querySelector('.modal__close');

    removeModalButton.addEventListener('click', ()=> {
      this.close();
    }, { once: true });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.close();
      }
    }, { once: true });

    return modal;
  }

  setTitle(title) {
    let modalTitle = this.#container.querySelector('.modal__title');
    modalTitle.append(title);
    return modalTitle;

  }

  setBody(body) {
    let modalBody = this.#container.querySelector('.modal__body');
    modalBody.append(body);
    return modalBody;
  }

  open() {
    const body = document.querySelector('body');
    body.classList.add('is-modal-open');
    document.body.append(this.#container);
  }

  close() {
    const body = document.querySelector('body');
    body.classList.remove('is-modal-open');
    this.#container.remove();
  }
}
