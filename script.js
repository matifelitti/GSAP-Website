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

  function init() {
    // Year
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();

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
    navSmoothScroll();
    keyboardAccessibility();
    tourButton();
  }

  /* Entrance animations */
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

  /* Scroll reveal for artifact cards */
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

  /* Floating globe */
  function floatGlobe() {
    gsap.to(".globe", {
      y: -18,
      repeat: -1,
      yoyo: true,
      duration: 4.5,
      ease: "sine.inOut",
    });
  }

  /* Hero card tilt */
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
        const r = card.getBoundingClientRect();
        const px = (last.clientX - r.left) / r.width;
        const py = (last.clientY - r.top) / r.height;
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

  /* Artifacts tilt */
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

      el.addEventListener("focus", () =>
        gsap.to(el, { scale: 1.02, duration: 0.24, ease: "power2.out" })
      );
      el.addEventListener("blur", () =>
        gsap.to(el, { scale: 1, duration: 0.24, ease: "power2.out" })
      );
    });
  }

  /* Smooth nav scrolling */
  function navSmoothScroll() {
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(
          () => target.setAttribute("tabindex", "-1") && target.focus(),
          600
        );
      });
    });
  }

  /* Keyboard shortcuts / accessibility */
  function keyboardAccessibility() {
    $$(".artifact").forEach((art) => {
      art.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          const card = art.querySelector(".artifact-card");
          if (card) {
            gsap.fromTo(
              card,
              { scale: 0.985 },
              {
                scale: 1.02,
                duration: 0.18,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
              }
            );
          }
        }
      });
    });
  }

  /* Dummy tour button behaviour */
  function tourButton() {
    const btn = document.getElementById("tourBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      // simple animated feedback
      gsap.fromTo(
        btn,
        { scale: 0.98 },
        {
          scale: 1.04,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        }
      );
      alert("Thanks! Tour requests are simulated in this demo.");
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
