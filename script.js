(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Short helpers
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const safeRegister = (p) => {
    try {
      gsap?.registerPlugin(p);
    } catch {}
  };

  /* ------------------ INIT ------------------ */
  function init() {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    safeRegister(ScrollTrigger);

    if (!prefersReducedMotion) {
      entranceHero();
      revealOnScroll(".artifact-card");
      floatGlobe();
    } else {
      document.body.classList.add("reduced-motion");
    }

    tilt(".card-3d", 10, 18, 900);
    tilt(".artifact-card", 8, 10, 700);
    imageHoverEffects();
    navSmoothScroll();
    keyboardAccessibility();
    tourButton();
  }

  /* ------------------ ENTRADA HERO ------------------ */
  function entranceHero() {
    gsap.from(
      [".hero-left .huge", ".hero-left .lead", ".hero-right .card-3d"],
      {
        y: (i) => [36, 18, 0][i],
        x: (i) => [0, 0, 48][i],
        rotationY: (i) => [0, 0, 16][i],
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: (i) => [0.12, 0.28, 0.36][i],
      }
    );
  }

  /* ------------------ SCROLL REVEAL ------------------ */
  function revealOnScroll(selector) {
    $$(selector).forEach((el) => {
      gsap.from(el, {
        y: 24,
        opacity: 0,
        scale: 0.985,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  }

  /* ------------------ FLOAT GLOBE ------------------ */
  const floatGlobe = () =>
    gsap.to(".globe", {
      y: -18,
      repeat: -1,
      yoyo: true,
      duration: 4.5,
      ease: "sine.inOut",
    });

  /* ------------------ GENERIC TILT ------------------ */
  function tilt(selector, tiltX = 8, tiltY = 12, perspective = 900) {
    $$(selector).forEach((el) => {
      let raf, lastEvent;

      function update() {
        raf = null;
        const r = el.getBoundingClientRect();
        const px = (lastEvent.clientX - r.left) / r.width;
        const py = (lastEvent.clientY - r.top) / r.height;

        gsap.to(el, {
          rotationX: (py - 0.5) * tiltX,
          rotationY: (px - 0.5) * -tiltY,
          duration: 0.35,
          ease: "power2.out",
          transformPerspective: perspective,
        });
      }

      el.addEventListener("pointermove", (e) => {
        lastEvent = e;
        if (!raf) raf = requestAnimationFrame(update);
      });

      el.addEventListener("pointerleave", () =>
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.55,
          ease: "elastic.out(1, 0.6)",
        })
      );
    });
  }

  /* ------------------ IMAGE HOVER (GSAP) ------------------ */
  function imageHoverEffects() {
    $$(".artifact-card").forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;

      card.addEventListener("mouseenter", () => {
        gsap.to(img, {
          scale: 1.18,
          rotateZ: 1,
          duration: 0.45,
          ease: "power3.out",
          filter: "brightness(1.15) contrast(1.1)",
        });

        gsap.to(card, {
          scale: 1.03,
          duration: 0.45,
          ease: "power3.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to([img, card], {
          scale: 1,
          rotateZ: 0,
          filter: "brightness(1) contrast(1)",
          duration: 0.45,
          ease: "power3.inOut",
        });
      });
    });
  }

  /* ------------------ SMOOTH NAV ------------------ */
  function navSmoothScroll() {
    $$(".nav-links a").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href?.startsWith("#")) return;

        e.preventDefault();
        const target = $(href);
        if (!target) return;

        target.scrollIntoView({ behavior: "smooth", block: "start" });

        setTimeout(() => {
          target.setAttribute("tabindex", "-1");
          target.focus();
        }, 600);
      });
    });
  }

  /* ------------------ ACCESSIBILITY ------------------ */
  function keyboardAccessibility() {
    $$(".artifact").forEach((art) => {
      art.addEventListener("keydown", (ev) => {
        if (ev.key !== "Enter" && ev.key !== " ") return;

        ev.preventDefault();
        const card = art.querySelector(".artifact-card");
        if (!card) return;

        gsap.fromTo(
          card,
          { scale: 0.985 },
          {
            scale: 1.02,
            duration: 0.18,
            repeat: 1,
            yoyo: true,
            ease: "power1.inOut",
          }
        );
      });
    });
  }

  /* ------------------ BUTTON BEHAVIOR ------------------ */
  function tourButton() {
    const btn = $("#tourBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      gsap.fromTo(
        btn,
        { scale: 0.98 },
        { scale: 1.04, duration: 0.12, repeat: 1, yoyo: true }
      );
      alert("Thanks! This tour is simulated in this demo.");
    });
  }

  /* ------------------ DOM READY ------------------ */
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
