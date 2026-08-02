/*
==========================================
Flowerstrap Website
main.js
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       Mouse Glow
    ========================== */

    const glow = document.getElementById("mouse-glow");

    document.addEventListener("mousemove", e => {

        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;

    });


    /* ==========================
       Navbar Scroll Effect
    ========================== */

    const nav = document.querySelector("nav");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            nav.style.background = "rgba(20,15,35,.82)";
            nav.style.backdropFilter = "blur(30px)";
            nav.style.borderColor = "rgba(255,255,255,.18)";
            nav.style.boxShadow = "0 15px 40px rgba(0,0,0,.25)";

        } else {

            nav.style.background = "";
            nav.style.boxShadow = "";

        }

    });


    /* ==========================
       Fade In
    ========================== */

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    }, {

        threshold: .15

    });

    document.querySelectorAll(".feature-card,.section-title,.hero-left,.hero-right")
        .forEach(el => {

            el.classList.add("hidden");

            observer.observe(el);

        });


    /* ==========================
       Dropdown
    ========================== */

    const button = document.getElementById("pagesButton");
    const menu = document.querySelector(".dropdown-menu");

    button.addEventListener("click", e => {

        e.stopPropagation();

        menu.classList.toggle("open");

    });

    document.addEventListener("click", () => {

        menu.classList.remove("open");

    });


    /* ==========================
       Hero Parallax
    ========================== */

    const hero = document.querySelector(".hero");

    window.addEventListener("scroll", () => {

        const y = window.scrollY;

        hero.style.transform = `translateY(${y * .08}px)`;

    });


    /* ==========================
       Floating Preview Card
    ========================== */

    const card = document.querySelector(".preview-card");

    let time = 0;

    function animateCard(){

        time += .02;

        const y = Math.sin(time) * 10;

        const rotate = Math.sin(time/2) * 2;

        card.style.transform =
        `translateY(${y}px) rotate(${rotate}deg)`;

        requestAnimationFrame(animateCard);

    }

    animateCard();


    /* ==========================
       Download Button Ripple
    ========================== */

    const download = document.querySelector(".download-btn");

    download.addEventListener("click", e => {

        const ripple = document.createElement("span");

        ripple.className = "ripple";

        ripple.style.left = `${e.offsetX}px`;
        ripple.style.top = `${e.offsetY}px`;

        download.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        },700);

    });


    /* ==========================
       Feature Card Tilt
    ========================== */

    document.querySelectorAll(".feature-card").forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = -(y - rect.height/2)/18;
            const rotateY = (x - rect.width/2)/18;

            card.style.transform =
            `perspective(700px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-8px)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });


    /* ==========================
       Active Navigation
    ========================== */

    const sections = document.querySelectorAll("section");

    const links = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            if (window.scrollY >= section.offsetTop - 180){

                current = section.id;

            }

        });

        links.forEach(link => {

            link.classList.remove("active");

            if(link.getAttribute("href") === `#${current}`){

                link.classList.add("active");

            }

        });

    });

});
