// Año en el footer
document.getElementById("year").textContent = new Date().getFullYear();

// Fondo de respaldo si alguna foto no carga
document.querySelectorAll("img").forEach((img) => {
  if (img.complete && img.naturalWidth === 0 && img.src) img.classList.add("img-fallback");
  img.addEventListener("error", () => img.classList.add("img-fallback"), { once: true });
});

// Navegación: fondo al hacer scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menú móvil
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Filtro del menú
const tabs = document.querySelectorAll(".tab");
const dishes = document.querySelectorAll(".dish");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    const filter = tab.dataset.filter;
    dishes.forEach((d) =>
      d.classList.toggle("is-hidden", filter !== "all" && d.dataset.cat !== filter)
    );
  })
);

// Lightbox de la galería
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = '<button class="lightbox__close" aria-label="Cerrar">&times;</button><img alt="">';
document.body.appendChild(lightbox);
const lbImg = lightbox.querySelector("img");
document.querySelectorAll(".gallery__grid img").forEach((img) =>
  img.addEventListener("click", () => {
    lbImg.src = img.src.replace(/w=\d+/, "w=1600");
    lbImg.alt = img.alt;
    lightbox.classList.add("is-open");
  })
);
const closeLb = () => lightbox.classList.remove("is-open");
lightbox.addEventListener("click", closeLb);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeLb());

// Animación al aparecer
const revealEls = document.querySelectorAll(".section__head, .about__grid, .dish, .gallery__grid img, .review, .reserve__grid, .contact__card");
revealEls.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// Formulario de reservas
const fecha = document.getElementById("fecha");
fecha.min = new Date().toISOString().split("T")[0];

const form = document.getElementById("reserveForm");
const msg = document.getElementById("formMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== "";
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    msg.textContent = "Por favor, completa todos los campos obligatorios.";
    msg.className = "form__msg err";
    return;
  }
  const data = new FormData(form);
  msg.textContent = `Grazie, ${data.get("nombre")}! Tu mesa para ${data.get("personas")} el ${data.get("fecha")} a las ${data.get("hora")} está solicitada. Te confirmaremos por email.`;
  msg.className = "form__msg ok";
  form.reset();
});
