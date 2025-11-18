(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function safeRegister(plugin) {
    try {
      if (gsap?.registerPlugin) gsap.registerPlugin(plugin);
    } catch {}
  }

  /* ------------------ INIT ------------------ */
  function init() {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    safeRegister(ScrollTrigger);

    if (!prefersReducedMotion) {
      entrance();
      animateArtifacts();
      floatGlobe();
    } else {
      document.body.classList.add("reduced-motion");
    }

    heroCardTilt();
    artifactTilt();
    artifactImageHover(); // 🔥 NUEVO: efecto GSAP mejorado en hover
    navSmoothScroll();
    keyboardAccessibility();
    tourButton();
  }

  /* ------------------ ENTRADA HERO ------------------ */
  function entrance() {
    gsap.from(".hero-left .huge", {
      y: 36,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.12,
    });

    gsap.from(".hero-left .lead", {
      y: 18,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.28,
    });

    gsap.from(".hero-right .card-3d", {
      rotationY: 16,
      x: 48,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      delay: 0.36,
    });
  }

  /* ------------------ ARTIFACTS SCROLL ------------------ */
  function animateArtifacts() {
    $$(".artifact-card").forEach((card) => {
      gsap.from(card, {
        y: 24,
        opacity: 0,
        scale: 0.985,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      });
    });
  }

  /* ------------------ GLOBE FLOAT ------------------ */
  function floatGlobe() {
    gsap.to(".globe", {
      y: -18,
      repeat: -1,
      yoyo: true,
      duration: 4.5,
      ease: "sine.inOut",
    });
  }

  /* ------------------ HERO CARD TILT ------------------ */
  function heroCardTilt() {
    const card = $(".card-3d");
    if (!card) return;

    let raf = null;
    let last = null;

    function move(e) {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;

        const rect = card.getBoundingClientRect();
        const px = (last.clientX - rect.left) / rect.width;
        const py = (last.clientY - rect.top) / rect.height;

        const rx = (py - 0.5) * 10;
        const ry = (px - 0.5) * -18;

        gsap.to(card, {
          rotationX: rx,
          rotationY: ry,
          duration: 0.44,
          ease: "power3.out",
          transformPerspective: 900,
        });
      });
    }

    function reset() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.6)",
      });
    }

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
  }

  /* ------------------ ARTIFACT CARDS TILT ------------------ */
  function artifactTilt() {
    const items = $$(".artifact-card");

    items.forEach((el) => {
      let raf = null;
      let last = null;

      const onMove = (ev) => {
        last = ev;
        if (raf) return;

        raf = requestAnimationFrame(() => {
          raf = null;

          const rect = el.getBoundingClientRect();
          const px = (last.clientX - rect.left) / rect.width;
          const py = (last.clientY - rect.top) / rect.height;

          const rx = (py - 0.5) * 8;
          const ry = (px - 0.5) * -10;

          gsap.to(el, {
            rotationX: rx,
            rotationY: ry,
            duration: 0.34,
            ease: "power1.out",
            transformOrigin: "center",
          });
        });
      };

      const onLeave = () =>
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.56,
          ease: "elastic.out(1, 0.6)",
        });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointercancel", onLeave);

      // Focus animations
      el.addEventListener("focus", () =>
        gsap.to(el, { scale: 1.02, duration: 0.24, ease: "power2.out" })
      );
      el.addEventListener("blur", () =>
        gsap.to(el, { scale: 1, duration: 0.24, ease: "power2.out" })
      );
    });
  }

  /* ------------------ 🔥 GSAP HOVER ------------------ */
  function artifactImageHover() {
    $$(".artifact-card").forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;

      card.addEventListener("mouseenter", () => {
        gsap.to(img, {
          scale: 1.22,
          rotateX: 7,
          rotateY: -7,
          rotateZ: 1,
          duration: 0.45,
          ease: "power3.out",
          filter: "brightness(1.15) contrast(1.08)",
          boxShadow: "0 0 2.5rem rgba(255,255,255,0.28)",
        });

        gsap.to(card, {
          scale: 1.03,
          duration: 0.45,
          ease: "power3.out",
          transformPerspective: 700,
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to([img, card], {
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          filter: "brightness(1) contrast(1)",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.45,
          ease: "power3.inOut",
        });
      });
    });
  }

  /* ------------------ SMOOTH NAV ------------------ */
  function navSmoothScroll() {
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
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
        if (ev.key === "Enter" || ev.key === " ") {
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
        }
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
        { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1 }
      );

      alert("Thanks! This tour is simulated in this demo.");
    });
  }

  /* ------------------ DOM READY ------------------ */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
