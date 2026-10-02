(() => {
  'use strict';
  const nav = document.querySelector('.floating-nav');
  const hero = document.querySelector('.hero');
  const toggle = document.querySelector('#motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let disabled;
  try { disabled = preference.matches || localStorage.getItem('orizon-motion') === 'off'; } catch { disabled = preference.matches; }
  let context, media, lenis, ticker, splits = [], stackTweens = [];
  const updateNav = () => nav.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * .67);
  window.addEventListener('scroll', updateNav, { passive: true }); updateNav();
  function clearMotion() {
    media?.revert(); media = null;
    context?.revert(); context = null;
    stackTweens.forEach(tween => { tween.scrollTrigger?.kill(); tween.revert(); }); stackTweens = [];
    splits.forEach(split => split.revert()); splits = [];
    if (ticker && window.gsap) gsap.ticker.remove(ticker);
    ticker = null;
    lenis?.destroy(); lenis = null; window.orizonLenis = null;
  }
  function refreshStacks() {
    if (!window.gsap || !window.ScrollTrigger) return;
    stackTweens.forEach(tween => { tween.scrollTrigger?.kill(); tween.revert(); }); stackTweens = [];
    const cards = [...document.querySelectorAll('.residence:not([hidden])')];
    document.querySelectorAll('.residence').forEach(card => { card.style.removeProperty('top'); });
    if (!disabled && window.innerWidth > 760) cards.forEach((card, index) => {
      card.style.top = `${105 + index * 20}px`;
      if (cards[index + 1]) stackTweens.push(gsap.to(card, { scale: .945, y: -8, ease: 'none', scrollTrigger: { trigger: cards[index + 1], start: 'top 85%', end: `top ${125 + index * 20}px`, scrub: .65, invalidateOnRefresh: true } }));
    });
    ScrollTrigger.refresh();
  }
  async function startMotion() {
    clearMotion();
    document.body.classList.toggle('motion-disabled', disabled);
    toggle.textContent = disabled ? 'Motion off' : 'Motion on';
    toggle.setAttribute('aria-pressed', String(!disabled));
    if (disabled || !window.gsap || !window.ScrollTrigger || !window.SplitType) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (window.Lenis && matchMedia('(pointer: fine)').matches) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false, autoRaf: false, prevent: node => node.tagName === 'DIALOG' });
      lenis.on('scroll', ScrollTrigger.update);
      ticker = time => lenis.raf(time * 1000);
      gsap.ticker.add(ticker); gsap.ticker.lagSmoothing(0); window.orizonLenis = lenis;
    }
    context = gsap.context(() => {
      const title = document.querySelector('[data-hero-split]');
      title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
      const heroSplit = new SplitType(title, { types: 'words,chars' }); splits.push(heroSplit);
      heroSplit.words.forEach(word => word.setAttribute('aria-hidden', 'true'));
      if (window.scrollY < 150) {
        gsap.from(heroSplit.chars, { yPercent: 85, opacity: 0, rotateX: -30, stagger: .027, duration: 1.1, delay: .12, ease: 'power3.out', clearProps: 'transform,opacity' });
        gsap.from('.top-bar, .rail, .intro, .discovery, .property, .brand-mark', { y: 24, opacity: 0, duration: 1, stagger: .07, delay: .3, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
      gsap.to('.scene', { yPercent: 17, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.to(title, { y: () => hero.offsetHeight * .18, opacity: .18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 } });
      document.querySelectorAll('[data-split]').forEach(element => {
        element.setAttribute('aria-label', element.textContent.replace(/\s+/g, ' ').trim());
        const split = new SplitType(element, { types: 'words,chars' }); splits.push(split);
        split.words.forEach(word => word.setAttribute('aria-hidden', 'true'));
        gsap.from(split.chars, { opacity: 0, yPercent: 70, rotateX: -20, stagger: .015, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true }, clearProps: 'transform,opacity' });
      });
      document.querySelectorAll('[data-reveal], .section-kicker, .manifesto-strip, .collection-side, .shortlist-card, .journey-steps details').forEach(element => gsap.from(element, { y: 35, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 91%', once: true }, clearProps: 'transform,opacity' }));
      document.querySelectorAll('[data-parallax]').forEach(img => gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: .65, invalidateOnRefresh: true } }));
      gsap.to('.ribbon-track', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '.type-ribbon', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.to('.label-light', { y: -70, rotation: -4, ease: 'none', scrollTrigger: { trigger: '.living', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      gsap.to('.label-space', { y: -110, rotation: 5, ease: 'none', scrollTrigger: { trigger: '.living', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
      gsap.to('.journey-orbit>span', { rotation: 180, ease: 'none', scrollTrigger: { trigger: '.journey', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    media = gsap.matchMedia();
    media.add('(min-width: 761px)', () => { refreshStacks(); return () => { stackTweens.forEach(t => { t.scrollTrigger?.kill(); t.revert(); }); stackTweens = []; }; });
    ScrollTrigger.refresh();
  }
  toggle.onclick = () => { disabled = !disabled; try { localStorage.setItem('orizon-motion', disabled ? 'off' : 'on'); } catch {} startMotion(); };
  preference.addEventListener('change', event => { disabled = event.matches; startMotion(); });
  window.addEventListener('orizon:layout', () => requestAnimationFrame(refreshStacks));
  window.addEventListener('load', () => window.ScrollTrigger?.refresh());
  Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1600))]).then(startMotion);
})();
