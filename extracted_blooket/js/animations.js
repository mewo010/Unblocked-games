// Load the hero animations first, without waiting for scroll position
const riveAnims = [
  {
    src: 'https://ac.blooket.com/www/assets/animations/owlV2.riv',
    canvasId: 'owl',
  },
  {
    src: 'https://ac.blooket.com/www/assets/animations/chicks.riv',
    canvasId: 'chicks',
  },
];

riveAnims.forEach((data) => {
  const el = document.getElementById(data.canvasId);
  const r = new rive.Rive({
    src: data.src,
    canvas: el,
    autoplay: false,
    onLoad: () => {
      r.resizeDrawingSurfaceToCanvas();
      setTimeout(() => {
        // Play the animation after a slight delay
        r.play();
        // Remove background placeholder image
        el.classList.add('loaded');
      }, 10);
    },
  });
});
