import createElement from '../../assets/lib/create-element.js';

function RibbonMenuTemplate(categories) {
  return `
    <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
        <nav class="ribbon__inner">
            ${categories.map((item) => `<a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>`).join("")}
        </nav>
        <button class="ribbon__arrow ribbon__arrow_right">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
    </div>`;
}

export default class RibbonMenu {
  #template = null;
  #elem= null;

  constructor(categories) {
    // eslint-disable-next-line new-cap
    this.#template = RibbonMenuTemplate(categories);
    this.#elem = this.render();
  }

  render() {
    const ribbonMenu = createElement(this.#template);
    const menuArrowRight = ribbonMenu.querySelector('.ribbon__arrow_right');
    const menuArrowLeft = ribbonMenu.querySelector('.ribbon__arrow_left');
    const ribbonInner = ribbonMenu.querySelector('.ribbon__inner');
    let scrollStep = 350;

    menuArrowRight.addEventListener('click', () => {
      ribbonInner.scrollBy(scrollStep, 0);
    });

    menuArrowLeft.addEventListener('click', () => {
      ribbonInner.scrollBy(+`-${scrollStep}`, 0);
    });

    menuArrowLeft.classList.remove('ribbon__arrow_visible');
    menuArrowRight.classList.add('ribbon__arrow_visible');

    ribbonInner.addEventListener('scroll', () => {
      let scrollWidth = ribbonInner.scrollWidth;
      let scrollLeft = ribbonInner.scrollLeft;
      let clientWidth = ribbonInner.clientWidth;

      let scrollRight = scrollWidth - scrollLeft - clientWidth;

      if (ribbonInner.scrollLeft === 0) {
        menuArrowLeft.classList.remove('ribbon__arrow_visible');
      } else {
        menuArrowLeft.classList.add('ribbon__arrow_visible');
      }

      if (scrollRight === 0) {
        menuArrowRight.classList.remove('ribbon__arrow_visible');
      } else {
        menuArrowRight.classList.add('ribbon__arrow_visible');
      }
    });

    const ribbonMenuItems = Array.from(ribbonMenu.querySelectorAll('.ribbon__item'));

    ribbonMenuItems.forEach((item)=> {
      item.addEventListener('click', (event)=> {
        ribbonMenuItems.forEach((item)=> {
          item.classList.remove('ribbon__item_active');
        });

        let target = event.target;

        event.preventDefault();

        target.classList.add('ribbon__item_active');

        this.ribbonMenuItemClick(target);
      });
    });

    return ribbonMenu;
  }

  ribbonMenuItemClick = (target) => {
    const ribbonMenuItemEvent = new CustomEvent("ribbon-select",
      { detail: target.dataset.id,
        bubbles: true});

    this.#elem.dispatchEvent(ribbonMenuItemEvent);
  }

  get elem() {
    return this.#elem;
  }
}
