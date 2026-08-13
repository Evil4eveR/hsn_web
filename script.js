// Global error handler for images (referenced in HTML)
function handleImageError(img) {
    img.classList.add('img-failed');
}

let translations = {};
let currentLang = 'de';

// Load translations from dt.json then initialize
fetch('dt.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
        initializeApp();
    })
    .catch(error => {
        console.error('Failed to load translations:', error);
    });

function initializeApp() {
// ===== LANGUAGE SWITCHER =====
    let currentLang = 'de';

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update meta tags for SEO
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && translations[lang].hero_subtitle) {
            // Keep it shorter for meta
            metaDesc.setAttribute('content', translations[lang].hero_subtitle.substring(0, 160));
        }

        // NEW: Re-render dynamic photo gallery with active language
        renderGallery();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // ===== MOBILE MENU =====
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== FADE IN ANIMATION =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Open clicked if wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== COOKIE BANNER =====
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    // Show banner if not already decided
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 2000);
    }

    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
    });

    cookieDecline.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
    });

    // ===== CONTACT FORM =====
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert(currentLang === 'de' ? 'Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.' :
              currentLang === 'en' ? 'Thank you for your inquiry! We will get back to you shortly.' :
              'Merci pour votre demande ! Nous vous contacterons sous peu.');
    });

    // ===== BACK TO TOP BUTTON LOGIC =====
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== NEW: PHOTO MANAGEMENT SYSTEM =====
    /* Store all gallery image paths in an array for easy management without changing HTML structure */
    const galleryImages = [
        {
            id: 1,
            category: "stairs",
            src: "img/treppen/treppen_twil.jpeg",
            alt_de: "Edelstahl Wendeltreppe Projekt Kraichtal - HSN Metallbau",
            alt_en: "Stainless steel spiral staircase project Kraichtal - HSN Metal Construction",
            alt_fr: "Projet d'escalier en colimaçon en acier inoxydable Kraichtal - HSN Construction Métallique",
            titleKey: "gal1_title",
            desc_de: "Kraichtal · Edelstahl & Glas",
            desc_en: "Kraichtal · Stainless Steel & Glass",
            desc_fr: "Kraichtal · Acier Inoxydable & Verre",
            layout: "tall"
        },
        {
            id: 2,
            category: "gates",
            src: "img/tore_und_tueren/Tore_&_Tueren_Stahltuer_Industrie.jpeg",
            alt_de: "Industrietor Projekt Karlsruhe - HSN Metallbau",
            alt_en: "Industrial gate project Karlsruhe - HSN Metal Construction",
            alt_fr: "Projet de portail industriel Karlsruhe - HSN Construction Métallique",
            titleKey: "gal2_title",
            desc_de: "Karlsruhe · Stahl",
            desc_en: "Karlsruhe · Steel",
            desc_fr: "Karlsruhe · Acier",
            layout: ""
        },
        {
            id: 3,
            category: "fences",
            src: "img/sonstiges/alles.jpeg",
            alt_de: "Zaun Einfriedung Projekt - HSN Metallbau",
            alt_en: "Fence enclosure project - HSN Metal Construction",
            alt_fr: "Projet de clôture - HSN Construction Métallique",
            titleKey: "gal3_title",
            desc_de: "Bruchsal · Edelstahl",
            desc_en: "Bruchsal · Stainless Steel",
            desc_fr: "Bruchsal · Acier Inoxydable",
            layout: ""
        },
        {
            id: 4,
            category: "carports",
            src: "img/carports/carpot_moto.jpeg",
            alt_de: "Carport Überdachung Projekt - HSN Metallbau",
            alt_en: "Carport canopy project - HSN Metal Construction",
            alt_fr: "Projet d'abri de voiture - HSN Construction Métallique",
            titleKey: "gal4_title",
            desc_de: "Kraichtal · Stahl & Glas",
            desc_en: "Kraichtal · Steel & Glass",
            desc_fr: "Kraichtal · Acier & Verre",
            layout: "wide"
        },
        {
            id: 5,
            category: "facades",
            src: "img/fassaden/fac.jpeg",
            alt_de: "Metallfassade Projekt - HSN Metallbau",
            alt_en: "Metal facade project - HSN Metal Construction",
            alt_fr: "Projet de façade métallique - HSN Construction Métallique",
            titleKey: "gal5_title",
            desc_de: "Pforzheim · Aluminium",
            desc_en: "Pforzheim · Aluminum",
            desc_fr: "Pforzheim · Aluminium",
            layout: ""
        },
        {
            id: 6,
            category: "facades",
            src: "img/fassaden/Fassaden_Alu_Fassadenelement.jpeg",
            alt_de: "Stahlhalle Projekt - HSN Metallbau",
            alt_en: "Steel hall project - HSN Metal Construction",
            alt_fr: "Projet de halle métallique - HSN Construction Métallique",
            titleKey: "gal6_title",
            desc_de: "Karlsruhe · Stahlbau",
            desc_en: "Karlsruhe · Steel Construction",
            desc_fr: "Karlsruhe · Charpente Métallique",
            layout: ""
        },
        {
            id: 7,
            category: "balconies",
            src: "img/balkone/balkonat.jpeg",
            alt_de: "Balkongeländer Projekt - HSN Metallbau",
            alt_en: "Balcony railing project - HSN Metal Construction",
            alt_fr: "Projet de garde-corps de balcon - HSN Construction Métallique",
            titleKey: "gal7_title",
            desc_de: "Kraichtal · Edelstahl",
            desc_en: "Kraichtal · Stainless Steel",
            desc_fr: "Kraichtal · Acier Inoxydable",
            layout: ""
        }
    ];

    let currentFilter = 'all';

    function renderGallery() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const filtered = currentFilter === 'all' 
            ? galleryImages 
            : galleryImages.filter(img => img.category === currentFilter);

        filtered.forEach(img => {
            const item = document.createElement('div');
            item.className = `gallery-item ${img.layout || ''} fade-in`;
            
            const altText = currentLang === 'de' ? img.alt_de : (currentLang === 'en' ? img.alt_en : img.alt_fr);
            const descText = currentLang === 'de' ? img.desc_de : (currentLang === 'en' ? img.desc_en : img.desc_fr);
            const titleText = translations[currentLang][img.titleKey] || '';

            item.innerHTML = `
                <img src="${img.src}" alt="${altText}" width="600" height="450" loading="lazy">
                <div class="gallery-item-overlay">
                    <h4 data-i18n="${img.titleKey}">${titleText}</h4>
                    <p>${descText}</p>
                </div>
            `;
            grid.appendChild(item);
            observer.observe(item);
        });
    }

    // Filter button click logic
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });

    // ===== INITIALIZATION =====
    
        // Initialize dynamic gallery rendering
        renderGallery();
        
        // Execute lazy loading check
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        }
    
}