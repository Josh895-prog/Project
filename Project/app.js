/**
 * EcoSphere Initiative - Interactive Frontend Controller
 * Implements hash-based SPA routing, mobile navigation drawer toggling,
 * animated impact counters via IntersectionObserver, and client-side form validation.
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. SINGLE PAGE ROUTING ENGINE ---
    const sections = document.querySelectorAll(".page-section");
    const navLinks = document.querySelectorAll(".nav-link");

    function routePage() {
        const hash = window.location.hash || "#home";

        sections.forEach(section => {
            const isMatch = `#${section.id}` === hash;
            section.classList.toggle("active", isMatch);
            section.setAttribute("aria-hidden", !isMatch);
        });

        navLinks.forEach(link => {
            const isMatch = link.getAttribute("href") === hash;
            link.classList.toggle("active", isMatch);
        });

        // Close mobile menu on page navigate
        closeMobileMenu();

        // Scroll to top of section viewport smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Trigger stats animation if routing directly to About
        if (hash === "#about") {
            triggerStatsAnimation();
        }
    }

    window.addEventListener("hashchange", routePage);

    // Init page state on first load
    if (!window.location.hash) {
        window.location.hash = "#home";
    }
    routePage();


    // --- 2. MOBILE NAVIGATION DRAWER ---
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navbar = document.querySelector(".navbar-wrapper");

    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        navbar.classList.toggle("hamburger-active");
        navToggle.setAttribute("aria-expanded", isOpen);
    });

    function closeMobileMenu() {
        navMenu.classList.remove("open");
        navbar.classList.remove("hamburger-active");
        navToggle.setAttribute("aria-expanded", false);
    }


    // --- 3. DYNAMIC IMPACT COUNTERS ---
    const stats = document.querySelectorAll(".stat-number");
    let statsAnimated = false; // Prevent repeated triggers

    function triggerStatsAnimation() {
        if (statsAnimated) return;
        statsAnimated = true;

        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            const duration = 1500; // Total count duration in ms
            const frameRate = 1000 / 60; // 60 FPS
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;

                // Ease out quad formula for smooth decelerating count
                const easeProgress = progress * (2 - progress);
                const currentVal = Math.round(easeProgress * target);

                stat.textContent = currentVal.toLocaleString();

                if (frame === totalFrames) {
                    clearInterval(counter);
                    // Add standard indicator back if percentage
                    if (stat.getAttribute("data-target") === "95") {
                        stat.textContent += "%";
                    }
                }
            }, frameRate);
        });
    }

    // Trigger counters only when scrolling into viewport
    const statsContainer = document.querySelector(".stats-container");
    if (statsContainer && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerStatsAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(statsContainer);
    }


    // --- 4. SECURE CONTACT FORM VALIDATION ---
    const contactForm = document.getElementById("contact-form");
    const toastSuccess = document.getElementById("toast-success");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;

        // Target input fields
        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        const messageInput = document.getElementById("contact-message");

        // Simple validation checks
        if (!nameInput.value.trim()) {
            showError(nameInput, "name-error");
            isValid = false;
        } else {
            clearError(nameInput, "name-error");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            showError(emailInput, "email-error");
            isValid = false;
        } else {
            clearError(emailInput, "email-error");
        }

        if (!messageInput.value.trim()) {
            showError(messageInput, "message-error");
            isValid = false;
        } else {
            clearError(messageInput, "message-error");
        }

        if (isValid) {
            // Form is safe and complete - trigger toast callback
            showSuccessToast();
            contactForm.reset();
        }
    });

    function showError(input, errorId) {
        const group = input.closest(".form-group");
        if (group) group.classList.add("invalid");
    }

    function clearError(input, errorId) {
        const group = input.closest(".form-group");
        if (group) group.classList.remove("invalid");
    }

    function showSuccessToast() {
        toastSuccess.classList.add("show");

        setTimeout(() => {
            toastSuccess.classList.remove("show");
        }, 4000);
    }


    // --- 5. NEWSLETTER FORM HANDLER ---
    const newsletterForm = document.getElementById("newsletter-form");
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector("input[type='email']");

        if (input && input.value.trim()) {
            alert(`Thank you for subscribing! Impact reports will be sent to: ${input.value}`);
            newsletterForm.reset();
        }
    });
});
