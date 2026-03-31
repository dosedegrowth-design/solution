// main.js — Solution Desentupidora

/* =====================
   HEADER SCROLL
   ===================== */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* =====================
   SCROLL PROGRESS BAR
   ===================== */
(function() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:3px;width:0%;
    background:linear-gradient(90deg,#f97316,#25d366);
    z-index:9999;transition:width 0.1s linear;
  `;
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

/* =====================
   HAMBURGER MENU — SIDEBAR
   ===================== */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  // Criar overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* =====================
   COUNTER ANIMATION
   ===================== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const isLarge = target >= 1000;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = isLarge ? value.toLocaleString('pt-BR') : value;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');
if (statNumbers.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  statNumbers.forEach(el => observer.observe(el));
}

/* =====================
   FORM SUBMIT → WPP
   ===================== */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('form-name')?.value || '';
  const phone = document.getElementById('form-phone')?.value || '';
  const service = document.getElementById('form-service')?.value || '';
  const message = encodeURIComponent(
    `Olá! Me chamo ${name}, telefone ${phone}.\nEstou precisando de: ${service}.\nVi o site da Solution Desentupidora e gostaria de um orçamento.`
  );
  window.open(`https://wa.me/5511987282370?text=${message}`, '_blank');
}

/* =====================
   SCROLL REVEAL
   ===================== */
const revealEls = document.querySelectorAll('.service-card, .step-card, .testimonial-card, .why-feature, .stat-item');
if (revealEls.length && 'IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 80 * (entry.target.dataset.delay || 0));
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.dataset.delay = i % 4;
    revealObs.observe(el);
  });
}

/* =====================
   SMOOTH SCROLL NAV
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 70;
      const topbarH = document.querySelector('.topbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - topbarH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =====================
   ACTIVE NAV LINK ON SCROLL
   ===================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
if (sections.length && navLinks.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });
}

/* ===================================================
   EXIT-INTENT POPUP
   Dispara quando o mouse sai pelo topo da janela.
   Mostra apenas 1x por sessão. Delay mínimo 5s.
   =================================================== */
(function() {
  // Não mostrar se já foi fechado nesta sessão
  if (sessionStorage.getItem('exitPopupShown')) return;

  let popupReady = false;
  let popupShown = false;

  // Só ativa o popup depois de 5s na página
  setTimeout(() => { popupReady = true; }, 5000);

  function createPopup() {
    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'exit-popup-overlay';

    // Popup box
    const popup = document.createElement('div');
    popup.id = 'exit-popup';
    popup.innerHTML = `
      <button id="exit-popup-close" aria-label="Fechar">✕</button>
      <div class="ep-urgency-badge">⚠️ Antes de sair…</div>
      <div class="ep-icon">🛠️</div>
      <h2 class="ep-title">Precisa de<br><span>Ajuda Agora?</span></h2>
      <p class="ep-subtitle">Desentupimento, dedetização, limpeza de caixa de gordura e muito mais.<br>Chegamos em <strong>até 40 minutos</strong> com <strong>visita gratuita</strong>.</p>
      <div class="ep-services-list">
        <span class="ep-service-tag">🚰 Desentupimento</span>
        <span class="ep-service-tag">🦟 Dedetização</span>
        <span class="ep-service-tag">💧 Hidrojateamento</span>
        <span class="ep-service-tag">🏭 Caixa de Gordura</span>
      </div>
      <div class="ep-benefits">
        <div class="ep-benefit"><span>✅</span> Sem taxa de visita</div>
        <div class="ep-benefit"><span>✅</span> Orçamento grátis</div>
        <div class="ep-benefit"><span>✅</span> Garantia no serviço</div>
      </div>
      <a href="https://wa.me/5511987282370?text=Olá!%20Vi%20o%20site%20da%20Solution%20e%20preciso%20de%20atendimento." target="_blank" class="ep-cta-wpp" id="exit-popup-wpp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        Solicitar Atendimento Agora
      </a>
      <a href="tel:1123641035" class="ep-cta-phone" id="exit-popup-phone">📞 (11) 2364-1035</a>
      <button class="ep-dismiss" id="exit-popup-dismiss">Não preciso de atendimento agora</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Animar entrada
    requestAnimationFrame(() => {
      overlay.classList.add('ep-visible');
      popup.classList.add('ep-in');
    });

    function closePopup() {
      overlay.classList.remove('ep-visible');
      popup.classList.remove('ep-in');
      popup.classList.add('ep-out');
      setTimeout(() => overlay.remove(), 350);
      sessionStorage.setItem('exitPopupShown', '1');
    }

    document.getElementById('exit-popup-close').addEventListener('click', closePopup);
    document.getElementById('exit-popup-dismiss').addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });

    // Fechar com ESC
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', handler); }
    });
  }

  // Exit-intent: mouse saindo pelo topo
  document.addEventListener('mouseleave', (e) => {
    if (!popupReady || popupShown) return;
    if (e.clientY <= 5) {
      popupShown = true;
      createPopup();
    }
  });

  // Fallback mobile: popup após 45s de inatividade ou scroll para cima rápido
  let lastScrollY = window.scrollY;
  let scrollDownCount = 0;
  let mobileFallbackDone = false;

  window.addEventListener('scroll', () => {
    if (mobileFallbackDone || popupShown || !popupReady) return;
    const currentY = window.scrollY;
    if (currentY < lastScrollY - 80) {
      scrollDownCount++;
      if (scrollDownCount >= 2) {
        mobileFallbackDone = true;
        popupShown = true;
        setTimeout(createPopup, 300);
      }
    } else if (currentY > lastScrollY) {
      scrollDownCount = 0;
    }
    lastScrollY = currentY;
  });

})();

/* =====================
   STICKY BOTTOM BAR (mobile)
   ===================== */
(function() {
  // Só no mobile
  if (window.innerWidth > 768) return;

  const bar = document.createElement('div');
  bar.id = 'sticky-mobile-bar';
  bar.innerHTML = `
    <a href="tel:1123641035" id="sticky-phone">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
      Ligar Agora
    </a>
    <a href="https://wa.me/5511987282370?text=Olá!%20Preciso%20de%20atendimento." target="_blank" id="sticky-wpp">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      WhatsApp
    </a>
  `;
  document.body.appendChild(bar);

  // Mostrar após scroll de 200px
  window.addEventListener('scroll', () => {
    bar.style.transform = window.scrollY > 200 ? 'translateY(0)' : 'translateY(100%)';
  });
})();

console.log('Solution Desentupidora — Site carregado ✅');
