/* GIMNASIO MIGUEL ÁNGEL — interacción ligera, sin dependencias */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var header = document.getElementById("header");
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  /* Cabecera con fondo al hacer scroll */
  function onScroll() {
    if (header && !header.classList.contains("header--solid")) {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menú móvil */
  function closeMenu() {
    if (!header || !burger) return;
    header.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  }
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = !header.classList.contains("is-open");
      header.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  /* Aparición suave de bloques al hacer scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Enlace activo del menú según la sección visible */
  var links = document.querySelectorAll('.nav__list a[href^="#"]');
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (link && entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* Visor de imágenes de la galería */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lightbox__caption");
    document.querySelectorAll(".gallery__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        lbImg.src = btn.getAttribute("data-full");
        lbImg.alt = img ? img.alt : "";
        lbCap.textContent = btn.getAttribute("data-caption") || "";
        lb.showModal();
      });
    });
    lb.querySelector(".lightbox__close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", function () { lbImg.src = ""; });
  } else {
    /* Navegadores sin <dialog>: abrir la imagen directamente */
    document.querySelectorAll(".gallery__btn").forEach(function (btn) {
      btn.addEventListener("click", function () { window.open(btn.getAttribute("data-full"), "_blank", "noopener"); });
    });
  }

  /* Mostrar el texto del botón flotante unos segundos tras cargar */
  var wa = document.querySelector(".wa-float");
  if (wa) {
    setTimeout(function () {
      wa.classList.add("show-tip");
      setTimeout(function () { wa.classList.remove("show-tip"); }, 5000);
    }, 3500);
  }

  /* Año del pie */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
