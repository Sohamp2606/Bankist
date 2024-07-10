'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


const openModal = function (e) {
  // prevent from scrolling to top 
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {

  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// event listner with forEach loop 
btnsOpenModal.forEach(btn =>
  btn.addEventListener('click', openModal)
  );

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }

});



// -->>  smooth scrolling 
// select btn want to scroll when click 
const btnScrollTo = document.querySelector(
  '.btn--scroll-to');

// select where u want to scroll 
const section1 = document.querySelector(
  '#section--1')

// add this function 
btnScrollTo
  .addEventListener('click',function(e) {
    section1.scrollIntoView({behavior : 'smooth'});
});


// ///////////////
// -->>  page navigation 
// here we add event listner to all elements it not the good way

// document.querySelectorAll('.nav__link').forEach(
//   function(el){
//     el.addEventListener('click',function(e){
//       e.preventDefault();

//       // here we get href attribute sec_1 ,sec_2 and use 
//       // scollintoview to this id 
//       const id = this.getAttribute('href');
//       document.querySelector(id).scrollIntoView({
//         behavior:'smooth'
//       });
      
//     });
//   }
// );


// so we implement the event delegation 
// 1. add event listener to commn parent element 
// 2. determine what element originated the event 

document.querySelector('.nav__links').addEventListener(
  'click', function(e){
      // matching stratergy - we take class that have nav__link class 
      if(e.target.classList.contains('nav__link')){
        e.preventDefault();

        // here we get href attribute sec_1 ,sec_2 and use 
        // scollintoview to this id 
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({
          behavior:'smooth' });
        }
});


// ////////////////
// -->>  tabbed components 



// event delegation , add event listener to parent container 
// closest method return the closest parent of the element 
tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab')
  
  // when there is no clicked then avoid follow code just return 
  if(!clicked) return;

  // first we clear active class and add class to clicked btn 
  tabs
    .forEach(t => t.classList
    .remove('operations__tab--active'))

  clicked.classList.add('operations__tab--active');

  // remove active class from cards 
  tabsContent
    .forEach(c => c.classList
    .remove('operations__content--active'));
  

   // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');

});


// //////////////
// -->>  menu fade animation when hover 

// to make code DRY 
const handleHover = function(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    
    siblings.forEach(el => {
      if (el !== link ) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }

}

// when mouse over opacity of other element is 0.5
nav.addEventListener('mouseover', function(e){
  // inside here we call that function and pass parameters 
  handleHover(e,0.5);

});

// when mouse out opacity back to 1
nav.addEventListener('mouseout', function(e){
  handleHover(e,1);
});


// //////////////////
// -->>  sticky nav bar 
// using intersection observer API


const header = document.querySelector('.header');
//  for get height dinamically 
const navHeight = nav.getBoundingClientRect().height;
// when 0% of our header is visible means we scroll and 0% header is visible then 
 
const stickyNav = function(entries){
  const [entry] =entries;

  // isIntersecting is parameter in entry 
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

// this is an API that observe when header out threshold then it call fun 
// here threshold is 0% means when header goes out of viewposrt it call function 
// rootmargin - it appearce 90 px before threshold , this is height of nav bar 90px
const headerObserver = new IntersectionObserver(stickyNav,{
    root:null,
    threshold:0,
    rootMargin:`${navHeight}px`,
  });
headerObserver.observe(header);


// //////////////////
// -->>  revealing element on scroll
// using intersection observer API

// .section--hidden { opacity: 0; transform: translateY(8rem);
// when we remove class opacity is normal and element again come to orignal place 

const allSection = document.querySelectorAll('.section');


const revealSection = function(entries ,observer){
  const[entry] = entries;

  if(!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
}

// if reveal section when section is 15% visible 
const sectionObserver = new IntersectionObserver(
  revealSection , {
    root: null,
    threshold: 0.15,
});

  allSection.forEach(function(section){
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});



  
// //////////////////
// -->>  lazy image loading 
// using intersection observer API

const imgTarget = document.querySelectorAll('img[data-src]');


const loadImg = function(entries , observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  // replace image with orignal 
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load' , function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};


const imgObserver = new IntersectionObserver(loadImg,
  {
    root:null,
    threshold:0,
  });

imgTarget.forEach(img => imgObserver.observe(img));



// ////////////////////
// -->>  slider 
// /////////////
const slider = function(){

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');


  // function fot go to slide 
  const goToSlide = function(slide){
    slides.forEach((s ,i) => s
      .style.transform =`translateX(${100* (i - slide)}%)` )
    // -100% 0% 100% 300%
  }


  // function for next slide 
  const nextSlide = function(){
    if(curSlide === maxSlide-1){
      curSlide = 0;
    }else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  // function for privious slide 
  const prevSlide = function(){
    if(curSlide === 0){
      curSlide = maxSlide -1;
    }else{
      curSlide--;
    }
    
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  // event listeners 
  btnRight.addEventListener('click',nextSlide);
  btnLeft.addEventListener('click' ,prevSlide)

  // //////////////
  //  dots for slider 
  // //////
  // create dot for each slide 
  const createDots = function(){
    slides.forEach(function(_,i){
      dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`);
    })
  }

  // function for activate the dot 
  const activateDot = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot =>
      dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }


  // add event delegation , event listener
  dotContainer.addEventListener('click',function(e){
      if(e.target.classList.contains('dots__dot')){
        const {slide} = e.target.dataset;
    
        goToSlide(slide);
        activateDot(slide);
      }
  })


  // initial conditions for all 
  const init = function() {
    createDots()
    activateDot(0);
    goToSlide(0);
  }
  init();


};
slider();


