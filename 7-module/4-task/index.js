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
  #value = null;

  constructor({ steps, value = 0 }) {
    // eslint-disable-next-line new-cap
    this.#template = StepSliderTemplate(steps, value);
    this.#steps = steps;
    this.#value = value;
    this.#elem = this.render();
  }

  render() {
    const slider = createElement(this.#template);

    const sliderSteps = slider.querySelector('.slider__steps');
    const sliderValue = slider.querySelector('.slider__value');

    let segments = this.#steps - 1;
    let valuePercents = this.#value / segments * 100;
    let activeStep = sliderSteps.childNodes[this.#value + 1];

    sliderValue.innerHTML = this.#value;

    activeStep.classList.add('slider__step-active');

    let thumb = slider.querySelector('.slider__thumb');
    let progress = slider.querySelector('.slider__progress');

    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;

    thumb.ondragstart = () => false;

    thumb.addEventListener('pointerdown', () => {
      slider.classList.add('slider_dragging');

      document.addEventListener('pointermove', this.onPointerMove);
      document.addEventListener('pointerup', (event) => {
        let { value } = this.pointerMoveValue(event);
        this.onPointerUp(value);
      }, { once: true });

    });

    slider.addEventListener('click', (event)=> {
      this.onSlideClick(event, sliderSteps);
    });
    return slider;
  }

  pointerMoveValue = (event) => {
    const slider = this.#elem;

    let value;
    let left = event.clientX - slider.getBoundingClientRect().left;
    let leftRelative = left / slider.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    }

    if (leftRelative > 1) {
      leftRelative = 1;
    }

    let segments = this.#steps - 1;
    let approximateValue = leftRelative * segments;

    value = Math.round(approximateValue);

    return { value, leftRelativePercents: leftRelative * 100, leftPercents: value / segments * 100 };
  }

  changeProgress = (percent, value) => {
    const sliderValue = this.#elem.querySelector('.slider__value');

    sliderValue.innerHTML = value;

    let thumb = this.#elem.querySelector('.slider__thumb');
    let progress = this.#elem.querySelector('.slider__progress');

    thumb.style.left = `${percent}%`;
    progress.style.width = `${percent}%`;
  }

  changeActiveStep = (value) => {
    const sliderSteps = this.#elem.querySelector('.slider__steps');
    const activeStep = this.#elem.querySelector('.slider__step-active');

    activeStep.classList.remove('slider__step-active');
    sliderSteps.childNodes[value + 1].classList.add('slider__step-active');
  }

  onPointerMove = (event) => {
    let { value, leftRelativePercents } = this.pointerMoveValue(event);

    this.changeProgress(leftRelativePercents, value);
    this.changeActiveStep(value);
  }

  onPointerUp = (value) => {
    this.onSliderClickEvent(value);
    this.#elem.classList.remove('slider_dragging');
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  onSliderClickEvent = (value) => {
    const sliderChangeEvent = new CustomEvent("slider-change",
      { detail: value,
        bubbles: true });

    this.#elem.dispatchEvent(sliderChangeEvent);
  }

  onSlideClick = (event) => {
    let { value, leftPercents } = this.pointerMoveValue(event);

    this.changeProgress(leftPercents, value);
    this.changeActiveStep(value);
    this.onSliderClickEvent(value);
  }

  get elem() {
    return this.#elem;
  }
}
