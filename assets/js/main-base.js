//ПАТТЕРН МОДУЛЬ!!! весь код писать внутри..сделать ананимную функцию и вызвать...переменные будут локальные и не будут конфликтовать с глобальными
//события
(function(){
    const container = document.querySelector('#carousel')
    const slides = container.querySelectorAll('.slide');//document меняем на container -> структура большая, мы единожды выбрав контейнер можем в рамках контейнера проводить выборку
    // console.log(slides)// проверяем в консоли 
    const indicatorsContainer = container.querySelector('#indicators-container');//делегирование, переписали нижний for
    const indicators = indicatorsContainer.querySelectorAll('.indicator');//получаю отдельно индикаторы и отдельно контейнеры #indicators-container
    
    const controlsContainer = container.querySelector('#controls-container');
    const pauseBtn = controlsContainer.querySelector('#pause-btn');//делаем выборку в controlsContainer
    const prevBtn = controlsContainer.querySelector('#prev-btn');
    const nextBtn = controlsContainer.querySelector('#next-btn');
    //console.log(nextBtn);
    //console.log(pauseBtn);
    
    
    //переменные
    let currentSlide = 0;//переменная, которую меняем. текущий слайд 
    let timerID = null;
    let slidesCount = slides.length; // сразу работать с переменной
    let isPlaying = true;//хранить состояние слайдера
    let interval = 2000;//так как используется несколько раз, удобно пользоваться переменной
    let swipeStartX = null;//для того чтоб посчитать свайпы
    let swipeEndX = null;
    
    const CLASS_TRIGGER = 'active';//синтаксис нормально чувствует себя в константах, не спутаются с переменными
    const FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    const FA_PLAY = '<i class="far fa-play-circle"></i>';
    const SPACE = ' ';
    const LEFT_ARROW = 'ArrowLeft';
    const RIGHT_ARROW = 'ArrowRight';
    
    
    function goToNth(n) {
    
      //нужно привязяться к n
    
      slides[currentSlide].classList.toggle(CLASS_TRIGGER);//.className = 'slide'как в презентации или .classList.toggle('active') получили слайд, чтоб он стал больше ->
      indicators[currentSlide].classList.toggle(CLASS_TRIGGER)
      /*
      if (currentSlide < 4) {
        currentSlide++;
      }
      else {
        currentSlide = 0;
      }//слайды ограниченые, чтоб не было error -> или */
    
      currentSlide = (n + slidesCount) % slidesCount; //остаток от деления
      slides[currentSlide].classList.toggle(CLASS_TRIGGER);//нету - включаем
      /*   console.log('next');//просто проверяем */
      indicators[currentSlide].classList.toggle(CLASS_TRIGGER);
    }
    
    //оптимизация
    //короче запись
    const goToNext = () => goToNth(currentSlide + 1);
    /*
    function goToNext() {//управляет куда ити
      goToNth(currentSlide + 1);//берем и вычисляем смещение +1
    }*/
    
    //оптимизация
    //короче запись
    const goToPrev = () => goToNth(currentSlide - 1);
    /*
    function goToPrev() {//управляет куда ити
      goToNth(currentSlide - 1);  //берем и вычисляем смещение -1
    }*/
    
    
    function pause() {
      pauseBtn.innerHTML = FA_PLAY;
      isPlaying = false;
      clearInterval(timerID);
    
    }
    function play() {
      pauseBtn.innerHTML = FA_PAUSE;
      timerID = setInterval(goToNext, interval);
      isPlaying = true;
    }
    
    function pausePlay() {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    }
    //или линейная
    //const pausePlay = () => isPlaying ? pause() : play();
    
    function next() {//cтабилизируем переключение, нет скачков
      pause();
      goToNext();
    }
    
    function prev() {//cтабилизируем переключение, нет скачков
      pause();
      goToPrev();
    }
    
    function indicate(e) {//получаем Objc event
      let target = e.target;//переменная target присваиваем  e.target
      //console.log(e);// инспектируем все ли впорядке
      if (target.classList.contains('indicator')) {//условие -> target -> класс classList -> contains ПРОВЕРЯЕТ ЕСТЬ ЛИ ТАКОЙ КЛАСС В ЭЛЕМЕНТЕ , если он есть дулаем постановку на паузу и перегоняем дальше
        pause();
        goToNth(+target.dataset.slideTo);//не работало из-за того что не поменяли на target. +target.getAttribute('data-slide-to' использовать специальный объект dataset 
      }
    
    }
    function pressKey(e) { //работа с клавиатуры
      if (e.key === LEFT_ARROW) prev();
      if (e.key === RIGHT_ARROW) next();
      if (e.key === SPACE) pausePlay();
    }
    
    
    //обработчик свайпа
    
    function swipeStart(e) {
      
      if (e.changedTouches.length === 1)
        swipeStartX = e.changedTouches[0].pageX;
      
    }
    function swipeEnd(e) {
      if (e.changedTouches.length === 1) {
        swipeEndX = e.changedTouches[0].pageX;
        if (swipeStartX - swipeEndX < 0) prev();
        if (swipeStartX - swipeEndXX > 0) next();
      }
    }
    /*
    //события
    */
    
    pauseBtn.addEventListener('click', pausePlay);//обработчики
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);//подключаем конкретную функцию
    indicatorsContainer.addEventListener('click', indicate);//ul навешиваю click и функцию indicate
    
    container.addEventListener('touchstart', swipeStart);
    container.addEventListener('touchend', swipeEnd);
    
    document.addEventListener('keydown', pressKey);
    
    timerID = setInterval(goToNext, interval);//время переключения
    
    
    
    /*
    //работа с индикаторами
    */
    //переделали в indicate(e)
    /*
    function indHandler() {
     // console.log(this);
      goToNth(+this.getAttribute('data-slide-to'));//конкотонация, сделать конвертацию
    }
    */
    //let indicators = document.querySelectorAll('.indicator');
    
    /*
    for (let i = 0; i < indicators.length; i++) indicators[i].addEventListener('click', indHandler);
    */
  }());
  