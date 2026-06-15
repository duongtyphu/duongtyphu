/**
 * ════════════════════════════════════════════════════════════
 * VDAI ACADEMY — APP.JS
 * ════════════════════════════════════════════════════════════
 * Toàn bộ logic JavaScript của website:
 * 1. Sticky nav + scroll shadow
 * 2. Mobile drawer menu
 * 3. Scroll reveal animation
 * 4. Smooth scroll cho anchor link
 * 5. FAQ accordion
 * 6. Quiz "Bản đồ Affiliate AI" (modal nhiều bước)
 * 7. Form submission (quiz lead + liên hệ)
 * 8. Tracking helper (GA4 / Meta Pixel / TikTok Pixel / Clarity)
 *
 * Phụ thuộc: assets/js/config.js (phải load TRƯỚC file này)
 * ════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ────────────────────────────────────────────────────────
     1. STICKY NAV — shadow khi scroll
  ──────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ────────────────────────────────────────────────────────
     2. MOBILE DRAWER MENU
  ──────────────────────────────────────────────────────── */
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileToggle?.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }

  mobileToggle?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', closeDrawer);

  // Đóng drawer khi click ra ngoài panel
  mobileDrawer?.addEventListener('click', function (e) {
    if (e.target === mobileDrawer) closeDrawer();
  });

  // Đóng drawer sau khi chọn một liên kết
  document.querySelectorAll('.mobile-drawer-panel a').forEach(link => {
    link.addEventListener('click', () => closeDrawer());
  });

  // Đóng drawer bằng Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* ────────────────────────────────────────────────────────
     3. SCROLL REVEAL ANIMATION
  ──────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: hiện ngay nếu không hỗ trợ IntersectionObserver
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ────────────────────────────────────────────────────────
     4. SMOOTH SCROLL CHO ANCHOR LINK NỘI BỘ
  ──────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = nav ? nav.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

    // Cập nhật active state cho nav menu
    document.querySelectorAll('.nav-menu a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === href);
    });
  });

  /* ────────────────────────────────────────────────────────
     5. FAQ ACCORDION
  ──────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.setAttribute('aria-expanded', 'false');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Đóng tất cả các FAQ khác (accordion mode)
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          const openAnswer = openItem.querySelector('.faq-answer');
          if (openAnswer) openAnswer.style.maxHeight = '0px';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        trackEvent('faq_open', { question: question.textContent.trim() });
      }
    });

    // Hỗ trợ điều hướng bằng Enter/Space (button đã tự hỗ trợ, nhưng đảm bảo)
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  /* ────────────────────────────────────────────────────────
     6. SCROLL DEPTH TRACKING (50% / 90%)
  ──────────────────────────────────────────────────────── */
  let tracked50 = false;
  let tracked90 = false;
  window.addEventListener('scroll', function () {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    if (!tracked50 && scrollPercent >= 50) {
      tracked50 = true;
      trackEvent('scroll_50');
    }
    if (!tracked90 && scrollPercent >= 90) {
      tracked90 = true;
      trackEvent('scroll_90');
    }
  }, { passive: true });

  /* ────────────────────────────────────────────────────────
     7. CTA / PROGRAM CLICK TRACKING
     Gắn data-track="event_name" vào bất kỳ link/button nào
     để tự động gửi event khi click.
  ──────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    trackEvent(el.dataset.track, { label: el.textContent.trim() });
  });

}); // end DOMContentLoaded


/* ════════════════════════════════════════════════════════════
   TRACKING HELPER
   ════════════════════════════════════════════════════════════
   Gửi event đến GA4, Meta Pixel, TikTok Pixel nếu đã được cấu
   hình trong config.js. Nếu chưa có ID, hàm sẽ bỏ qua an toàn
   (không throw lỗi console).

   Sự kiện chuẩn hóa được dùng trong toàn site:
   - click_primary_cta, click_solo, click_scale
   - quiz_start, quiz_step, quiz_complete
   - lead_submit, lead_success, lead_error
   - faq_open, scroll_50, scroll_90
   ════════════════════════════════════════════════════════════ */
function trackEvent(eventName, params) {
  params = params || {};

  try {
    // Google Analytics 4 (gtag.js)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params);
    }

    // TikTok Pixel
    if (typeof window.ttq !== 'undefined' && typeof window.ttq.track === 'function') {
      window.ttq.track(eventName, params);
    }

    // Console log khi chưa kết nối tracking (giúp debug, không phải lỗi)
    if (!window.gtag && !window.fbq && !window.ttq) {
      console.info('[VDAI tracking] ' + eventName, params);
    }
  } catch (err) {
    // Không để lỗi tracking ảnh hưởng đến trải nghiệm người dùng
    console.warn('[VDAI tracking] lỗi gửi event:', eventName, err);
  }
}
