//конструктор на прототипах
function Carousel(containerID = '#carousel', slideID = '.slide') {

  this.container = document.querySelector(containerID);//для того чтоб работать с функцией конструктора и работать с прототипом нужен this
  this.slides = this.container.querySelectorAll(slideID);


  //console.log(this.container);
  //console.log(this.nextBtn);
  //console.log('constructor');



  this.interval = 2000;


  this._initProps();
  this._initIndicators();
  this._initControls();
  this._initListeners();
  /*
    //метод который будет пренадлежать экземпляру, разница в оптимизации - будет множество
    */
}
/*
//метод пренадлежит прототипу, разница в оптимизации - в прототипе будет одно свойство
*/
Carousel.prototype = {
  //присвоить объект и работать с ним

  _initProps() {//свойство будет инициализировать какие-то 
    //переменные
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
  },

  _initControls() {
    const controls = document.createElement('div');//div добавился
    const PAUSE = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;

    controls.setAttribute('class', 'controls');//класс +
    controls.setAttribute('id', 'controls-container');//id +

    //добавить кнопки
    controls.innerHTML = PAUSE + PREV + NEXT;
    this.container.appendChild(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

  },
  //индикаторы, создаем динамически
  _initIndicators() {
    const indicators = document.createElement('ol');

    indicators.setAttribute('class', 'indicators');
    indicators.setAttribute('id', 'indicators-container');

    for (let i = 0; i < this.slidesCount; i++) {
      const indicator = document.createElement('li');

      indicator.setAttribute('class', 'indicator');
      if (i === 0) indicator.classList.add('active');
      indicators.dataset.slideTo = `${i}`;

      indicators.appendChild(indicator);
    }

    this.container.appendChild(indicators);
    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');

  },


  //создаём метод, обработчики
  _initListeners() {

    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));//потеряли контекст ->bind(this)
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));
    document.addEventListener('keydown', this._pressKey.bind(this));

  },
  _indicate(e) {//перенеcла к приватным
    let target = e.target;
    if (target.classList.contains('indicator')) {
      this.pause();
      this.goToNth(+target.dataset.slideTo);
    }
  },

  //работа с клавиатуры
  _pressKey(e) {
    if (e.key === this.LEFT_ARROW) this.prev();
    if (e.key === this.RIGHT_ARROW) this.next();
    if (e.key === this.SPACE) this.pausePlay();
  },


  goToNth(n) {
    this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);//добавляем this чтобы видеть соответствющие элементы
    this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
    this.currentSlide = (n + this.slidesCount) % this.slidesCount;
    this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
    this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
  },

  goToNext() {
    this.goToNth(this.currentSlide + 1);
  },
  goToPrev() {
    this.goToNth(this.currentSlide - 1);
  },
  //в консоли ввести -> carousel.goToNext() и проверить что метод работает

  pause() {
    this.pauseBtn.innerHTML = this.FA_PLAY;
    this.isPlaying = false;
    clearInterval(this.timerID);

  },
  play() {
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.timerID = setInterval(() => {
      this.goToNext();
    }, this.interval);//setTimeout and setInterval ведут к потере контекста... стрелочной функцией решим
    //
    //или
    //let that = this;
    //this.timeID = setInterval( function(){
    //that.goToNext();
    //}, this.interval);
    this.isPlaying = true;
  },
  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  },

  next() {
    this.pause();
    this.goToNext();
  },

  prev() {
    this.pause();
    this.goToPrev();
  },



  //запустить таймер
  init() {
    this.timerID = setInterval(() => {
      this.goToNext();
    }, this.interval);//время переключения

  }
};

//возможность создание наследования прототипов

function SwipeCarousel() {
  Carousel.apply(this, arguments);//наследование
}
//реализация корректного наследования
SwipeCarousel.prototype = Object.create(Carousel.prototype);//присвоение прототип объекта карусель
SwipeCarousel.prototype.constructor = SwipeCarousel;//обращение к свайп, к свойству прототайп и фиксим конструктор -> конструктором будет карусель-> а нужно чтоб свайп карусель

SwipeCarousel.prototype._initListeners = function () {
  Carousel.prototype._initListeners.apply(this);//перед тем как добавить новые свойства элементу, обращаемся к родителю
  this.container.addEventListener('touchstart', this._swipeStart.bind(this));
  this.container.addEventListener('touchend', this._swipeEnd.bind(this));
};

SwipeCarousel.prototype._swipeStart = function (e) {//методу присваиваем func
  if (e.changedTouches.length === 1) this.swipeStartX = e.changedTouches[0].pageX;
};

SwipeCarousel.prototype._swipeEnd = function (e) {//создается свойство на прямую
  if (e.changedTouches.length === 1) {
    this.swipeEndX = e.changedTouches[0].pageX;
    if (this.swipeStartX - this.swipeEndX < 0) this.prev();
    if (this.swipeStartX - this.swipeEndX > 0) this.next();
  }
};





