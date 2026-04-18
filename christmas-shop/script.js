/* --- BURGER MENU LOGIC --- */
const burgerBtn = document.getElementById('burgerBtn');
const navMobile = document.querySelector('.nav-mobile');
const body = document.body;
const navLinks = document.querySelectorAll('.nav-mobile .nav__link');

function toggleMenu() {
    if (burgerBtn && navMobile) {
        burgerBtn.classList.toggle('open');
        navMobile.classList.toggle('open');
        body.classList.toggle('no-scroll');
    }
}

if (burgerBtn) {
    burgerBtn.addEventListener('click', toggleMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMobile && navMobile.classList.contains('open')) {
            toggleMenu();
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMobile && navMobile.classList.contains('open')) {
        toggleMenu();
    }
});

/* --- NEW YEAR TIMER LOGIC --- */
const dVal = document.getElementById('cd-days');
const hVal = document.getElementById('cd-hours');
const mVal = document.getElementById('cd-mins');
const sVal = document.getElementById('cd-secs');

function updateTimer() {
    if (!dVal) return;

    const now = new Date();
    // Target: January 1st of the next year, 00:00:00 UTC
    const nextYear = now.getUTCFullYear() + 1;
    const newYearDate = Date.UTC(nextYear, 0, 1, 0, 0, 0);
    const currentTime = now.getTime();
    
    const diff = newYearDate - currentTime;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        dVal.textContent = days;
        hVal.textContent = hours;
        mVal.textContent = minutes;
        sVal.textContent = seconds;
    } else {
        dVal.textContent = '0';
        hVal.textContent = '0';
        mVal.textContent = '0';
        sVal.textContent = '0';
    }
}

if (dVal) {
    setInterval(updateTimer, 1000);
    updateTimer();
}

/* --- SCROLL TO TOP LOGIC --- */
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && window.scrollY > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --- SLIDER LOGIC --- */
const sliderTrack = document.querySelector('.slider__track');
const btnPrev = document.getElementById('sliderPrev');
const btnNext = document.getElementById('sliderNext');

let currentStep = 0;
// Max steps: 3 for desktop, 6 for mobile
const getMaxSteps = () => (window.innerWidth <= 768 ? 6 : 3);

function updateSlider() {
    const maxSteps = getMaxSteps();
    
    // Calculate total width to scroll
    const scrollWidth = sliderTrack.scrollWidth - sliderTrack.parentElement.clientWidth;
    const stepWidth = scrollWidth / maxSteps;

    // Apply transformation
    sliderTrack.style.transform = `translateX(-${currentStep * stepWidth}px)`;

    // Update buttons state
    btnPrev.disabled = currentStep === 0;
    btnNext.disabled = currentStep === maxSteps;
}

if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
        if (currentStep < getMaxSteps()) {
            currentStep++;
            updateSlider();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateSlider();
        }
    });

    // Requirement: Reset slider on resize
    window.addEventListener('resize', () => {
        currentStep = 0;
        updateSlider();
    });
}

