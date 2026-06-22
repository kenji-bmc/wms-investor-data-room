/* =====================================================================
   World Mobile Stratospheric — Investor Data Room Gateway
   Progressive enhancement only. The page is fully functional without JS.
   ===================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Smooth scroll for in-page CTAs ---------- */
  document.querySelectorAll('a[data-scroll], a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.charAt(0) !== "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
      // move focus for accessibility without an extra scroll jump
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Number formatting ---------- */
  function formatNumber(value, mode) {
    if (mode === "compact") {
      if (value >= 1000) return Math.round(value / 1000) + "K";
      return String(value);
    }
    return Math.round(value).toLocaleString("en-US");
  }

  /* ---------- Count-up ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var mode = el.getAttribute("data-format");
    if (isNaN(target)) return;
    if (prefersReduced) {
      el.textContent = formatNumber(target, mode);
      return;
    }
    var duration = 1600;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = formatNumber(target * eased, mode);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, mode);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal + triggered effects via IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var counted = false;
  var gaugeArmed = false;

  function armGauge() {
    if (gaugeArmed) return;
    var gauge = document.querySelector(".gauge");
    if (gauge) gauge.classList.add("is-live");
    var altValue = document.querySelector(".hud__alt-value [data-count]");
    if (altValue) countUp(altValue);
    gaugeArmed = true;
  }

  function runStatCount() {
    if (counted) return;
    document.querySelectorAll(".statband [data-count]").forEach(countUp);
    counted = true;
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");

          if (entry.target.classList.contains("statband")) runStatCount();
          if (entry.target.classList.contains("hud")) armGauge();

          io.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    runStatCount();
    armGauge();
  }

  /* Arm hero pieces shortly after load even if already in view */
  window.addEventListener("load", function () {
    var hud = document.querySelector(".hud");
    if (hud && hud.getBoundingClientRect().top < window.innerHeight) {
      setTimeout(armGauge, prefersReduced ? 0 : 500);
    }
  });
})();
