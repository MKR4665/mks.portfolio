const body = document.body;
const loader = document.querySelector("#loader");
const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const root = document.documentElement;

window.addEventListener("load", () => setTimeout(() => loader?.classList.add("hide"), 350));

if (localStorage.getItem("theme") === "dark") body.classList.add("dark");
if (localStorage.getItem("theme") === "light") body.classList.remove("dark");
themeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
});

menuToggle?.addEventListener("click", () => navLinks?.classList.toggle("open"));
navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) navLinks.classList.remove("open");
});

const roles = (document.querySelector("#typing")?.dataset.roles || "").split("|").filter(Boolean);
let roleIndex = 0;
let letterIndex = 0;
let deleting = false;
function typeLoop() {
  const target = document.querySelector("#typing");
  if (!target || roles.length === 0) return;
  const word = roles[roleIndex];
  target.textContent = word.slice(0, letterIndex);
  if (!deleting && letterIndex++ === word.length) {
    deleting = true;
    setTimeout(typeLoop, 1000);
    return;
  }
  if (deleting && letterIndex-- === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

const aboutTyping = document.querySelector("[data-about-typing]");
if (aboutTyping) {
  const roleText = aboutTyping.dataset.role || "";
  let aboutIndex = 0;
  function typeAboutRole() {
    if (!roleText) return;
    aboutTyping.textContent = roleText.slice(0, aboutIndex);
    aboutIndex = aboutIndex >= roleText.length ? 0 : aboutIndex + 1;
    setTimeout(typeAboutRole, aboutIndex === 0 ? 900 : 70);
  }
  typeAboutRole();
}

document.querySelectorAll("[data-hero-slider]").forEach((slider) => {
  const slides = [...slider.querySelectorAll(".hero-slide")];
  const dots = [...slider.querySelectorAll("[data-hero-dots] button")];
  const progress = slider.querySelector(".hero-progress span");
  const intervalMs = 4200;
  let timer;
  let index = 0;
  const showSlide = (nextIndex) => {
    slides[index].classList.remove("active");
    dots[index]?.classList.remove("active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("active");
    dots[index]?.classList.add("active");
    if (progress) {
      progress.style.animation = "none";
      progress.offsetHeight;
      progress.style.animation = `heroProgress ${intervalMs}ms linear`;
    }
  };
  const start = () => {
    if (slides.length < 2) return;
    clearInterval(timer);
    timer = setInterval(() => showSlide(index + 1), intervalMs);
    if (progress) progress.style.animation = `heroProgress ${intervalMs}ms linear`;
  };
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showSlide(dotIndex);
      start();
    });
  });
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", start);
  start();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      entry.target.querySelectorAll("[data-count]").forEach((counter) => animateCounter(counter));
      entry.target.querySelectorAll("[data-skill-ring]").forEach((ring) => animateSkillRing(ring));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
const journeyTracks = [...document.querySelectorAll("[data-journey-track]")];
updateJourneyProgress();
window.addEventListener("scroll", updateJourneyProgress, { passive: true });
window.addEventListener("resize", updateJourneyProgress);

function animateCounter(counter) {
  if (counter.dataset.done) return;
  counter.dataset.done = "1";
  const max = Number(counter.dataset.count || 0);
  let current = 0;
  const step = Math.max(1, Math.ceil(max / 36));
  const timer = setInterval(() => {
    current += step;
    if (current >= max) {
      counter.textContent = `${max}+`;
      clearInterval(timer);
    } else {
      counter.textContent = current;
    }
  }, 28);
}

function animateSkillRing(ring) {
  if (ring.dataset.done) return;
  ring.dataset.done = "1";
  const max = Math.max(0, Math.min(100, Number(ring.dataset.value || 0)));
  const card = ring.closest(".skill-card");
  const percent = card?.querySelector("[data-skill-percent]");
  let current = 0;
  const step = Math.max(1, Math.ceil(max / 34));
  const timer = setInterval(() => {
    current += step;
    if (current >= max) {
      current = max;
      clearInterval(timer);
    }
    ring.style.setProperty("--value", current);
    card?.style.setProperty("--value", current);
    if (percent) percent.textContent = `${current}%`;
  }, 24);
}

function updateJourneyProgress() {
  journeyTracks.forEach((track) => {
    const rect = track.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const start = viewport * 0.78;
    const end = viewport * 0.22;
    const progress = (start - rect.top) / (start - end + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    track.style.setProperty("--line-fill", `${Math.round(clamped * 100)}%`);

    track.querySelectorAll(".journey-item").forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      item.classList.toggle("is-lit", itemRect.top < viewport * 0.78);
    });
  });
}

document.querySelector("#projectFilters")?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  
  const buttons = document.querySelectorAll("#projectFilters button");
  buttons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  
  const filter = button.dataset.filter;
  const cards = document.querySelectorAll(".project-card");
  
  let visibleCount = 0;
  const cardsToHide = [];
  const cardsToShow = [];
  
  cards.forEach((card) => {
    const isMatch = filter === "All" || card.dataset.category === filter;
    if (isMatch) {
      cardsToShow.push(card);
      visibleCount++;
    } else {
      cardsToHide.push(card);
    }
  });
  
  const countSpan = document.querySelector("[data-project-count]");
  if (countSpan) countSpan.textContent = visibleCount;
  
  // Fade out non-matching cards
  cardsToHide.forEach((card) => {
    card.classList.add("fade-out");
  });
  
  // Wait for fade-out transition, then toggle display and fade-in matching ones
  setTimeout(() => {
    cardsToHide.forEach((card) => {
      card.style.display = "none";
    });
    
    cardsToShow.forEach((card, index) => {
      card.style.display = "flex";
      card.classList.add("fade-out");
      
      // Trigger layout reflow
      card.offsetHeight;
      
      // Staggered trigger to animate in
      setTimeout(() => {
        card.classList.remove("fade-out");
      }, index * 65);
    });
  }, 300);
});

// Premium Card Hover Tilt Effect
function initCardTilt() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const angleX = (yc - y) / 20; // Tilt angle X-axis
      const angleY = (x - xc) / 20; // Tilt angle Y-axis
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
initCardTilt();

const teamCards = [...document.querySelectorAll(".team-card")];
if (teamCards.length) {
  const animateTeamCards = (time) => {
    teamCards.forEach((card, index) => {
      const glow = 0.12 + (Math.sin(time / 900 + index * 0.75) + 1) * 0.055;
      card.style.setProperty("--team-glow", glow.toFixed(3));
    });
    requestAnimationFrame(animateTeamCards);
  };
  requestAnimationFrame(animateTeamCards);
}

const testimonialSlider = document.querySelector("[data-testimonial-slider]");
if (testimonialSlider) {
  const track = testimonialSlider.querySelector("[data-testimonial-track]");
  const cards = [...testimonialSlider.querySelectorAll(".testimonial-card")];
  const dots = [...testimonialSlider.querySelectorAll("[data-testimonial-dot]")];
  const prev = document.querySelector("[data-testimonial-prev]");
  const next = document.querySelector("[data-testimonial-next]");
  let testimonialIndex = 0;
  let testimonialTimer;

  if (!cards.length) {
    testimonialSlider.classList.add("is-empty");
  } else {
    const moveTestimonial = () => {
      if (!track || !cards.length) return;
      const gap = Number.parseFloat(getComputedStyle(track).gap || "0");
      const step = cards[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(${-testimonialIndex * step}px)`;
      cards.forEach((card, index) => card.classList.toggle("active", index === testimonialIndex));
      dots.forEach((dot, index) => dot.classList.toggle("active", index === testimonialIndex));
    };

    const showTestimonial = (index) => {
      testimonialIndex = (index + cards.length) % cards.length;
      moveTestimonial();
    };

    const startTestimonials = () => {
      clearInterval(testimonialTimer);
      if (cards.length > 1) {
        testimonialTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 3800);
      }
    };

    prev?.addEventListener("click", () => {
      showTestimonial(testimonialIndex - 1);
      startTestimonials();
    });
    next?.addEventListener("click", () => {
      showTestimonial(testimonialIndex + 1);
      startTestimonials();
    });
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showTestimonial(index);
        startTestimonials();
      });
    });
    window.addEventListener("resize", moveTestimonial);
    testimonialSlider.addEventListener("mouseenter", () => clearInterval(testimonialTimer));
    testimonialSlider.addEventListener("mouseleave", startTestimonials);
    moveTestimonial();
    startTestimonials();
  }
}

document.addEventListener("pointermove", (event) => {
  root.style.setProperty("--mx", `${event.clientX}px`);
  root.style.setProperty("--my", `${event.clientY}px`);
  document.querySelectorAll(".parallax").forEach((item) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });
});

const contactForm = document.querySelector("#contactForm");
if (contactForm) {
  const locationStatus = document.querySelector("[data-location-status]");
  const latInput = contactForm.querySelector("[data-visitor-lat]");
  const lngInput = contactForm.querySelector("[data-visitor-lng]");
  const accuracyInput = contactForm.querySelector("[data-visitor-accuracy]");

  if ("geolocation" in navigator) {
    locationStatus.textContent = "Requesting visitor location...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latInput.value = position.coords.latitude.toFixed(7);
        lngInput.value = position.coords.longitude.toFixed(7);
        accuracyInput.value = Math.round(position.coords.accuracy || 0);
        locationStatus.textContent = "Location attached with your message.";
      },
      () => {
        locationStatus.textContent = "Location not shared. Message can still be sent.";
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 }
    );
  } else {
    locationStatus.textContent = "Location is not supported in this browser.";
  }
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#formStatus");
  const endpoint = form.dataset.apiEndpoint || "/api/contact.php";
  status.textContent = "Sending...";
  status.className = "form-status";

  try {
    // This replaces the old PHP-rendered contact submit with a static frontend fetch() call.
    const response = await fetch(endpoint, { method: "POST", body: new FormData(form) });
    const data = await response.json();
    status.textContent = data.message || "Done";
    status.className = `form-status ${data.ok ? "success" : "error"}`;
    if (data.ok) form.reset();
  } catch (error) {
    status.textContent = "Could not send message. Please try again later.";
    status.className = "form-status error";
  }
});
