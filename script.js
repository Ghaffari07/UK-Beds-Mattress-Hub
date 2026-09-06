(function(){
  "use strict";

  /* ---------- Sticky header state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Firmness finder ---------- */
  const range = document.getElementById('firmnessRange');
  const numberEl = document.getElementById('firmnessNumber');
  const sleeperEl = document.getElementById('firmnessSleeper');
  const descEl = document.getElementById('firmnessDesc');
  const needle = document.getElementById('dialNeedle');
  const arc = document.getElementById('dialArc');

  const profiles = [
    { max: 2, sleeper: 'The cloud-lover', desc: 'Best for light-framed side sleepers who want pressure taken off hips and shoulders. Start with a soft topper over The Cotswold Guest Bed.' },
    { max: 4, sleeper: 'The soft-medium sleeper', desc: 'Suits most side sleepers and anyone who runs warm — foam contours without trapping heat. Start with The Cotswold Guest Bed.' },
    { max: 6, sleeper: 'The all-rounder', desc: 'Suits back and side sleepers who switch position through the night. Start with The Harrogate Hybrid.' },
    { max: 8, sleeper: 'The firm-support sleeper', desc: 'Suits front sleepers and anyone managing lower-back strain who needs a mattress that pushes back. Start with The Windermere Divan.' },
    { max: 10, sleeper: 'The firm-as-it-gets sleeper', desc: 'Suits heavier-set and front sleepers who sink too far into anything softer. The Windermere Divan in firm is built for exactly this.' }
  ];

  function updateFirmness(value){
    numberEl.textContent = value;
    const profile = profiles.find(p => value <= p.max) || profiles[profiles.length - 1];
    sleeperEl.textContent = profile.sleeper;
    descEl.textContent = profile.desc;

    // needle sweeps -90deg (soft) to +90deg (firm) across a semicircle
    const angle = -90 + ((value - 1) / 9) * 180;
    needle.setAttribute('transform', `rotate(${angle} 150 150)`);

    // arc: full length 408 -> offset shrinks as value rises
    const offset = 408 - ((value - 1) / 9) * 408;
    arc.style.strokeDashoffset = offset;
  }

  if (range){
    range.addEventListener('input', e => updateFirmness(Number(e.target.value)));
    updateFirmness(Number(range.value));
  }

  /* ---------- Animated counters (once, on scroll into view) ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      const duration = 1400;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-GB');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('testimonialCarousel');
  const slides = track ? Array.from(track.querySelectorAll('.testimonial')) : [];
  const dotsWrap = document.getElementById('testimonialDots');
  let current = 0;
  let timer;

  if (slides.length){
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show review ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });

    function goTo(index, manual){
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
      if (manual) restart();
    }

    function next(){ goTo((current + 1) % slides.length, false); }
    function restart(){ clearInterval(timer); timer = setInterval(next, 6000); }
    restart();
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop){
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
