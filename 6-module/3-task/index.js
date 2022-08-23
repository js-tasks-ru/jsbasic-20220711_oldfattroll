import createElement from '../../assets/lib/create-element.js';

function carouselTemplate(slides) {
  return `<div class="carousel">
     <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
     </div>
     <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
     </div>
     <div class="carousel__inner">
        ${slides.map((slide) =>
    `<div class="carousel__slide" data-id="${slide.id}">
        <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
    <div class="carousel__caption">
        <span class="carousel__price">€${slide.price.toFixed(2)}</span>
    <div class="carousel__title">${slide.name}</div>
    <button type="button" class="carousel__button">
        <img src="/assets/images/icons/plus-icon.svg" alt="icon">
    </button>
    </div>
    </div>`)}
    </div>
    </div>
  `;
}

export default class Carousel {
  #elem = '';
  #template = '';

  constructor(slides) {
    this.#template = carouselTemplate(slides);
    this.#elem = this.render();
  }

  render() {
    let carousel = createElement(this.#template);
    let buttonLeft = carousel.querySelector('.carousel__arrow.carousel__arrow_left');
    let buttonRight = carousel.querySelector('.carousel__arrow.carousel__arrow_right');
    let images = carousel.querySelectorAll('.carousel__slide');
    let image = carousel.querySelector('.carousel__inner');

    let sliderIndex = 0;
    let maxIndex = images.length - 1;
    buttonLeft.style.display = 'none';

    const addCarouselButton = Array.from(carousel.querySelectorAll('.carousel__button'));

    addCarouselButton.forEach((btn)=> {
      btn.addEventListener('click', (event)=> {
        let target = event.target.closest(".carousel__slide");
        const addCarouselButtonEvent = new CustomEvent("product-add",
          { detail: target.dataset.id,
            bubbles: true});

        carousel.dispatchEvent(addCarouselButtonEvent);
      });
    });

    buttonRight.onclick = () => {
      let imageWidth = image.offsetWidth;

      if (sliderIndex !== maxIndex) {
        sliderIndex++;
      }

      buttonLeft.style.display = '';

      if (sliderIndex === maxIndex) {
        buttonRight.style.display = 'none';
      }

      image.style.transform = `translateX(${+sliderIndex * -imageWidth}px)`;
    };

    buttonLeft.onclick = () => {
      let imageWidth = image.offsetWidth;

      if (sliderIndex > 0) {
        sliderIndex--;
      }

      if (sliderIndex === 0) {
        buttonLeft.style.display = 'none';
      }

      image.style.transform = `translateX(${+sliderIndex * -imageWidth}px)`;
    };

    return carousel;
  }

  get elem() {
    return this.#elem;
  }
}
