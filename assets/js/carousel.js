class Carousel {
  //containerID = '', slideID = '.slide', interval = 2000
  constructor(sett) {
    let settings = this._initConfig(sett)

    this.container = document.querySelector(settings.containerID);
    this.slides = this.container.querySelectorAll(settings.slideID);
    this.interval = settings.interval;

  }
  _initConfig(obj) {
    /*
    //традиционный
    */
    // let settings = {//дефолтное состояние, если ниже undefined
    //   containerID: '#carousel',
    //   interval: 5000,
    //   slideID: '.slide'

    // };
    // if (obj !== undefined) {// если undefined -> дальше не пойдем
    //   settings.containerID = obj.containerID || '#carousel';
    //   settings.interval = obj.interval || 5000;
    //   settings.slideID = obj.slideID || '.slide';
    // }
    return {...{ containerID: '#carousel', interval: 5000, slideID: '.slide' }, ...obj};
  }
  //методы
  _initProps() {
    this.slidesCount = this.slides.length;
    this.currentSlide = 0;
    this.timerID = null;
    this.isPlaying = true;

    //константы
    this.CLASS_TRIGGER = 'active';
    this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
    this.SPACE = ' ';
    this.LEFT_ARROW = 'ArrowLeft';
    this.RIGHT_ARROW = 'ArrowRight';
  }
  _initControls() {
    const controls = document.createElement('div');//div добавился
    const PAUSE = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;

    controls.setAttribute('class', 'controls');
    controls.setAttribute('id', 'controls-container');

    controls.innerHTML = PAUSE + PREV + NEXT;
    this.container.appendChild(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

  }
  _initIndicators() {
    const indicators = document.createElement('ol');

    indicators.setAttribute('class', 'indicators');
    indicators.setAttribute('id', 'indicators-container');

    for (let i = 0; i < this.slidesCount; i++) {
      const indicator = document.createElement('li');

      indicator.setAttribute('class', 'indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.dataset.slideTo = `${i}`;

      indicators.appendChild(indicator);
    }

    this.container.appendChild(indicators);
    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');

  }

  _initListeners() {

    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));
    document.addEventListener('keydown', this._pressKey.bind(this));

  }
  _indicate(e) {
    let target = e.target;
    if (target.classList.contains('indicator')) {
      this.pause();
      this.goToNth(+target.dataset.slideTo);
    }
  }

  _pressKey(e) {
    if (e.key === this.LEFT_ARROW) this.prev();
    if (e.key === this.RIGHT_ARROW) this.next();
    if (e.key === this.SPACE) this.pausePlay();
  }

  goToNth(n) {
    this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);//добавляем this чтобы видеть соответствющие элементы
    this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
    this.currentSlide = (n + this.slidesCount) % this.slidesCount;
    this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
    this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
  }

  goToNext() {
    this.goToNth(this.currentSlide + 1);
  }
  goToPrev() {
    this.goToNth(this.currentSlide - 1);
  }
  pause() {
    this.pauseBtn.innerHTML = this.FA_PLAY;
    this.isPlaying = false;
    clearInterval(this.timerID);
  }
  play() {
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.timerID = setInterval(() => {
      this.goToNext();
    }, this.interval);
    this.isPlaying = true;
  }
  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  }
  next() {
    this.pause();
    this.goToNext();
  }
  prev() {
    this.pause();
    this.goToPrev();
  }
  init() {
    this._initProps();
    this._initIndicators();
    this._initControls();
    this._initListeners();
    this.timerID = setInterval(() => this.goToNext(), this.interval);

  }

}
class SwipeCarousel extends Carousel {
  _initListeners() {

    super._initListeners();
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
  }
  _swipeStart(e) {
    if (e.changedTouches.length === 1) this.swipeStartX = e.changedTouches[0].pageX;
  }

  _swipeEnd(e) {
    if (e.changedTouches.length === 1) {
      this.swipeEndX = e.changedTouches[0].pageX;
      if (this.swipeStartX - this.swipeEndX < 0) this.prev();
      if (this.swipeStartX - this.swipeEndX > 0) this.next();
    }
  }

}

