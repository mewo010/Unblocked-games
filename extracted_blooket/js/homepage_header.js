const header = document.getElementById('header');
const headerButtons = document.getElementById('headerButtons');
const heroSignUp = document.getElementById('heroSignUp');
const pageContent = document.getElementById('pageContent');

const buttonObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      // Show the header "Sign Up" button
      // when we can't see the hero one anymore
      if (!entry.isIntersecting) {
        headerButtons.classList.add('show');
      } else {
        headerButtons.classList.remove('show');
      }
    });
  },
  { root: null, rootMargin: '-80px 0px 0px 0px' } // height of header
);

const headerObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      // console.log(entry.target.id, entry.isIntersecting);
      // Show the scrolled styles after scroll
      if (entry.isIntersecting) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },
  { root: null, rootMargin: '1000px 0px -80px 0px' } // offset scroll-margin and footer
);

buttonObserver.observe(heroSignUp);
headerObserver.observe(pageContent);
