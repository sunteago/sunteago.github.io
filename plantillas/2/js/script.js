// $(document).ready(function() {
const sections = {
  header_id: $("#header").offset().top,
  obras_id: $("#main-obras").offset().top,
  proyectos_id: $("#main-proyectos").offset().top,
  aboutme_id: $("#main-about-me").offset().top,
  contact_id: $("#main-contact").offset().top
};
const menuOptions = {
  sectionClass: '.scrollspy',
  offset: 100,
}
//scrollspy
scrollSpy('#nav-bar__menu', menuOptions);

// const { obras_id, proyectos_id, aboutme_id, contact_id } = sections;
let counter = 0;
let timeout;
const numSections = Object.keys(sections).length;
const scrollMs = 400; //ms to do animation
//scroll animation
$("html body").on("wheel", function(event) {
  //only executes if window width > 950
  if ($(window).width() > 992) {
    //fix to avoid double trigger in scroll
    clearTimeout(timeout);
    timeout = setTimeout(function() {
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
    }, 50);
  }
});
//nav menu scrolls
for (let i = 1; i <= numSections; i++) {
  let navMenuItem = $(`.nav-bar__menu-item:nth-child(${i})`);
  let mobileMenuItem = $(`.mobile-bar__menu-item:nth-child(${i})`);
  const scrollToItem = e => {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: Object.entries(sections)[i - 1][1]
      },
      scrollMs
    );
    counter = i - 1;
  }
  navMenuItem.click(scrollToItem);
  mobileMenuItem.click(scrollToItem);
}
//Footer home sends you back home
$('.footer-links li a').click((e)=> {
  e.preventDefault();
  $("html, body").animate(
    {
      scrollTop: 0
    },
    scrollMs
  );
  counter = 0;
});
//toggles class "open"
$(".toggle-button").click(() => {
  $(".mobile-nav-bar").toggleClass("open");
});
// });

//FALTA, trackear links del footer