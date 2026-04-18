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

/* --- NAVIGATION ACTIVE STATE LOGIC --- */
function initNavigation() {
    const allNavLinks = document.querySelectorAll('.nav__link');
    const currentPath = window.location.pathname;

    // 1. Highlight active page (e.g., Gifts) on load
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href !== '#' && href !== '' && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });

    // 2. Handle clicks for anchor links (About, Best, Contacts)
    allNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            allNavLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/* --- NEW YEAR TIMER LOGIC --- */
const dVal = document.getElementById('cd-days');
const hVal = document.getElementById('cd-hours');
const mVal = document.getElementById('cd-mins');
const sVal = document.getElementById('cd-secs');

function updateTimer() {
    if (!dVal) return;

    const now = new Date();
    const nextYear = now.getUTCFullYear() + 1;
    const newYearDate = Date.UTC(nextYear, 0, 1, 0, 0, 0);
    const currentTime = now.getTime();
    const diff = newYearDate - currentTime;

    if (diff > 0) {
        dVal.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
        hVal.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
        mVal.textContent = Math.floor((diff / (1000 * 60)) % 60);
        sVal.textContent = Math.floor((diff / 1000) % 60);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- SLIDER LOGIC --- */
const sliderTrack = document.querySelector('.slider__track');
const btnPrev = document.getElementById('sliderPrev');
const btnNext = document.getElementById('sliderNext');

let currentStep = 0;
const getMaxSteps = () => (window.innerWidth <= 768 ? 6 : 3);

function updateSlider() {
    if (!sliderTrack) return;
    const maxSteps = getMaxSteps();
    const scrollWidth = sliderTrack.scrollWidth - sliderTrack.parentElement.clientWidth;
    const stepWidth = scrollWidth / maxSteps;

    sliderTrack.style.transform = `translateX(-${currentStep * stepWidth}px)`;

    if (btnPrev && btnNext) {
        btnPrev.disabled = currentStep === 0;
        btnNext.disabled = currentStep === maxSteps;
    }
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
    window.addEventListener('resize', () => {
        currentStep = 0;
        updateSlider();
    });
}

/* --- MODAL LOGIC --- */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalContent = document.querySelector('.modal-content');

function openModal(gift) {
    const categoryName = gift.category.toLowerCase().split(' ').pop();
    
    const renderSnowflakes = (value) => {
        const count = parseInt(value) / 100;
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `<img src="assets/icons/snowflake.svg" alt="snowflake" class="snowflake-icon">`;
        }
        for (let i = 0; i < 5 - count; i++) {
            html += `<img src="assets/icons/snowflake.svg" alt="snowflake" class="snowflake-icon snowflake-icon--empty">`;
        }
        return html;
    };

    modalContent.innerHTML = `
        <div class="modal-image-wrapper modal-image-wrapper--${categoryName}">
            <img src="assets/images/gift-for-${categoryName}.png" alt="${gift.name}" class="modal-main-img">
        </div>
        <div class="modal-text-content">
            <p class="gift-card__tag gift-card__tag--${categoryName}">${gift.category}</p>
            <h3 class="modal-title">${gift.name}</h3>
            <p class="modal-description">${gift.description}</p>
            <div class="modal-superpowers">
                <p class="superpowers-title">Adds superpowers to:</p>
                ${Object.entries(gift.superpowers).map(([name, value]) => `
                    <div class="power-row">
                        <span class="power-name">${name}</span>
                        <span class="power-value">${value}</span>
                        <div class="power-stars">
                            ${renderSnowflakes(value)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modalOverlay.classList.add('open');
    document.body.classList.add('no-scroll');
}

if (modalOverlay) {
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
    });
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
    });
}

document.addEventListener('click', (e) => {
    const card = e.target.closest('.gift-card');
    if (card) {
        const giftName = card.querySelector('.gift-card__name').textContent.trim();
        const gift = giftsData.find(g => g.name === giftName);
        if (gift) openModal(gift);
    }
});

/* --- GIFTS DATA & FILTER LOGIC --- */
let giftsData = [];

async function loadGifts() {
    try {
        const response = await fetch('./gifts.json');
        giftsData = await response.json();

        if (document.body.classList.contains('index-page')) {
            renderRandomGifts();
        } else if (document.body.classList.contains('gifts-page')) {
            renderAllGifts();
            initFilters();
        }
    } catch (error) {
        console.error('Failed to load gifts:', error);
    }
}

function createGiftCard(gift) {
    const categoryName = gift.category.toLowerCase().split(' ').pop();
    return `
        <article class="gift-card">
            <img class="gift-card__img" src="assets/images/gift-for-${categoryName}.png" alt="${gift.name}">
            <div class="gift-card__body">
                <p class="gift-card__tag gift-card__tag--${categoryName}">${gift.category}</p>
                <h2 class="gift-card__name">${gift.name}</h2>
            </div>
        </article>
    `;
}

function renderRandomGifts() {
    const container = document.querySelector('.gifts-grid');
    if (!container) return;
    const shuffled = [...giftsData].sort(() => 0.5 - Math.random());
    container.innerHTML = shuffled.slice(0, 4).map(gift => createGiftCard(gift)).join('');
}

function renderAllGifts(filter = 'ALL') {
    const container = document.querySelector('.gifts-grid');
    if (!container) return;
    const filtered = filter === 'ALL' 
        ? giftsData 
        : giftsData.filter(gift => gift.category.toUpperCase() === filter.toUpperCase());
    container.innerHTML = filtered.map(gift => createGiftCard(gift)).join('');
}

function initFilters() {
    const tabs = document.querySelectorAll('.gifts-tabs__btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('gifts-tabs__btn--active'));
            tab.classList.add('gifts-tabs__btn--active');
            renderAllGifts(tab.textContent.trim());
        });
    });
}

/* --- INITIALIZATION --- */
loadGifts();
initNavigation();