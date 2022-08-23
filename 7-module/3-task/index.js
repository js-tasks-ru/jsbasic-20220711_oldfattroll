import createElement from '../../assets/lib/create-element.js';

function StepSliderTemplate(steps, value) {
  return `
    <div class="slider">
        <div class="slider__thumb">
            <span class="slider__value">${value}</span>
        </div>
        <div class="slider__progress"></div>
        <div class="slider__steps">
            ${[...Array(steps)].map(() => '<span></span>').join("")}
        </div>
    </div>`;
}

export default class StepSlider {
  #steps = null;
  #template = null;
  #elem = null;

  constructor({ steps, value = 0 }) {
    // eslint-disable-next-line new-cap
    this.#template = StepSliderTemplate(steps, value);
    this.#steps = steps;
    this.#elem = this.#render();
    this.#calculateProgress(value);
  }

  #calculateProgress = (value = 0) => {
    const sliderSteps = this.#elem.querySelector('.slider__steps');
    const sliderValue = this.#elem.querySelector('.slider__value');

    let segments = this.#steps - 1;
    let valuePercents = value / segments * 100;
    let activeStep = sliderSteps.childNodes[value + 1];

    sliderValue.innerHTML = value;

    activeStep.classList.add('slider__step-active');

    let thumb = this.#elem.querySelector('.slider__thumb');
    let progress = this.#elem.querySelector('.slider__progress');

    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;
  }

  #changeActiveSlide = (event) => {
    let left = event.clientX - this.#elem.getBoundingClientRect().left;
    let leftRelative = left / this.#elem.offsetWidth;

    let segments = this.#steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);

    this.#calculateProgress(value);

    const sliderChangeEvent = new CustomEvent("slider-change",
      { detail: value,
        bubbles: true});

    this.#elem.dispatchEvent(sliderChangeEvent);
  }

  #render() {
    const slider = createElement(this.#template);

    slider.addEventListener('click', this.#onSliderClickEvent);
    return slider;
  }

  #onSliderClickEvent = (event) => {
    let activeStep = this.#elem.querySelector('.slider__step-active');
    activeStep.classList.remove('slider__step-active');

    this.#changeActiveSlide(event);
  }

  get elem() {
    return this.#elem;
  }
}
