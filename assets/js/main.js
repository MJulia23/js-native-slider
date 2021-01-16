// переписываем на прототипы
let carousel = new SwipeCarousel({interval: 2000});

//let carousel = new SwipeCarousel('#slider', '.item');


/*
//управляем методами
*/
carousel.init();
//carousel.pause();//будет стоять на паузе, не крутиться
//carousel.goToNth(3);//перейти к определенному слайду