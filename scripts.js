'use strict';

// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('up', window.scrollY > 20), { passive: true });

// Hamburger
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  drawer.setAttribute('aria-hidden', !open);
});
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  drawer.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
}));

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('on'));
      const match = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (match) match.classList.add('on');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObs.observe(s));

// Scroll reveal — observer propre, un observe() par élément
const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.rev').forEach(el => revObs.observe(el));

// Contact form — Formspree AJAX
const form   = document.getElementById('cform');
const fmsg   = document.getElementById('fmsg');
const fsubtn = document.getElementById('fsub');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    fsubtn.disabled = true;
    fsubtn.textContent = 'Envoi en cours…';
    fmsg.className = 'fmsg';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        fmsg.className = 'fmsg ok';
        fmsg.textContent = '✓ Message envoyé ! Nous vous répondrons rapidement.';
        form.reset();
      } else {
        throw new Error('server');
      }
    } catch {
      fmsg.className = 'fmsg err';
      fmsg.textContent = '✗ Erreur d\'envoi. Appelez-nous au 027 322 00 92.';
    }
    fsubtn.disabled = false;
    fsubtn.textContent = 'Envoyer le message';
  });
}

// Cookie banner RGPD
const cookie = document.getElementById('cookie');
if (!localStorage.getItem('ck')) {
  setTimeout(() => cookie.classList.add('show'), 1000);
}
document.getElementById('ck-yes').addEventListener('click', () => {
  localStorage.setItem('ck', 'yes'); cookie.classList.remove('show');
});
document.getElementById('ck-no').addEventListener('click', () => {
  localStorage.setItem('ck', 'no'); cookie.classList.remove('show');
});
