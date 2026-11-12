(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // scroll drift on cut-out blobs
  const drift = [...document.querySelectorAll('[data-drift]')];
  if (!still && drift.length) {
    let raf = 0;
    const apply = () => {
      raf = 0; const y = scrollY;
      for (const el of drift) {
        const k = parseFloat(el.dataset.drift) || 0.08;
        el.style.transform = `translateY(${(y * k).toFixed(1)}px)`;
      }
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
  }
  // campaign films: play only while on screen, never for reduced-motion users
  const vids = document.querySelectorAll('video[data-auto]');
  if (still) { vids.forEach(v => v.setAttribute('controls', '')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => {
    const v = en.target;
    if (en.isIntersecting) { v.preload = 'auto'; v.play().catch(() => v.setAttribute('controls', '')); }
    else v.pause();
  }), { threshold: 0.35 });
  vids.forEach(v => io.observe(v));
})();
