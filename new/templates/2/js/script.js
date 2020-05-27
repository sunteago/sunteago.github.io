
// $(document).ready(function() {
const sections = {
  header_id: $("#header").offset().top,
  obras_id: $("#main-obras").offset().top,
  projects_id: $("#main-projects").offset().top,
  aboutme_id: $("#main-about-me").offset().top,
  contact_id: $("#main-contact").offset().top
};
const menuOptions = {
  sectionClass: '.scrollspy',
  offset: 100,
}

//scrollspy
scrollSpy('#nav-bar__menu', menuOptions);

const mobileNav = document.querySelector('.mobile-navbar');
const toggleBtn = document.querySelector('.toggle-button');
const closeBtn = document.querySelector('.mobile-navbar__close');

function scrollToItem(e, i, isMobile) {
  e.preventDefault();
  $("html, body").animate({
    scrollTop: Object.entries(sections)[i - 1][1]
  }, scrollMs);
  counter = i - 1;
  isMobile && closeMobileNavbar();
}

function closeMobileNavbar() {
  mobileNav.classList.remove('fadein');
  setTimeout(() => mobileNav.classList.remove('visible'), 500);
  toggleBtn.classList.remove('invisible');
}

function showMobileNavbar() {
  mobileNav.classList.add('visible');
  setTimeout(() => {
    mobileNav.classList.add('fadein')
    toggleBtn.classList.add('invisible');
  }, 25);
}

let counter = 0;
let timeout;
const numSections = Object.keys(sections).length;
const scrollMs = 400; //ms to do animation


//scroll animation
$("html body").on("wheel", function (event) {
  //only executes if window width > 950
  if ($(window).width() > 992) {
    //fix to avoid double trigger in scroll
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      // deltaY obviously records vertical scroll, deltaX and deltaZ exist too
      if (event.originalEvent.deltaY > 0) {
        //scrolling down
        counter >= 0 && counter < numSections - 1
          ? counter++
          : (counter = numSections - 1);
      } else {
        //scrolling up
        counter >= 1 ? counter-- : (counter = 0);
      }
      $("html, body").animate(
        {
          scrollTop: Object.entries(sections)[counter][1]
        },
        scrollMs
      );
    }, 100);
  }
});

//nav menu scrolls listeners, 
for (let i = 1; i <= numSections; i++) {
  const navMenuItem = $(`.nav-bar__menu-item:nth-child(${i})`);
  const mobileMenuItem = $(`.mobile-navbar__menu-item:nth-child(${i})`);
  navMenuItem.click((e) => scrollToItem(e, i));
  mobileMenuItem.click((e) => scrollToItem(e, i, true));
}

//mobile nav actions
toggleBtn.addEventListener('click', showMobileNavbar);

closeBtn.addEventListener('click', closeMobileNavbar);


//Footer home sends you back home
$('.footer-links li a').click((e) => {
  e.preventDefault();
  $("html, body").animate(
    {
      scrollTop: 0
    },
    scrollMs
  );
  counter = 0;
});

// });

//FALTA, trackear links del footer
//setear para ipad
