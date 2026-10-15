/**
 * Script Principal — Antes que se esqueça
 * Gerencia integrações de WhatsApp, acessibilidade, acordeões de FAQ,
 * máquina de estados do CTA persistente e animações com GSAP e ScrollTrigger.
 */

(function () {
  "use strict";


  // 1. Atualizar links de WhatsApp conforme intenção centralizada
  function initWhatsAppLinks() {
    var links = document.querySelectorAll("[data-wa]");
    links.forEach(function (link) {
      var intent = link.getAttribute("data-wa");
      if (typeof window.AQSE_whatsappHref === "function") {
        link.setAttribute("href", window.AQSE_whatsappHref(intent));
      }
    });
  }

  // 2. Ano dinâmico no footer
  function initYear() {
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }
  }

  // 3. Header flutuante: retração inteligente no scroll
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
    var lastScrollY = window.scrollY;
    var threshold = 80;

    window.addEventListener(
      "scroll",
      function () {
        var currentScrollY = window.scrollY;
        if (currentScrollY <= threshold) {
          header.classList.remove("is-hidden");
        } else if (currentScrollY > lastScrollY + 6) {
          header.classList.add("is-hidden");
        } else if (currentScrollY < lastScrollY - 6) {
          header.classList.remove("is-hidden");
        }
        lastScrollY = currentScrollY;
      },
      { passive: true }
    );
  }

  // 4. Máquina de estados do CTA Persistente
  function initStickyCTA() {
    var sticky = document.querySelector("[data-sticky-cta]");
    var heroCta = document.querySelector("[data-hero-cta]");
    var finalSection = document.querySelector("[data-final]");
    var stickyBtn = sticky ? sticky.querySelector("a") : null;

    if (!sticky || !heroCta) return;

    var isHeroCtaVisible = true;
    var isFinalVisible = false;
    var isFooterVisible = false;

    function updateStickyState() {
      var shouldShow = !isHeroCtaVisible && heroCta.getBoundingClientRect().bottom < 0 && !isFinalVisible && !isFooterVisible;

      if (shouldShow) {
        sticky.classList.add("is-visible");
        sticky.setAttribute("aria-hidden", "false");
        if (stickyBtn) stickyBtn.setAttribute("tabindex", "0");
      } else {
        sticky.classList.remove("is-visible");
        sticky.setAttribute("aria-hidden", "true");
        if (stickyBtn) stickyBtn.setAttribute("tabindex", "-1");
      }
    }

    if ("IntersectionObserver" in window) {
      var heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isHeroCtaVisible = entry.isIntersecting;
            updateStickyState();
          });
        },
        { rootMargin: "0px 0px -40px 0px" }
      );
      heroObserver.observe(heroCta);
      var footer = document.querySelector(".site-footer");
      if (footer) {
        new IntersectionObserver(function (entries) {
          isFooterVisible = entries[0].isIntersecting;
          updateStickyState();
        }).observe(footer);
      }

      if (finalSection) {
        var finalObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              isFinalVisible = entry.isIntersecting;
              updateStickyState();
            });
          },
          { rootMargin: "0px 0px -100px 0px" }
        );
        finalObserver.observe(finalSection);
      }
    } else {
      window.addEventListener(
        "scroll",
        function () {
          var heroRect = heroCta.getBoundingClientRect();
          isHeroCtaVisible = heroRect.bottom > 0;
          if (finalSection) {
            var finalRect = finalSection.getBoundingClientRect();
            isFinalVisible = finalRect.top < window.innerHeight && finalRect.bottom > 0;
          }
          var footerRect = document.querySelector(".site-footer").getBoundingClientRect();
          isFooterVisible = footerRect.top < innerHeight;
          updateStickyState();
        },
        { passive: true }
      );
    }
  }

  // 5. FAQ com comportamento suave de acordeão
  function initFAQ() {
    var faqDetails = document.querySelectorAll("[data-faq] details");
    faqDetails.forEach(function (targetDetail) {
      targetDetail.addEventListener("toggle", function () {
        if (targetDetail.open) {
          faqDetails.forEach(function (other) {
            if (other !== targetDetail && other.open) {
              other.removeAttribute("open");
            }
          });
        }
      });
    });
  }

  // Motion is progressive enhancement: content remains readable without GSAP.
  function initAnimations() {
    document.documentElement.classList.remove("js-loading");
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var media = gsap.matchMedia();
    var heroPlayed = false;
    media.add({
      all: "(min-width: 0px)",
      desktop: "(min-width: 960px)",
      reduce: "(prefers-reduced-motion: reduce)"
    }, function (context) {
      var reduce = context.conditions.reduce;
      var desktop = context.conditions.desktop;
      var process = document.querySelector(".process");
      var steps = Array.from(document.querySelectorAll("[data-step]"));
      var lastStep = -1;

      // Single introductory sequence; never replay it when a breakpoint changes.
      if (!heroPlayed && window.scrollY < 80) {
        gsap.timeline({ defaults: { ease: "power3.out", duration: reduce ? 0.2 : 0.65 } })
          .from(".hero__title", { opacity: 0, y: reduce ? 0 : 22, clearProps: "all" })
          .from(".hero__lead, .hero__actions, .hero__note", {
            opacity: 0, y: reduce ? 0 : 12, stagger: reduce ? 0 : 0.06, clearProps: "all"
          }, reduce ? 0 : 0.14)
          .from("[data-hero-photo]", {
            opacity: 0, scale: reduce ? 1 : 0.97, clearProps: "all"
          }, 0);
      }
      heroPlayed = true;

      // The active step is derived from current geometry, including fast scroll,
      // restored positions and reverse navigation; callbacks cannot skip stages.
      function syncStep() {
        var readingLine = window.innerHeight * 0.52;
        var index = 0;
        steps.forEach(function (step, i) {
          if (step.getBoundingClientRect().top <= readingLine) index = i;
        });
        if (index === lastStep) return;
        lastStep = index;
        steps.forEach(function (step, i) { step.classList.toggle("is-active", i === index); });
        var caption = document.querySelector("[data-caption]");
        caption.textContent = ["Uma história pra contar", "Muitas formas de guardar", "Cada detalhe tem significado", "Um presente com a cara de vocês"][index];
        gsap.to("[data-progress]", { scaleX: (index + 1) / steps.length, duration: reduce ? 0 : 0.25, ease: "power2.out", overwrite: true });
      }
      process.classList.add("is-tracking");
      ScrollTrigger.create({
        trigger: process, start: "top bottom", end: "bottom top",
        onUpdate: syncStep, onRefresh: syncStep
      });
      syncStep();

      var onVisibility;
      if (!reduce) {
        // Reveal photographs once; reading copy stays still and available.
        gsap.utils.toArray("[data-clip-reveal]").forEach(function (photo) {
          gsap.from(photo, {
            opacity: 0.35, y: 20, duration: 0.65, ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: photo, start: "clamp(top 92%)", once: true }
          });
        });
        if (desktop) {
          gsap.utils.toArray("[data-parallax-img]").forEach(function (img) {
            gsap.fromTo(img, { yPercent: -5 }, {
              yPercent: 5, ease: "none",
              scrollTrigger: { trigger: img.closest("figure"), start: "top bottom", end: "bottom top", scrub: true }
            });
          });
        }
        var marquee = document.querySelector("[data-marquee]");
        if (!marquee.dataset.duplicated) {
          marquee.innerHTML += marquee.innerHTML;
          marquee.dataset.duplicated = "true";
        }
        var loop = gsap.to(marquee, { xPercent: -50, duration: 32, repeat: -1, ease: "none", paused: true });
        ScrollTrigger.create({
          trigger: ".marquee", start: "top bottom", end: "bottom top",
          onToggle: function (self) { self.isActive && !document.hidden ? loop.play() : loop.pause(); }
        });
        onVisibility = function () {
          if (document.hidden) loop.pause();
          else if (ScrollTrigger.isInViewport(marquee)) loop.play();
        };
        document.addEventListener("visibilitychange", onVisibility);
      }
      return function () {
        process.classList.remove("is-tracking");
        if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
      };
    });

    // Fonts, lazy images and accordion changes can all alter trigger positions.
    var refreshFrame;
    function refreshLayout() {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    }
    document.fonts.ready.then(refreshLayout);
    document.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", refreshLayout, { once: true });
    });
    document.querySelectorAll("[data-faq] details").forEach(function (detail) {
      detail.addEventListener("toggle", refreshLayout);
    });
    window.addEventListener("pageshow", refreshLayout);
  }

  // Autoplay advances the horizontal viewport only, never the page scroll.
  function initCarousel() {
    var section = document.querySelector(".occasions");
    var viewport = section.querySelector(".occasions__viewport");
    var cards = Array.from(section.querySelectorAll(".card"));
    var prev = section.querySelector("[data-card-prev]");
    var next = section.querySelector("[data-card-next]");
    var pause = section.querySelector("[data-card-pause]");
    var count = section.querySelector("[data-card-count]");
    var preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    var index = 0, timer, visible = false, hovered = false, focused = false;
    var paused = preference.matches;
    function target(i) {
      return Math.min(viewport.scrollWidth - viewport.clientWidth,
        Math.max(0, cards[i].offsetLeft - cards[0].offsetLeft));
    }
    function update() {
      var best = Infinity;
      cards.forEach(function (_, i) {
        var distance = Math.abs(target(i) - viewport.scrollLeft);
        if (distance < best) { best = distance; index = i; }
      });
      count.textContent = (index + 1) + " / " + cards.length;
    }
    function cancel() { clearTimeout(timer); }
    function schedule() {
      cancel();
      if (!visible || paused || preference.matches || hovered || focused || document.hidden) return;
      timer = setTimeout(function () { go(index + 1); }, 5000);
    }
    function go(i) {
      index = (i + cards.length) % cards.length;
      viewport.scrollTo({ left: target(index), behavior: preference.matches ? "instant" : "smooth" });
      schedule();
    }
    function pauseLabel() {
      if (!pause) return;
      pause.textContent = paused ? "Retomar" : "Pausar";
      pause.setAttribute("aria-label", paused ? "Retomar passagem automática" : "Pausar passagem automática");
      pause.setAttribute("aria-pressed", String(paused));
    }
    prev.addEventListener("click", function () { go(index - 1); });
    next.addEventListener("click", function () { go(index + 1); });
    if (pause) pause.addEventListener("click", function () { paused = !paused; pauseLabel(); schedule(); });
    viewport.addEventListener("scroll", update, { passive: true });
    viewport.addEventListener("pointerdown", cancel, { passive: true });
    viewport.addEventListener("pointerup", schedule, { passive: true });
    viewport.addEventListener("pointercancel", schedule, { passive: true });
    viewport.addEventListener("keydown", function (event) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      go(event.key === "Home" ? 0 : event.key === "End" ? cards.length - 1 : index + (event.key === "ArrowRight" ? 1 : -1));
    });
    section.addEventListener("pointerenter", function (event) { if (event.pointerType === "mouse") { hovered = true; cancel(); } });
    section.addEventListener("pointerleave", function () { hovered = false; schedule(); });
    section.addEventListener("focusin", function () { focused = true; cancel(); });
    section.addEventListener("focusout", function (event) { focused = section.contains(event.relatedTarget); schedule(); });
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", function () { paused = preference.matches; pauseLabel(); schedule(); });
    window.addEventListener("resize", function () { viewport.scrollTo({ left: target(index), behavior: "instant" }); update(); });
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.3 }).observe(section);
    pauseLabel(); update();
  }

  // Hide native gutters only after the overlay control is ready. Native page
  // scrolling is preserved, including keyboard, wheel, touch and assistive tools.
  function initPageScrollbar() {
    var rail = document.querySelector("[data-page-scrollbar]");
    var thumb = document.querySelector("[data-scroll-thumb]");
    if (!rail || !thumb) return;
    var hideTimer, frame, dragging = false, dragStart = 0, scrollStart = 0;
    var travel = 1, maxScroll = 1;
    function show() {
      rail.classList.add("is-visible");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { if (!dragging) rail.classList.remove("is-visible"); }, 1000);
    }
    function render() {
      frame = null;
      var height = rail.clientHeight;
      maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      var thumbHeight = Math.max(40, height * innerHeight / Math.max(innerHeight, document.documentElement.scrollHeight));
      travel = Math.max(1, height - thumbHeight);
      var progress = maxScroll ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      thumb.style.height = thumbHeight + "px";
      thumb.style.transform = "translateY(" + (progress * travel) + "px)";
      rail.setAttribute("aria-valuenow", Math.round(progress * 100));
    }
    function onScroll() { show(); if (!frame) frame = requestAnimationFrame(render); }
    rail.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      event.preventDefault();
      render(); dragging = true; show(); rail.setPointerCapture(event.pointerId);
      if (event.target !== thumb) {
        var position = event.clientY - rail.getBoundingClientRect().top - thumb.clientHeight / 2;
        window.scrollTo({ top: Math.max(0, Math.min(1, position / travel)) * maxScroll, behavior: "instant" });
      }
      dragStart = event.clientY; scrollStart = scrollY;
    });
    rail.addEventListener("pointermove", function (event) {
      if (dragging) window.scrollTo({ top: scrollStart + (event.clientY - dragStart) / travel * maxScroll, behavior: "instant" });
    });
    function endDrag() { dragging = false; show(); }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    rail.addEventListener("keydown", function (event) {
      var offsets = { ArrowDown: 80, ArrowUp: -80, PageDown: innerHeight * 0.85, PageUp: -innerHeight * 0.85, Home: -Infinity, End: Infinity };
      if (!(event.key in offsets)) return;
      event.preventDefault(); render();
      window.scrollTo({ top: Math.max(0, Math.min(maxScroll, scrollY + offsets[event.key])), behavior: "instant" });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", render);
    window.addEventListener("pointermove", function (event) { if (event.pointerType === "mouse" && event.clientX > innerWidth - 20) show(); }, { passive: true });
    document.documentElement.classList.add("has-overlay-scrollbar");
    render();
  }

  function init() {
    initWhatsAppLinks();
    initYear();
    initHeader();
    initStickyCTA();
    initFAQ();
    initCarousel();
    initPageScrollbar();
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var hash = link.getAttribute("href");
        if (hash === "#" || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        var target = document.getElementById(hash.slice(1));
        if (!target) return;
        event.preventDefault();
        history.pushState(null, "", hash);
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        // Preserve native in-page navigation for keyboard and screen-reader users.
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
          target.addEventListener("blur", function () { target.removeAttribute("tabindex"); }, { once: true });
        }
        target.focus({ preventScroll: true });
      });
    });
    initAnimations();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
