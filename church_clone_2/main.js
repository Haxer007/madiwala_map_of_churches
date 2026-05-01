/* ══════════════════════════════════════
   ZION AG CHURCH — main.js
   ══════════════════════════════════════ */

'use strict';

/* ── 0. THEME TOGGLE ── */
(function () {
  const btn = document.getElementById('themeToggle');
  const icon = btn?.querySelector('.theme-icon');
  const html = document.documentElement;
  const saved = localStorage.getItem('zion-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  if (icon) icon.textContent = saved === 'light' ? '🌙' : '☀️';
  btn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('zion-theme', next);
    if (icon) icon.textContent = next === 'light' ? '🌙' : '☀️';
  });
})();

/* ── 1. PARTICLE CANVAS BACKGROUND ── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  const lowPower = (navigator.hardwareConcurrency || 4) <= 4 || navigator.connection?.saveData || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = lowPower ? 16 : 30;
  const frameDelay = lowPower ? 48 : 33;
  const COLORS = ['rgba(201,168,76,', 'rgba(255,255,255,', 'rgba(124,92,191,'];
  let W = 0, H = 0, particles = [], rafId = 0, lastFrame = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * (lowPower ? 1.2 : 1.6) + .35,
        vx: (Math.random() - .5) * (lowPower ? .08 : .16),
        vy: (Math.random() - .5) * (lowPower ? .08 : .16),
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: Math.random() * .35 + .12,
      });
    }
  }

  function draw(now) {
    if (document.hidden) {
      return;
    }
    if (now - lastFrame < frameDelay) {
      rafId = requestAnimationFrame(draw);
      return;
    }
    lastFrame = now;

    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      else if (p.y > H + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.a + ')';
      ctx.fill();
    }
    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  resize();
  resetParticles();
  window.addEventListener('resize', () => {
    resize();
    resetParticles();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else {
      lastFrame = 0;
      start();
    }
  });
  start();
})();

/* ── 2. INTERSECTION OBSERVER — Animate slides on scroll ── */
const slideContents = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
slideContents.forEach(el => observer.observe(el));

/* ── 3. SIDE NAV ── */
const menuToggle = document.getElementById('menuToggle');
const sideNav = document.getElementById('sideNav');
const menuClose = document.getElementById('menuClose');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
  sideNav.classList.add('open');
  navOverlay.classList.add('show');
  menuToggle.classList.add('open');
}
function closeNav() {
  sideNav.classList.remove('open');
  navOverlay.classList.remove('show');
  menuToggle.classList.remove('open');
}
menuToggle.addEventListener('click', openNav);
menuClose.addEventListener('click', closeNav);
navOverlay.addEventListener('click', closeNav);

// Smooth scroll for nav links
sideNav.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    closeNav();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── 4. SCROLL DOTS ── */
const sections = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
// Ensure dot count matches sections
const scrollDotsEl = document.getElementById('scrollDots');
if (scrollDotsEl && dots.length < sections.length) {
  for (let i = dots.length; i < sections.length; i++) {
    const d = document.createElement('button');
    d.className = 'dot'; d.dataset.idx = i; d.setAttribute('aria-label', 'Section ' + (i + 1));
    scrollDotsEl.appendChild(d);
  }
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(sections).indexOf(entry.target);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => sectionObserver.observe(s));

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.idx);
    sections[idx].scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── 5. POSTER CAROUSEL ── */
(function () {
  const track = document.getElementById('posterTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.poster-slide:not(.clone)');
  const total = slides.length;
  const dotsEl = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'c-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }

  let current = 0, autoTimer;

  /* Compute exact pixel layout so center card is truly centered */
  function computeLayout() {
    const wrapperW = track.parentElement.offsetWidth;
    // Target: each slide = 60% of wrapper → 3 cards give 20% peekage on each side
    const slideW_px = Math.round(wrapperW * 0.60);
    const gap_px = 12;
    const pad_px = Math.round((wrapperW - slideW_px) / 2);
    track.querySelectorAll('.poster-slide').forEach(s => {
      s.style.width = slideW_px + 'px';
      s.style.minWidth = slideW_px + 'px';
      s.style.maxWidth = slideW_px + 'px';
    });
    track.style.paddingLeft = pad_px + 'px';
    track.style.paddingRight = pad_px + 'px';
    track.style.gap = gap_px + 'px';
  }
  computeLayout();
  window.addEventListener('resize', () => { computeLayout(); goTo(current, true); });

  /* Inject blurred backdrop: set --slide-bg from each slide's img src */
  track.querySelectorAll('.poster-slide').forEach(slide => {
    const img = slide.querySelector('img');
    if (!img) return;
    const apply = () => slide.style.setProperty('--slide-bg', `url('${img.src}')`);
    if (img.complete && img.naturalWidth > 0) apply();
    else img.addEventListener('load', apply);
  });

  function sw() { const s = track.querySelector('.poster-slide'); return s ? s.offsetWidth + parseInt(getComputedStyle(track).gap || '12') : 216; }

  function updateClasses() {
    // All real + clone slides
    const all = track.querySelectorAll('.poster-slide');
    all.forEach((s, i) => {
      s.classList.remove('cs-center', 'cs-side');
      // Map clone indices back: real slides are 0..total-1, clones after
      const realIdx = i % total;
      if (realIdx === current) s.classList.add('cs-center');
      else s.classList.add('cs-side');
    });
  }

  function goTo(idx, skip) {
    current = ((idx % total) + total) % total;
    const off = current * sw();
    if (skip) { track.style.transition = 'none'; track.style.transform = `translateX(-${off}px)`; setTimeout(() => track.style.transition = '', 30); }
    else { track.style.transition = 'transform .45s cubic-bezier(.25,.8,.25,1)'; track.style.transform = `translateX(-${off}px)`; }
    document.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    updateClasses();
  }

  const next = () => goTo(current + 1), prev = () => goTo(current - 1);
  const startAuto = () => { autoTimer = setInterval(next, 3000); };
  const stopAuto = () => { clearInterval(autoTimer); };

  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

  /* ── FLUID DRAG ── */
  let dragging = false, dragged = false;
  let x0 = 0, xNow = 0, baseOff = 0, lastX = 0, vel = 0, vTick;

  function dStart(cx) {
    dragging = true; dragged = false;
    x0 = cx; xNow = cx; lastX = cx; vel = 0;
    baseOff = current * sw();
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
    stopAuto();
    clearInterval(vTick);
    vTick = setInterval(() => { vel = xNow - lastX; lastX = xNow; }, 16);
  }

  function dMove(cx) {
    if (!dragging) return;
    xNow = cx;
    const delta = cx - x0;
    if (Math.abs(delta) > 4) dragged = true;
    const raw = baseOff - delta;
    const maxOff = (total - 1) * sw();
    const clamped = raw < 0 ? raw * 0.22 : raw > maxOff ? maxOff + (raw - maxOff) * 0.22 : raw;
    track.style.transform = `translateX(-${clamped}px)`;
  }

  function dEnd(cx) {
    if (!dragging) return;
    dragging = false;
    clearInterval(vTick);
    track.style.cursor = 'grab';
    const delta = cx - x0, s = sw();
    let target = current;
    if (Math.abs(vel) > 2.5) target = vel < 0 ? current + 1 : current - 1;
    else if (Math.abs(delta) > s * .25) target = delta < 0 ? current + 1 : current - 1;
    goTo(target);
    startAuto();
  }

  /* Touch */
  track.addEventListener('touchstart', e => dStart(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove', e => dMove(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', e => dEnd(e.changedTouches[0].clientX), { passive: true });
  track.addEventListener('touchcancel', e => dEnd(e.changedTouches[0]?.clientX ?? xNow), { passive: true });

  /* Mouse */
  track.addEventListener('mousedown', e => { e.preventDefault(); dStart(e.clientX); });
  window.addEventListener('mousemove', e => dMove(e.clientX));
  window.addEventListener('mouseup', e => dEnd(e.clientX));
  track.addEventListener('click', e => {
    if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; return; }
    const slide = e.target.closest('.poster-slide');
    if (!slide) return;
    const img = slide.querySelector('img');
    const label = slide.querySelector('.poster-label');
    if (img) openLightbox(img.src, img.alt, label?.textContent || '');
  }, true);

  startAuto();
  goTo(0, true);
})();

/* ── 5b. LIGHTBOX ── */
(function () {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbLbl = document.getElementById('lightboxLabel');
  const lbX = document.getElementById('lightboxClose');
  const bd = lb?.querySelector('.lightbox-backdrop');
  if (!lb) return;

  window.openLightbox = function (src, alt, label) {
    lbImg.src = src; lbImg.alt = alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  // Click anywhere on the overlay (including image area) closes
  lb.addEventListener('click', closeLightbox);
  // Prevent click on the inner card from bubbling up and immediately closing
  lb.querySelector('.lightbox-inner').addEventListener('click', e => e.stopPropagation());
  // X button still works
  lbX.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ── 6. MINI CALENDAR ── */
(function () {
  const grid = document.getElementById('calGrid');
  const monthLabel = document.getElementById('calMonthLabel');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');
  if (!grid) return;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fake special events for demo
  const specialDays = { 5: true, 12: true, 19: true, 26: true };
  const fastingDays = { 10: true, 24: true };

  let now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();

  function render() {
    monthLabel.textContent = months[viewMonth] + ' ' + viewYear;
    grid.innerHTML = '';
    // Day headers
    days.forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-day-name'; el.textContent = d; grid.appendChild(el);
    });
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div'); el.className = 'cal-day empty'; el.textContent = ''; grid.appendChild(el);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      let cls = 'cal-day';
      const weekDay = new Date(viewYear, viewMonth, d).getDay();
      if (weekDay === 0) cls += ' sunday';
      if (specialDays[d]) cls += ' special';
      if (fastingDays[d]) cls += ' fasting';
      const today = new Date();
      if (d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) cls += ' today';
      el.className = cls; el.textContent = d; grid.appendChild(el);
    }
  }

  prevBtn.addEventListener('click', () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); });
  nextBtn.addEventListener('click', () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); });
  render();
})();

/* ── 7. PARALLAX — removed (no background images) ── */

/* ── 8. PRAYER REQUEST ── */
document.getElementById('sendPrayer')?.addEventListener('click', e => {
  e.preventDefault();
  const txt = document.getElementById('prayerText')?.value.trim();
  if (!txt) { alert('Please type your prayer request.'); return; }
  const waMsg = encodeURIComponent('🙏 Prayer Request:\n\n' + txt + '\n\n— Sent via Zion AG Church Website');
  window.open('https://wa.me/917760404798?text=' + waMsg, '_blank');
});

/* ── 9. DAILY MANNA ROTATION ── */
(function () {
  const verses = [
    { v: '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."', r: 'Jeremiah 29:11', t: 'God\'s plans for us are always good — even when circumstances are hard. Trust His timing, His purpose, and His love. Today, choose to rest in the peace that comes from knowing He holds your future.' },
    { v: '"I can do all things through Christ who strengthens me."', r: 'Philippians 4:13', t: 'No challenge is too great when Christ is your strength. Whatever you face today — at work, at home, in your heart — lean into His power, not your own.' },
    { v: '"The LORD is my shepherd; I shall not want."', r: 'Psalm 23:1', t: 'When God is your shepherd, you lack nothing of eternal value. He leads, He provides, He restores. Walk today with confidence knowing you are tended by the Good Shepherd.' },
    { v: '"Trust in the LORD with all your heart and lean not on your own understanding."', r: 'Proverbs 3:5', t: 'Our limited understanding often clouds our faith. Choose today to surrender your plans to His wisdom. His ways are higher — and always better than our best.' },
    { v: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go."', r: 'Joshua 1:9', t: 'Fear loses its grip when we remember that God\'s presence accompanies us everywhere. Step boldly into today — you are not alone.' },
    { v: '"Come to me, all you who are weary and burdened, and I will give you rest."', r: 'Matthew 11:28', t: 'Jesus does not ask us to carry our burdens alone. Whatever is weighing you down today, lay it at His feet and receive the rest only He can give.' },
    { v: '"The name of the LORD is a fortified tower; the righteous run to it and are safe."', r: 'Proverbs 18:10', t: 'In moments of danger, fear, or uncertainty — run to God\'s name in prayer. He is not a distant fortress but an ever-present refuge.' }
  ];
  const vEl = document.getElementById('mannaVerse');
  const rEl = document.getElementById('mannaRef');
  const tEl = document.getElementById('mannaReflection');
  const btn = document.getElementById('newManna');
  if (!vEl) return;
  // Use day-of-year as default, randomize on button click
  const doy = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  let idx = doy % verses.length;
  function show(i) {
    vEl.style.opacity = '0'; rEl.style.opacity = '0'; tEl.style.opacity = '0';
    setTimeout(() => {
      vEl.textContent = verses[i].v;
      rEl.textContent = '— ' + verses[i].r;
      tEl.textContent = verses[i].t;
      vEl.style.opacity = '1'; rEl.style.opacity = '1'; tEl.style.opacity = '1';
    }, 250);
  }
  [vEl, rEl, tEl].forEach(el => { el.style.transition = 'opacity .25s'; });
  show(idx);
  btn?.addEventListener('click', () => { idx = (idx + 1) % verses.length; show(idx); });
})();

/* ── 9. FLOATING BUTTONS + SCROLL HINT HIDE/SHOW ON SCROLL ── */
(function () {
  const fp = document.querySelector('.float-prayer');
  const fw = document.querySelector('.float-wa');
  const hint = document.querySelector('.scroll-hint');
  const mode = document.querySelector('.theme-toggle');
  const menu = document.querySelector('.menu-toggle');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Hide scroll hint permanently once user scrolls > 60px
    if (hint && y > 60) hint.classList.add('hidden');

    // Float buttons auto-hide while scrolling down
    const hide = y > lastY && y > 200;
    [fp, fw, hint, mode].forEach(el => {
      if (!el) return;
      el.style.opacity = hide ? '0' : '1';
      el.style.transform = hide ? 'scale(0.8)' : 'scale(1)';
      el.style.visibility = hide ? 'hidden' : 'visible';
    });
    lastY = y;
  }, { passive: true });
})();

/* ── 10. UPDATE FLOAT-WA LINK ── */
document.querySelectorAll('.float-wa').forEach(el => el.setAttribute('href', 'https://wa.me/917760404798'));

/* ── 11. LIVE STREAM BANNER ── */
