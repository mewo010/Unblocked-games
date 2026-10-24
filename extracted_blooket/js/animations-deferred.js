// Load the remaining animations as they appear on screen
const riveAnimsDeferred = [
  'question',
  'graph',
  'wizard',
  // 'games',
  'fishing',
];
const path = 'https://ac.blooket.com/www/assets/animations/';
const ext = '.riv';

const callback = (entries, obs) => {
  entries.forEach((entry) => {
    // If its not on the screen yet, do nothing
    if (!entry.isIntersecting) return;

    // Initiate anim when its visible & not yet loaded
    if (!entry.target.classList.contains('loaded')) {
      var r = new rive.Rive({
        src: path.concat(entry.target.id, ext),
        canvas: entry.target,
        autoplay: false,
        onLoad: () => {
          r.resizeDrawingSurfaceToCanvas();
          // Play the animation after a slight delay
          setTimeout(() => {
            r.play();
            // Remove background placeholder image
            entry.target.classList.add('loaded');
          }, 10);
          // Stop observing the element
          obs.unobserve(entry.target);
        },
      });
    }
  });
};

// Create a new observer with margin
let animationObserver;
let options = {
  root: null,
  rootMargin: '500px 0px 500px 0px',
};
animationObserver = new IntersectionObserver(callback, options);

// Observe each animation canvas position
riveAnimsDeferred.forEach((id) => {
  const el = document.getElementById(id);
  animationObserver.observe(el);
});
