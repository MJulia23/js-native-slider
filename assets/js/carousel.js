//конструктор на прототипах
function Carousel() {
  this.container = document.querySelector('#carousel')//для того чтоб работать с функцией конструктора и работать с прототипом нужен this
  this.slides = this.container.querySelectorAll('.slide');
  this.indicatorsContainer = this.container.querySelector('#indicators-container');
  this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
  this.controlsContainer = this.container.querySelector('#controls-container');
  this.pauseBtn = this.controlsContainer.querySelector('#pause-btn');
  this.prevBtn = this.controlsContainer.querySelector('#prev-btn');
  this.nextBtn = this.controlsContainer.querySelector('#next-btn');
  //console.log(this.container);
  //console.log(this.nextBtn);
  //console.log('constructor');

  //переменные
  this.currentSlide = 0;
  this.timerID = null;
  this.slidesCount = this.slides.length;
  this.isPlaying = true;
  this.interval = 2000;
  this.swipeStartX = null;
  this.swipeEndX = null;

  this.CLASS_TRIGGER = 'active';
  this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
  this.FA_PLAY = '<i class="far fa-play-circle"></i>';
  this.SPACE = ' ';
  this.LEFT_ARROW = 'ArrowLeft';
  this.RIGHT_ARROW = 'ArrowRight';
  /*
    //метод который будет пренадлежать экземпляру, разница в оптимизации - будет множество
    */
}
/*
//метод пренадлежит прототипу, разница в оптимизации - в прототипе будет одно свойство
*/
Carousel.prototype = {
  //присвоить объект и работать с ним

  goToNth(n) {
  this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);//добавляем this чтобы видеть соответствющие элементы
  this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
  this.currentSlide = (n + this.slidesCount) % this.slidesCount;
  this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
  this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);
},

goToNext(){
   this.goToNth(this.currentSlide + 1);
  },
goToPrev(){
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
    this.timerID = setInterval( () => {
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
pausePlay(){
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

indicate(e) {
  let target = e.target;
  if (target.classList.contains('indicator')) {
    this.pause();
    this.goToNth(+target.dataset.slideTo);
  }

},
//работа с клавиатуры
pressKey(e) { 
  if (e.key === this.LEFT_ARROW) this.prev();
  if (e.key === this.RIGHT_ARROW) this.next();
  if (e.key === this.SPACE) this.pausePlay();
},


//обработчик свайпа

swipeStart(e) {
  
  if (e.changedTouches.length === 1)
  this.swipeStartX = e.changedTouches[0].pageX;
  
},
swipeEnd(e) {
  if (e.changedTouches.length === 1) {
    this.swipeEndX = e.changedTouches[0].pageX;
    if (this.swipeStartX - this.swipeEndX < 0) this.prev();
    if (this.swipeEndX - this.swipeStartX > 0) this.next();
  }
},
//создаём метод
initListeners(){
  
  this.pauseBtn.addEventListener('click', this.pausePlay);
  this.nextBtn.addEventListener('click', this.next);
  this.prevBtn.addEventListener('click', this.prev);
  this.indicatorsContainer.addEventListener('click', this.indicate);
  this.container.addEventListener('touchstart', this.swipeStart);
  this.container.addEventListener('touchend', this.swipeEnd);
  document.addEventListener('keydown', this.pressKey);
  
},
//запустить таймер
init(){
  this.timerID = setInterval( () => {
    this.goToNext();
   }, this.interval);//время переключения

}
};
