/* =========================================================
   PRAKHAR VARSHNEY — VANILLA JAVASCRIPT
   Custom cursor, mobile menu, reveal, active nav, 3D tilt
   ========================================================= */
const cursor = document.getElementById("cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Custom cursor */
if (cursor && finePointer.matches) {
    document.body.classList.add("has-custom-cursor");

    window.addEventListener("mousemove", (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        cursor.classList.add("cursor-visible");
    }, { passive: true });

    document.addEventListener("mouseleave", () => cursor.classList.remove("cursor-visible"));
    document.addEventListener("mouseenter", () => cursor.classList.add("cursor-visible"));

    document.querySelectorAll("a, button, .skill__badge, .projects__card").forEach((element) => {
        element.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
        element.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
    });
}

/* Mobile navigation */
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

function closeMenu() {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove("show-menu");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navToggle.innerHTML = '<i class="ri-menu-3-line"></i>';
}

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("show-menu");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        navToggle.innerHTML = isOpen
            ? '<i class="ri-close-line"></i>'
            : '<i class="ri-menu-3-line"></i>';
    });

    navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) closeMenu();
    });
}

/* Scroll reveal — no external ScrollReveal dependency */
const revealElements = document.querySelectorAll(".reveal");
if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
    document.documentElement.classList.add("js-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealElements.forEach((element, index) => {
        if (element.closest(".projects__container")) {
            element.style.transitionDelay = `${(index % 2) * 120}ms`;
        }
        revealObserver.observe(element);
    });
}

/* Hero 3D tilt */
const heroCard = document.getElementById("hero-card");
if (heroCard && finePointer.matches && !reducedMotion.matches) {
    const visual = heroCard.closest(".home__visual");

    visual.addEventListener("mousemove", (event) => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroCard.style.transform =
            `rotateY(${-12 + x * 15}deg) rotateX(${5 - y * 12}deg)`;
    });

    visual.addEventListener("mouseleave", () => {
        heroCard.style.transform = "";
    });
}

/* Subtle 3D project card tilt */
if (finePointer.matches && !reducedMotion.matches) {
    document.querySelectorAll(".projects__card").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            card.style.transform =
                `perspective(1000px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 3}deg) translateY(-3px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* Active navigation link based on visible section */
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav__link");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active-link", isActive);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
}

/* Dynamic copyright year */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
