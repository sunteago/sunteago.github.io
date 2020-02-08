$(document).ready(function() {
  const sections = {
    header_id: $("#header").offset().top,
    obras_id: $("#main-obras").offset().top,
    proyectos_id: $("#main-proyectos").offset().top,
    aboutme_id: $("#main-about-me").offset().top,
    contact_id: $("#main-contact").offset().top
  };
  const { obras_id, proyectos_id, aboutme_id, contact_id } = sections;
  let counter = 0;
  let timeout;

  $("html, body").on("wheel", function(event) {
    //executes if window width > 950
    if ($(window).width() > 950) {
      //fix to avoid double trigger in scroll
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        // deltaY obviously records vertical scroll, deltaX and deltaZ exist too
        if (event.originalEvent.deltaY > 0) {
          counter >= 0 && counter <= 3 ? counter++ : counter == 4;
        } else {
          counter >= 1 ? counter-- : (counter = 0);
        }
        $("html, body").animate(
          {
            scrollTop: Object.entries(sections)[counter][1]
          },
          400
        );
      }, 50);
    }
  });
});
