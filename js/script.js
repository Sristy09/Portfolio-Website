/* ============================================================
   Shared site behavior: contour art, typing role, nav, reveals
   ============================================================ */

/* ---- Contour line generator ----
   Draws topographic-style wavy horizontal lines into any element
   with [data-contour]. Options via data attributes:
   data-contour="field"   -> full background field, many lines
   data-contour="divider" -> single thin divider between sections
*/
/* ============================================================
   Shared site behavior: contour art, typing role, nav, reveals
   ============================================================ */

/* ---- Contour line generator ---- */
function buildContourSVG(kind) {
  const rows = kind === "divider" ? 3 : 11;
  const width = 1200;
  const height = kind === "divider" ? 34 : 700;
  const spacing = height / (rows + 1);
  let paths = "";

  for (let r = 1; r <= rows; r++) {
    const baseY = spacing * r;
    const amp = kind === "divider" ? 5 + r * 1.4 : 10 + Math.sin(r) * 14 + r * 2.2;
    const freq = kind === "divider" ? 0.010 : 0.006 + (r % 3) * 0.0015;
    const phase = r * 0.9;

    let d = `M 0 ${baseY}`;
    for (let x = 0; x <= width; x += 20) {
      const y =
        baseY +
        Math.sin(x * freq + phase) *
        amp *
        Math.sin((r / rows) * Math.PI);

      d += ` L ${x} ${y.toFixed(1)}`;
    }

    const isAccent = kind !== "divider" && r % 4 === 0;
    paths += `<path class="${isAccent ? "accent" : ""}" d="${d}"></path>`;
  }

  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

function renderContours() {
  document.querySelectorAll("[data-contour]").forEach((el) => {
    el.innerHTML = buildContourSVG(el.dataset.contour);
  });
}

/* ---- Typing role rotator ---- */
function initTyping() {
  const el = document.getElementById("typing");
  if (!el) return;

  const roles = [
    "Web Developer",
    "Data Analyst",
    "AI / ML Enthusiast"
  ];

  let i = 0;
  let j = 0;
  let deleting = false;

  function tick() {
    const current = roles[i];

    j += deleting ? -1 : 1;
    el.textContent = current.substring(0, j);

    let delay = deleting ? 45 : 90;

    if (!deleting && j === current.length) {
      deleting = true;
      delay = 1400;
    } else if (deleting && j === 0) {
      deleting = false;
      i = (i + 1) % roles.length;
      delay = 300;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ---- Mobile nav toggle ---- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  const path = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a[href]").forEach((a) => {
    if (a.getAttribute("href") === path) {
      a.classList.add("active");
    }
  });
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
}

/* ============================================================
   THEME SYSTEM (FIXED + GLOBAL + SAFE)
   ============================================================ */
function initTheme() {
  // Apply saved theme first (works on ALL pages)
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeToggle = document.getElementById("themeToggle");

  function updateIcon(theme) {
    if (!themeToggle) return;

    themeToggle.innerHTML =
      theme === "dark"
        ? '<i class="bi bi-moon-stars-fill"></i>'
        : '<i class="bi bi-sun-fill"></i>';
  }

  updateIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const newTheme = current === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      updateIcon(newTheme);
    });
  }
}

/* ---- INIT ALL ---- */
document.addEventListener("DOMContentLoaded", () => {
  renderContours();
  initTyping();
  initNav();
  initReveal();
  initTheme();
});