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

    // Desktop lang-btn listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // ===== MOBILE LANGUAGE DROPDOWN =====
    const langDropdown     = document.getElementById('langDropdown');
    const langDropdownToggle = document.getElementById('langDropdownToggle');
    const langDropdownLabel  = document.getElementById('langDropdownLabel');

    if (langDropdown && langDropdownToggle) {
        // Toggle open/close
        langDropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langDropdown.classList.toggle('open');
            langDropdownToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Item selection
        langDropdown.querySelectorAll('.lang-dropdown__item').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.dataset.lang;
                setLanguage(lang);
                // Update dropdown label + active state
                langDropdownLabel.textContent = lang.toUpperCase();
                langDropdown.querySelectorAll('.lang-dropdown__item').forEach(i =>
                    i.classList.toggle('active', i.dataset.lang === lang)
                );
                // Close the menu
                langDropdown.classList.remove('open');
                langDropdownToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target)) {
                langDropdown.classList.remove('open');
                langDropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

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

    // ===== STAT COUNTER ANIMATION =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const targetText = entry.target.textContent.trim();
                    const targetNum = parseInt(targetText.replace(/\D/g, ''), 10);
                    const suffix = targetText.replace(/[0-9]/g, '');
                    
                    if (!isNaN(targetNum)) {
                        let currentNum = 0;
                        const duration = 1500; // 1.5 seconds
                        const stepTime = Math.max(16, duration / targetNum);
                        
                        const timer = setInterval(() => {
                            currentNum += Math.ceil(targetNum / (duration / 16));
                            if (currentNum >= targetNum) {
                                currentNum = targetNum;
                                clearInterval(timer);
                            }
                            entry.target.textContent = currentNum + suffix;
                        }, stepTime);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.stat-number, .number').forEach(stat => {
            statsObserver.observe(stat);
        });
    }
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

    // ===== PHOTO GALLERY SYSTEM =====
    // All local images mapped by category
    const galleryImages = [
        // ── STAIRS (treppen) ──
        { id: 1,  category: 'stairs',    src: 'img/treppen/treppen_twil.jpeg',                          alt_de: 'Edelstahl-Wendeltreppe · HSN Metallbau',            alt_en: 'Stainless steel spiral staircase · HSN',          alt_fr: 'Escalier colimaçon inox · HSN',           title_de: 'Wendeltreppe Privathaus',        title_en: 'Spiral Staircase',           title_fr: 'Escalier en Colimaçon',         desc_de: 'Kraichtal · Edelstahl & Glas',          desc_en: 'Kraichtal · Stainless Steel & Glass',  desc_fr: 'Kraichtal · Acier Inox & Verre' },
        { id: 2,  category: 'stairs',    src: 'img/treppen/treppen_scroll.jpeg',                        alt_de: 'Geschwungene Innentreppe · HSN Metallbau',          alt_en: 'Curved indoor staircase · HSN',           alt_fr: 'Escalier intérieur courbé · HSN',         title_de: 'Geschwungene Innentreppe',       title_en: 'Curved Indoor Staircase',    title_fr: 'Escalier Courbé Intérieur',     desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 3,  category: 'stairs',    src: 'img/treppen/treppen_z.jpeg',                             alt_de: 'Z-Treppe Stahlkonstruktion · HSN',                  alt_en: 'Z-steel staircase · HSN',                 alt_fr: 'Escalier acier Z · HSN',                  title_de: 'Z-Treppe Stahl',                title_en: 'Z-Steel Staircase',          title_fr: 'Escalier Acier Z',              desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' },
        { id: 4,  category: 'stairs',    src: 'img/treppen/treppen_kbir.jpeg',                          alt_de: 'Großzügige Treppenanlage · HSN',                    alt_en: 'Large staircase installation · HSN',      alt_fr: 'Grande installation escalier · HSN',      title_de: 'Repräsentative Treppe',         title_en: 'Grand Staircase',            title_fr: 'Escalier Représentatif',        desc_de: 'Pforzheim · Edelstahl',                 desc_en: 'Pforzheim · Stainless Steel',          desc_fr: 'Pforzheim · Acier Inox' },
        { id: 5,  category: 'stairs',    src: 'img/treppen/treppen_pro.jpeg',                           alt_de: 'Profi-Treppenanlage Stahl · HSN',                   alt_en: 'Professional steel staircase · HSN',      alt_fr: 'Escalier professionnel acier · HSN',      title_de: 'Profi-Treppenanlage',           title_en: 'Professional Staircase',     title_fr: 'Escalier Professionnel',        desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 6,  category: 'stairs',    src: 'img/treppen/treppen_crcl.jpeg',                          alt_de: 'Runde Wendeltreppe · HSN',                          alt_en: 'Round spiral stair · HSN',                alt_fr: 'Escalier circulaire · HSN',               title_de: 'Runde Wendeltreppe',            title_en: 'Round Spiral Stair',         title_fr: 'Escalier Circulaire',           desc_de: 'Karlsruhe · Edelstahl',                 desc_en: 'Karlsruhe · Stainless Steel',          desc_fr: 'Karlsruhe · Acier Inox' },
        { id: 7,  category: 'stairs',    src: 'img/treppen/treppen_inner.jpeg',                         alt_de: 'Moderne Innentreppe · HSN',                         alt_en: 'Modern indoor staircase · HSN',           alt_fr: 'Escalier intérieur moderne · HSN',        title_de: 'Moderne Innentreppe',           title_en: 'Modern Indoor Staircase',    title_fr: 'Escalier Intérieur Moderne',    desc_de: 'Kraichtal · Stahl & Holz',              desc_en: 'Kraichtal · Steel & Wood',             desc_fr: 'Kraichtal · Acier & Bois' },
        { id: 8,  category: 'stairs',    src: 'img/treppen/treppen_bau.jpeg',                           alt_de: 'Treppe im Bau · HSN',                               alt_en: 'Staircase under construction · HSN',      alt_fr: 'Escalier en construction · HSN',          title_de: 'Treppenbau Projekt',            title_en: 'Staircase Project',          title_fr: 'Projet Escalier',               desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 9,  category: 'stairs',    src: 'img/treppen/treppen_mit_balkone.jpeg',                   alt_de: 'Treppe mit Balkon · HSN',                           alt_en: 'Staircase with balcony · HSN',            alt_fr: 'Escalier avec balcon · HSN',              title_de: 'Treppe mit Balkonanschluss',    title_en: 'Staircase with Balcony',     title_fr: 'Escalier & Balcon',             desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' },
        { id: 10, category: 'stairs',    src: 'img/treppen/treppen_dayr_khechab.jpeg',                  alt_de: 'Holz-Stahl Treppe · HSN',                           alt_en: 'Wood-steel staircase · HSN',              alt_fr: 'Escalier bois-acier · HSN',               title_de: 'Holz-Stahl-Kombination',        title_en: 'Wood-Steel Combination',     title_fr: 'Combinaison Bois-Acier',        desc_de: 'Kraichtal · Holz & Stahl',              desc_en: 'Kraichtal · Wood & Steel',             desc_fr: 'Kraichtal · Bois & Acier' },
        { id: 11, category: 'stairs',    src: 'img/treppen/treppen_dakhili.jpeg',                       alt_de: 'Innenraumtreppe Stahl · HSN',                       alt_en: 'Interior steel staircase · HSN',          alt_fr: 'Escalier intérieur acier · HSN',          title_de: 'Innenraumtreppe',               title_en: 'Interior Staircase',         title_fr: 'Escalier Intérieur',            desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 12, category: 'stairs',    src: 'img/treppen/treppen_twil_2.jpeg',                        alt_de: 'Elegante Wendeltreppe 2 · HSN',                     alt_en: 'Elegant spiral staircase 2 · HSN',        alt_fr: 'Escalier colimaçon élégant 2 · HSN',      title_de: 'Elegante Wendeltreppe II',      title_en: 'Elegant Spiral Stair II',    title_fr: 'Escalier Colimaçon II',         desc_de: 'Kraichtal · Edelstahl',                 desc_en: 'Kraichtal · Stainless Steel',          desc_fr: 'Kraichtal · Acier Inox' },
        { id: 13, category: 'stairs',    src: 'img/treppen/treppen_y.jpeg',                             alt_de: 'Y-Treppe Design · HSN',                             alt_en: 'Y-design staircase · HSN',                alt_fr: 'Escalier design Y · HSN',                 title_de: 'Design-Treppe Y-Form',          title_en: 'Y-Design Staircase',         title_fr: 'Escalier Design Y',             desc_de: 'Pforzheim · Stahl',                     desc_en: 'Pforzheim · Steel',                    desc_fr: 'Pforzheim · Acier' },
        { id: 14, category: 'stairs',    src: 'img/treppen/treppen_7alazon.jpeg',                       alt_de: 'Aufgesetzte Außentreppe · HSN',                     alt_en: 'Exterior mounted staircase · HSN',        alt_fr: 'Escalier extérieur monté · HSN',          title_de: 'Außentreppe montiert',          title_en: 'Exterior Staircase',         title_fr: 'Escalier Extérieur',            desc_de: 'Kraichtal · Stahl verzinkt',            desc_en: 'Kraichtal · Galvanized Steel',         desc_fr: 'Kraichtal · Acier Galvanisé' },
        { id: 15, category: 'stairs',    src: 'img/treppen/treppen_mit_balkone_bau.jpeg',               alt_de: 'Treppenkonstruktion mit Balkon im Bau · HSN',        alt_en: 'Staircase & balcony under construction · HSN', alt_fr: 'Escalier & balcon en construction · HSN', title_de: 'Treppenbau mit Balkon',         title_en: 'Staircase & Balcony Build',  title_fr: 'Construction Escalier Balcon', desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 16, category: 'stairs',    src: 'img/treppen/Treppen_Wendeltreppe_Stahl.jpg',             alt_de: 'Wendeltreppe Stahl klassisch · HSN',                alt_en: 'Classic steel spiral stair · HSN',        alt_fr: 'Escalier colimaçon acier classique · HSN',title_de: 'Wendeltreppe Stahl klassisch',  title_en: 'Classic Steel Spiral Stair', title_fr: 'Colimaçon Acier Classique',     desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 17, category: 'stairs',    src: 'img/treppen/treppen_ldakhel.jpeg',                       alt_de: 'Innentreppenanlage · HSN',                          alt_en: 'Indoor staircase system · HSN',           alt_fr: 'Système escalier intérieur · HSN',         title_de: 'Innentreppenanlage',            title_en: 'Indoor Staircase System',    title_fr: 'Système Escalier',              desc_de: 'Kraichtal · Edelstahl',                 desc_en: 'Kraichtal · Stainless Steel',          desc_fr: 'Kraichtal · Acier Inox' },
        { id: 18, category: 'stairs',    src: 'img/treppen/Treppen_Gelaender_Edelstahl.jpeg',           alt_de: 'Edelstahl-Geländer für Treppen · HSN',              alt_en: 'Stainless steel stair railing · HSN',     alt_fr: 'Garde-corps inox escalier · HSN',         title_de: 'Edelstahl-Treppengeländer',     title_en: 'Stainless Steel Railing',    title_fr: 'Garde-Corps Inox',              desc_de: 'Baden-Württemberg · Edelstahl',          desc_en: 'Baden-Württemberg · Stainless Steel',  desc_fr: 'Baden-Württemberg · Acier Inox' },

        // ── BALCONIES (balkone) ──
        { id: 19, category: 'balconies', src: 'img/balkone/balkonat.jpeg',                              alt_de: 'Balkongeländer Edelstahl · HSN',                    alt_en: 'Stainless balcony railing · HSN',          alt_fr: 'Garde-corps balcon inox · HSN',            title_de: 'Balkongeländer Edelstahl',      title_en: 'Balcony Railing',            title_fr: 'Garde-Corps Balcon',            desc_de: 'Kraichtal · Edelstahl',                 desc_en: 'Kraichtal · Stainless Steel',          desc_fr: 'Kraichtal · Acier Inox' },
        { id: 20, category: 'balconies', src: 'img/balkone/balkone.jpeg',                               alt_de: 'Anbaubalkon Stahl · HSN',                           alt_en: 'Steel attachment balcony · HSN',           alt_fr: 'Balcon rapporté acier · HSN',              title_de: 'Anbaubalkon Stahl',             title_en: 'Steel Balcony Extension',    title_fr: 'Balcon Rapporté Acier',         desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 21, category: 'balconies', src: 'img/balkone/Balkone_try.jpeg',                           alt_de: 'Moderner Balkon · HSN',                             alt_en: 'Modern balcony · HSN',                     alt_fr: 'Balcon moderne · HSN',                     title_de: 'Moderner Balkon',               title_en: 'Modern Balcony',             title_fr: 'Balcon Moderne',                desc_de: 'Bruchsal · Stahl & Glas',               desc_en: 'Bruchsal · Steel & Glass',             desc_fr: 'Bruchsal · Acier & Verre' },
        { id: 22, category: 'balconies', src: 'img/balkone/Balkone_black.jpeg',                         alt_de: 'Schwarzer Balkon · HSN',                            alt_en: 'Black powder-coated balcony · HSN',        alt_fr: 'Balcon peint noir · HSN',                  title_de: 'Balkon anthrazit-schwarz',      title_en: 'Black Balcony',              title_fr: 'Balcon Noir',                   desc_de: 'Pforzheim · Stahl anthrazit',           desc_en: 'Pforzheim · Anthracite Steel',         desc_fr: 'Pforzheim · Acier Anthracite' },
        { id: 23, category: 'balconies', src: 'img/balkone/Balkone_kbir.jpeg',                          alt_de: 'Großer Balkon Konstruktion · HSN',                  alt_en: 'Large balcony structure · HSN',            alt_fr: 'Grande structure balcon · HSN',             title_de: 'Balkon Großprojekt',            title_en: 'Large Balcony Project',      title_fr: 'Grand Projet Balcon',           desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 24, category: 'balconies', src: 'img/balkone/balkone_mzyan.jpeg',                         alt_de: 'Balkon mit Zierelementen · HSN',                    alt_en: 'Balcony with decorative elements · HSN',   alt_fr: 'Balcon avec éléments décoratifs · HSN',    title_de: 'Balkon mit Zierelementen',      title_en: 'Decorative Balcony',         title_fr: 'Balcon Décoratif',              desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 25, category: 'balconies', src: 'img/balkone/balkone_terrass.jpeg',                       alt_de: 'Terrassenbalkon · HSN',                             alt_en: 'Terrace balcony · HSN',                    alt_fr: 'Balcon terrasse · HSN',                    title_de: 'Terrassen-Balkon',              title_en: 'Terrace Balcony',            title_fr: 'Balcon Terrasse',               desc_de: 'Bruchsal · Edelstahl',                  desc_en: 'Bruchsal · Stainless Steel',           desc_fr: 'Bruchsal · Acier Inox' },
        { id: 26, category: 'balconies', src: 'img/balkone/Balkone_double.jpeg',                        alt_de: 'Doppelbalkon Stahl · HSN',                          alt_en: 'Double balcony steel · HSN',               alt_fr: 'Double balcon acier · HSN',                title_de: 'Doppelbalkon',                  title_en: 'Double Balcony',             title_fr: 'Double Balcon',                 desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 27, category: 'balconies', src: 'img/balkone/Balkone_Gelaender_Edelstahl_Balkon.jpeg',    alt_de: 'Balkongeländer Edelstahl Detail · HSN',             alt_en: 'Stainless balcony railing detail · HSN',   alt_fr: 'Détail garde-corps inox balcon · HSN',     title_de: 'Edelstahl Balkongeländer',      title_en: 'Stainless Balcony Railing',  title_fr: 'Garde-Corps Inox Balcon',       desc_de: 'Baden-Württemberg · Edelstahl',          desc_en: 'Baden-Württemberg · Stainless Steel',  desc_fr: 'Baden-Württemberg · Acier Inox' },
        { id: 28, category: 'balconies', src: 'img/balkone/balkone_twil.jpeg',                          alt_de: 'Langer Balkon Stahl · HSN',                         alt_en: 'Long steel balcony · HSN',                 alt_fr: 'Long balcon acier · HSN',                  title_de: 'Langer Balkon',                 title_en: 'Long Steel Balcony',         title_fr: 'Long Balcon Acier',             desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 29, category: 'balconies', src: 'img/balkone/balkone_inner.jpeg',                         alt_de: 'Innenbalkon · HSN',                                 alt_en: 'Interior balcony · HSN',                   alt_fr: 'Balcon intérieur · HSN',                   title_de: 'Innenbalkon Konstruktion',      title_en: 'Interior Balcony',           title_fr: 'Balcon Intérieur',              desc_de: 'Pforzheim · Stahl',                     desc_en: 'Pforzheim · Steel',                    desc_fr: 'Pforzheim · Acier' },
        { id: 30, category: 'balconies', src: 'img/balkone/balkone_terrass_kbira.jpeg',                 alt_de: 'Große Terrasse Balkon · HSN',                       alt_en: 'Large terrace balcony · HSN',              alt_fr: 'Grande terrasse balcon · HSN',              title_de: 'Große Balkonfläche',            title_en: 'Large Balcony Area',         title_fr: 'Grande Surface Balcon',         desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },

        // ── GATES (tore_und_tueren) ──
        { id: 31, category: 'gates',     src: 'img/tore_und_tueren/Tore_&_Tueren_Stahltuer_Industrie.jpeg', alt_de: 'Industriestahltür · HSN',                    alt_en: 'Industrial steel door · HSN',              alt_fr: 'Porte industrielle acier · HSN',            title_de: 'Industrietor',                  title_en: 'Industrial Gate',            title_fr: 'Portail Industriel',            desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 32, category: 'gates',     src: 'img/tore_und_tueren/Tore_&_Tueren_Gartentor_Anthrazit_Modern.jpeg', alt_de: 'Modernes Gartentor anthrazit · HSN',    alt_en: 'Modern anthracite garden gate · HSN',      alt_fr: 'Portail jardin anthracite moderne · HSN',  title_de: 'Gartentor Modern',              title_en: 'Modern Garden Gate',         title_fr: 'Portail Jardin Moderne',        desc_de: 'Kraichtal · Stahl anthrazit',           desc_en: 'Kraichtal · Anthracite Steel',         desc_fr: 'Kraichtal · Acier Anthracite' },
        { id: 33, category: 'gates',     src: 'img/tore_und_tueren/tore_open.jpeg',                     alt_de: 'Offenes Tor · HSN',                                 alt_en: 'Open gate · HSN',                          alt_fr: 'Portail ouvert · HSN',                     title_de: 'Schwingtor offen',              title_en: 'Swing Gate',                 title_fr: 'Portail Battant',               desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' },
        { id: 34, category: 'gates',     src: 'img/tore_und_tueren/tur_design.jpeg',                    alt_de: 'Design-Eingangstür · HSN',                          alt_en: 'Design entrance door · HSN',               alt_fr: 'Porte d\'entrée design · HSN',             title_de: 'Design-Eingangstür',            title_en: 'Design Entrance Door',       title_fr: 'Porte Entrée Design',           desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 35, category: 'gates',     src: 'img/tore_und_tueren/tore_carry.jpeg',                    alt_de: 'Schiebtor · HSN',                                   alt_en: 'Sliding gate · HSN',                       alt_fr: 'Portail coulissant · HSN',                 title_de: 'Schiebtor',                     title_en: 'Sliding Gate',               title_fr: 'Portail Coulissant',            desc_de: 'Kraichtal · Stahl verzinkt',            desc_en: 'Kraichtal · Galvanized Steel',         desc_fr: 'Kraichtal · Acier Galvanisé' },
        { id: 36, category: 'gates',     src: 'img/tore_und_tueren/tur_ferme.jpeg',                     alt_de: 'Geschlossene Stahltür · HSN',                       alt_en: 'Closed steel door · HSN',                  alt_fr: 'Porte acier fermée · HSN',                 title_de: 'Stahltür geschlossen',          title_en: 'Closed Steel Door',          title_fr: 'Porte Acier Fermée',            desc_de: 'Pforzheim · Stahl',                     desc_en: 'Pforzheim · Steel',                    desc_fr: 'Pforzheim · Acier' },
        { id: 37, category: 'gates',     src: 'img/tore_und_tueren/tur_kbir_black.jpeg',                alt_de: 'Schwarzes Großtor · HSN',                           alt_en: 'Large black gate · HSN',                   alt_fr: 'Grand portail noir · HSN',                 title_de: 'Großtor schwarz',               title_en: 'Large Black Gate',           title_fr: 'Grand Portail Noir',            desc_de: 'Karlsruhe · Stahl schwarz',             desc_en: 'Karlsruhe · Black Steel',              desc_fr: 'Karlsruhe · Acier Noir' },
        { id: 38, category: 'gates',     src: 'img/tore_und_tueren/tueren.jpeg',                        alt_de: 'Türenkollektion · HSN',                             alt_en: 'Door collection · HSN',                    alt_fr: 'Collection portes · HSN',                  title_de: 'Stahltüren Kollektion',         title_en: 'Steel Door Collection',      title_fr: 'Collection Portes Acier',       desc_de: 'Baden-Württemberg · Stahl',             desc_en: 'Baden-Württemberg · Steel',            desc_fr: 'Baden-Württemberg · Acier' },
        { id: 39, category: 'gates',     src: 'img/tore_und_tueren/tur_gray.jpeg',                      alt_de: 'Graues Tor · HSN',                                  alt_en: 'Grey gate · HSN',                          alt_fr: 'Portail gris · HSN',                       title_de: 'Tor grau',                      title_en: 'Grey Gate',                  title_fr: 'Portail Gris',                  desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 40, category: 'gates',     src: 'img/tore_und_tueren/tur_port.jpeg',                      alt_de: 'Portaltür · HSN',                                   alt_en: 'Portal door · HSN',                        alt_fr: 'Porte portail · HSN',                      title_de: 'Portaltür Stahl',               title_en: 'Portal Steel Door',          title_fr: 'Porte Portail Acier',           desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' },
        { id: 41, category: 'gates',     src: 'img/tore_und_tueren/tur_simple.jpeg',                    alt_de: 'Einfache Stahltür · HSN',                           alt_en: 'Simple steel door · HSN',                  alt_fr: 'Porte acier simple · HSN',                 title_de: 'Stahltür einfach',              title_en: 'Simple Steel Door',          title_fr: 'Porte Acier Simple',            desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },

        // ── FENCES (zaeune) ──
        { id: 42, category: 'fences',    src: 'img/zaeune/zaeune_carre.jpeg',                           alt_de: 'Quadratischer Metallzaun · HSN',                    alt_en: 'Square metal fence · HSN',                 alt_fr: 'Clôture métallique carrée · HSN',           title_de: 'Metallzaun Quadrat',            title_en: 'Square Metal Fence',         title_fr: 'Clôture Métallique Carrée',     desc_de: 'Kraichtal · Stahl anthrazit',           desc_en: 'Kraichtal · Anthracite Steel',         desc_fr: 'Kraichtal · Acier Anthracite' },
        { id: 43, category: 'fences',    src: 'img/zaeune/zaeune_dama.jpeg',                            alt_de: 'Damast-Zaunmuster · HSN',                           alt_en: 'Damascus pattern fence · HSN',              alt_fr: 'Clôture motif damas · HSN',                title_de: 'Zierzaun Damast-Muster',        title_en: 'Decorative Fence',           title_fr: 'Clôture Décorative',            desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' },
        { id: 44, category: 'fences',    src: 'img/zaeune/zaeune_simple.jpeg',                          alt_de: 'Einfacher Metallzaun · HSN',                        alt_en: 'Simple metal fence · HSN',                 alt_fr: 'Clôture métallique simple · HSN',           title_de: 'Metallzaun einfach',            title_en: 'Simple Metal Fence',         title_fr: 'Clôture Simple',                desc_de: 'Pforzheim · Stahl verzinkt',            desc_en: 'Pforzheim · Galvanized Steel',         desc_fr: 'Pforzheim · Acier Galvanisé' },
        { id: 45, category: 'fences',    src: 'img/zaeune/zaeune_zaj.jpeg',                             alt_de: 'Garteneinfriedung · HSN',                           alt_en: 'Garden enclosure fence · HSN',              alt_fr: 'Clôture jardin · HSN',                     title_de: 'Garteneinfriedung',             title_en: 'Garden Enclosure',           title_fr: 'Clôture Jardin',                desc_de: 'Kraichtal · Edelstahl',                 desc_en: 'Kraichtal · Stainless Steel',          desc_fr: 'Kraichtal · Acier Inox' },
        { id: 46, category: 'fences',    src: 'img/zaeune/zaeune_zajdouble.jpeg',                       alt_de: 'Doppelzaun Stahl · HSN',                            alt_en: 'Double steel fence · HSN',                 alt_fr: 'Double clôture acier · HSN',               title_de: 'Doppelzaun Stahl',              title_en: 'Double Steel Fence',         title_fr: 'Double Clôture Acier',          desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },

        // ── FACADES (fassaden) ──
        { id: 47, category: 'facades',   src: 'img/fassaden/fac.jpeg',                                  alt_de: 'Metallfassade · HSN',                               alt_en: 'Metal facade · HSN',                       alt_fr: 'Façade métallique · HSN',                  title_de: 'Metallfassade',                 title_en: 'Metal Facade',               title_fr: 'Façade Métallique',             desc_de: 'Pforzheim · Aluminium',                 desc_en: 'Pforzheim · Aluminium',                desc_fr: 'Pforzheim · Aluminium' },
        { id: 48, category: 'facades',   src: 'img/fassaden/Fassaden_Alu_Fassadenelement.jpeg',         alt_de: 'Aluminium-Fassadenelement · HSN',                   alt_en: 'Aluminium facade panel · HSN',             alt_fr: 'Panneau façade aluminium · HSN',            title_de: 'Alu-Fassadenelement',           title_en: 'Aluminium Facade Panel',     title_fr: 'Panneau Façade Alu',            desc_de: 'Karlsruhe · Aluminium',                 desc_en: 'Karlsruhe · Aluminium',                desc_fr: 'Karlsruhe · Aluminium' },
        { id: 49, category: 'facades',   src: 'img/fassaden/fassaden.jpeg',                             alt_de: 'Fassadenkonstruktion Stahl · HSN',                  alt_en: 'Steel facade construction · HSN',          alt_fr: 'Construction façade acier · HSN',          title_de: 'Stahlhalle Fassade',            title_en: 'Steel Hall Facade',          title_fr: 'Façade Halle Acier',            desc_de: 'Karlsruhe · Stahlbau',                  desc_en: 'Karlsruhe · Steel Construction',       desc_fr: 'Karlsruhe · Charpente Métallique' },
        { id: 50, category: 'facades',   src: 'img/fassaden/Treppen_Aussentreppe_Spindeltreppe.jpeg',   alt_de: 'Außentreppe Spindel an Fassade · HSN',              alt_en: 'Exterior spiral staircase on facade · HSN',alt_fr: 'Escalier spirale extérieur sur façade · HSN', title_de: 'Spindeltreppe an Fassade',   title_en: 'Facade Spiral Stair',        title_fr: 'Escalier Spirale Façade',       desc_de: 'Pforzheim · Stahl',                     desc_en: 'Pforzheim · Steel',                    desc_fr: 'Pforzheim · Acier' },
        { id: 51, category: 'facades',   src: 'img/fassaden/Balkone_Fass.jpeg',                         alt_de: 'Balkone an Fassade · HSN',                          alt_en: 'Balconies on facade · HSN',                alt_fr: 'Balcons sur façade · HSN',                 title_de: 'Balkone an Fassade',            title_en: 'Balconies on Facade',        title_fr: 'Balcons sur Façade',            desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },

        // ── CARPORTS ──
        { id: 52, category: 'carports',  src: 'img/carports/carpot_byad.jpeg',                          alt_de: 'Weißer Stahlcarport · HSN',                         alt_en: 'White steel carport · HSN',                alt_fr: 'Carport acier blanc · HSN',                title_de: 'Carport weiß',                  title_en: 'White Steel Carport',        title_fr: 'Carport Blanc',                 desc_de: 'Kraichtal · Stahl & Glas',              desc_en: 'Kraichtal · Steel & Glass',            desc_fr: 'Kraichtal · Acier & Verre' },
        { id: 53, category: 'carports',  src: 'img/carports/carport_gray.jpg',                          alt_de: 'Grauer Carport · HSN',                              alt_en: 'Grey carport · HSN',                       alt_fr: 'Carport gris · HSN',                       title_de: 'Carport grau',                  title_en: 'Grey Carport',               title_fr: 'Carport Gris',                  desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 54, category: 'carports',  src: 'img/carports/carport_moto.jpg',                          alt_de: 'Motorrad-Carport · HSN',                            alt_en: 'Motorcycle carport · HSN',                 alt_fr: 'Carport moto · HSN',                       title_de: 'Motorrad-Carport',              title_en: 'Motorcycle Carport',         title_fr: 'Carport Moto',                  desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' },
        { id: 55, category: 'carports',  src: 'img/carports/carpot_solo.jpeg',                          alt_de: 'Einzelcarport · HSN',                               alt_en: 'Single carport · HSN',                     alt_fr: 'Carport individuel · HSN',                 title_de: 'Einzelcarport Stahl',           title_en: 'Single Steel Carport',       title_fr: 'Carport Individuel Acier',      desc_de: 'Pforzheim · Stahl',                     desc_en: 'Pforzheim · Steel',                    desc_fr: 'Pforzheim · Acier' },
        { id: 56, category: 'carports',  src: 'img/carports/carport.jpeg',                              alt_de: 'Carport Stahl · HSN',                               alt_en: 'Steel carport · HSN',                      alt_fr: 'Carport acier · HSN',                      title_de: 'Carport Anlage',                title_en: 'Carport Installation',       title_fr: 'Installation Carport',          desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 57, category: 'carports',  src: 'img/carports/carport_twill.jpeg',                        alt_de: 'Doppelcarport · HSN',                               alt_en: 'Double carport · HSN',                     alt_fr: 'Double carport · HSN',                     title_de: 'Doppelcarport',                 title_en: 'Double Carport',             title_fr: 'Double Carport',                desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 58, category: 'carports',  src: 'img/carports/carpot_kbir.jpeg',                          alt_de: 'Großer Carport · HSN',                              alt_en: 'Large carport · HSN',                      alt_fr: 'Grand carport · HSN',                      title_de: 'Großer Carport',                title_en: 'Large Carport',              title_fr: 'Grand Carport',                 desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' },

        // ── OTHER / SONSTIGES ──
        { id: 59, category: 'other',     src: 'img/sonstiges/alles.jpeg',                               alt_de: 'Metallbau Projekt · HSN',                           alt_en: 'Metal construction project · HSN',         alt_fr: 'Projet construction métallique · HSN',      title_de: 'Metallbau-Sonderprojekt',       title_en: 'Special Metal Project',      title_fr: 'Projet Métallique Spécial',     desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 60, category: 'other',     src: 'img/sonstiges/Carports_Stahlcarport_Modern_Anthrazit.jpeg', alt_de: 'Moderner Stahlcarport anthrazit · HSN',          alt_en: 'Modern anthracite steel carport · HSN',    alt_fr: 'Carport acier anthracite moderne · HSN',   title_de: 'Stahlcarport Modern',           title_en: 'Modern Steel Carport',       title_fr: 'Carport Acier Moderne',         desc_de: 'Baden-Württemberg · Stahl',             desc_en: 'Baden-Württemberg · Steel',            desc_fr: 'Baden-Württemberg · Acier' },
        { id: 61, category: 'other',     src: 'img/sonstiges/Treppen_Wendeltreppe_Stahl.jpeg',           alt_de: 'Wendeltreppe Stahl außen · HSN',                    alt_en: 'Exterior steel spiral stair · HSN',        alt_fr: 'Escalier colimaçon acier extérieur · HSN', title_de: 'Wendeltreppe Außen',            title_en: 'Exterior Spiral Stair',      title_fr: 'Colimaçon Extérieur',           desc_de: 'Kraichtal · Stahl',                     desc_en: 'Kraichtal · Steel',                    desc_fr: 'Kraichtal · Acier' },
        { id: 62, category: 'other',     src: 'img/sonstiges/Balkone_Balkongelaender_Lochblech.jpeg',    alt_de: 'Balkongeländer Lochblech · HSN',                    alt_en: 'Balcony railing perforated sheet · HSN',   alt_fr: 'Garde-corps tôle perforée · HSN',          title_de: 'Geländer Lochblech',            title_en: 'Perforated Sheet Railing',   title_fr: 'Garde-Corps Tôle Perforée',     desc_de: 'Karlsruhe · Stahl',                     desc_en: 'Karlsruhe · Steel',                    desc_fr: 'Karlsruhe · Acier' },
        { id: 63, category: 'other',     src: 'img/sonstiges/Carports_Doppelcarport_Stahl.jpeg',         alt_de: 'Doppelcarport Stahl · HSN',                         alt_en: 'Double steel carport · HSN',               alt_fr: 'Double carport acier · HSN',               title_de: 'Doppelcarport Stahl',           title_en: 'Double Steel Carport',       title_fr: 'Double Carport Acier',          desc_de: 'Bruchsal · Stahl',                      desc_en: 'Bruchsal · Steel',                     desc_fr: 'Bruchsal · Acier' }
    ];

    const BATCH_SIZE = 8;
    let currentFilter = 'all';
    let visibleCount = 0;

    // ── Computed filtered list ──
    function getFiltered() {
        return currentFilter === 'all'
            ? galleryImages
            : galleryImages.filter(img => img.category === currentFilter);
    }

    // ── Build one card DOM element ──
    function buildCard(img) {
        const lang = currentLang;
        const altText   = img['alt_'   + lang] || img.alt_de;
        const descText  = img['desc_'  + lang] || img.desc_de;
        const titleText = img['title_' + lang] || img.title_de;

        const item = document.createElement('div');
        item.className = 'gallery-item fade-in';
        item.dataset.id = img.id;
        item.dataset.category = img.category; // Needed for CSS filtering later
        item.innerHTML = `
            <img src="${img.src}" alt="${altText}" width="600" height="450" loading="lazy" decoding="async" onerror="handleImageError(this)">
            <div class="gallery-item-overlay">
                <h4>${titleText}</h4>
                <p>${descText}</p>
            </div>`;
        // Fade-in via IntersectionObserver
        observer.observe(item);
        return item;
    }

    // ── Render gallery (append batch) ──
    function renderGallery(reset = false) {
        const grid = document.getElementById('galleryGrid');
        const loadMoreBtn = document.getElementById('galleryLoadMore');
        const emptyState = document.getElementById('galleryEmptyState');
        if (!grid) return;
        
        const filtered = getFiltered();

        // Handle empty state
        if (emptyState) {
            if (filtered.length === 0) {
                emptyState.classList.remove('hidden');
                grid.classList.add('hidden');
                if (loadMoreBtn) loadMoreBtn.hidden = true;
                return;
            } else {
                emptyState.classList.add('hidden');
                grid.classList.remove('hidden');
            }
        }

        if (reset) {
            grid.innerHTML = '';
            visibleCount = 0;
        }

        // Use DocumentFragment for performance batching
        const fragment = document.createDocumentFragment();
        const nextBatch = filtered.slice(visibleCount, visibleCount + BATCH_SIZE);
        nextBatch.forEach(img => fragment.appendChild(buildCard(img)));
        grid.appendChild(fragment);
        
        visibleCount += nextBatch.length;

        // Show/hide load-more button
        if (loadMoreBtn) {
            if (visibleCount >= filtered.length) {
                loadMoreBtn.hidden = true;
            } else {
                loadMoreBtn.hidden = false;
            }
        }
    }

    // ── Filter button listeners ──
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            // Always reset on filter change to ensure the array math matches the DOM
            renderGallery(true);
        });
    });

    // ── Load-More button ──
    const loadMoreBtn = document.getElementById('galleryLoadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => renderGallery(false));
    }

    // ── Initial render ──
    renderGallery(true);

    // ===== LIGHTBOX =====
    const lightbox    = document.getElementById('galleryLightbox');
    const lbImg       = document.getElementById('lightboxImg');
    const lbCaption   = document.getElementById('lightboxCaption');
    const lbCounter   = document.getElementById('lightboxCounter');
    const lbClose     = document.getElementById('lightboxClose');
    const lbPrev      = document.getElementById('lightboxPrev');
    const lbNext      = document.getElementById('lightboxNext');
    const lbBackdrop  = document.getElementById('lightboxBackdrop');
    const lbRawLink   = document.getElementById('lightboxRawLink'); // New link

    let lbIndex = 0;   // index in the currently filtered set

    function openLightbox(index) {
        const filtered = getFiltered();
        if (!filtered.length) return;
        lbIndex = ((index % filtered.length) + filtered.length) % filtered.length;
        const img = filtered[lbIndex];
        const lang = currentLang;

        lbImg.src     = img.src;
        lbImg.alt     = img['alt_'   + lang] || img.alt_de;
        lbCaption.textContent = img['title_' + lang] || img.title_de;
        lbCounter.textContent = `${lbIndex + 1} / ${filtered.length}`;
        if (lbRawLink) lbRawLink.href = img.src; // Set raw link href

        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lbImg.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        openLightbox(lbIndex + dir);
    }

    // Open on card click — delegate from the grid
    document.getElementById('galleryGrid').addEventListener('click', e => {
        const card = e.target.closest('.gallery-item');
        if (!card) return;
        const id = parseInt(card.dataset.id, 10);
        const filtered = getFiltered();
        const idx = filtered.findIndex(img => img.id === id);
        if (idx !== -1) openLightbox(idx);
    });

    if (lbClose)   lbClose.addEventListener('click',   closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev)    lbPrev.addEventListener('click',    () => navigateLightbox(-1));
    if (lbNext)    lbNext.addEventListener('click',    () => navigateLightbox(+1));

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(+1);
    });

    // Touch Swipe Navigation for Mobile Lightbox (With Vertical Scroll Threshold)
    let touchStartX = 0;
    let touchStartY = 0;
    
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
        if (!lightbox.classList.contains('is-open')) return;
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Directional Threshold: Only trigger swipe if horizontal movement is 1.5x greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            // Significant horizontal swipe
            if (deltaX > 50) {
                // Swiped right -> go to previous
                navigateLightbox(-1);
            } else if (deltaX < -50) {
                // Swiped left -> go to next
                navigateLightbox(+1);
            }
        }
    });

} // <-- Added missing closing brace for initializeApp()


document.addEventListener("DOMContentLoaded", function () {
    const aboutImage = document.getElementById("about-slideshow-img");
    
    // Add your image paths here (keep your main one as the first item)
    const images = [
    // --- MAIN ONE ---
    "img/sonstiges/main.jpg",

    // --- FASSADEN (4 remaining) ---
    "img/fassaden/fac.jpeg",
    "img/fassaden/Treppen_Aussentreppe_Spindeltreppe.jpeg",
    "img/fassaden/Balkone_Fass.jpeg",
    "img/fassaden/Treppen_Innentreppe_Stahl_Glas.jpeg",

    // // --- BALKONE (5 images) ---
    "img/balkone/balkone.jpeg",
    "img/balkone/Balkone_try.jpeg",
    "img/balkone/Balkone_black.jpeg",
    "img/balkone/Balkone_kbir.jpeg",
    "img/balkone/Balkone_mzyan.jpeg",

    // // --- CARPORTS (4 images) ---
    "img/carports/carpot_byad.jpeg",
    "img/carports/carport_gray.jpg",
    "img/carports/carport_moto.jpg",
    "img/carports/carpot_solo.jpeg",

    // --- SONSTIGES (4 images) ---
    "img/sonstiges/alles.jpeg",
    "img/sonstiges/Carports_Stahlcarport_Modern_Anthrazit.jpeg",
    "img/sonstiges/Zaeune_&_Einfriedungen_Metallzaun_Modern.jpeg",
    "img/sonstiges/Treppen_Wendeltreppe_Stahl.jpeg",

    // --- TORE UND TUEREN (4 images) ---
    "img/tore_und_tueren/tore_open.jpeg",
    "img/tore_und_tueren/Tore_&_Tueren_Gartentor_Anthrazit_Modern.jpeg",
    "img/tore_und_tueren/Tore_&_Tueren_Stahltuer_Industrie.jpeg",
    "img/tore_und_tueren/tur_design.jpeg",

    // --- TREPPEN (4 images) ---
    "img/treppen/treppen_z.jpeg",
    "img/treppen/treppen_scroll.jpeg",
    "img/treppen/treppen_inner_zaj.jpeg",
    "img/treppen/treppen_mit_balkone.jpeg",

    // --- ZAEUNE (4 images) ---
    "img/zaeune/zaeune_carre.jpeg",
    "img/zaeune/zaeune_dama.jpeg",
    "img/zaeune/zaeune_simple.jpeg",
    ];
    
    let currentIndex = 0;

    if (aboutImage && images.length > 1) {
        setInterval(() => {
            // 1. Remove active class to start fading out
            aboutImage.classList.remove("active");

            // 2. Wait for the fade-out animation to complete (300ms) before swapping the source
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                aboutImage.src = images[currentIndex];
                
                // 3. Add active class back to fade the new image in smoothly
                aboutImage.classList.add("active");
            }, 300); 
        }, 3000); // 2000 milliseconds = 2 seconds
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('revTrack');
    const prevBtn = document.getElementById('slPrev');
    const nextBtn = document.getElementById('slNext');
    const dotsContainer = document.getElementById('slDots');
    
    if (!track) return;

    const cards = track.querySelectorAll('.rev-card');
    let currentIndex = 0;

    // الحصول على عدد البطاقات المرئية بناءً على حجم الشاشة
    function getVisibleCardsCount() {
        if (window.innerWidth <= 640) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    // حساب إجمالي السلايدات المتاحة
    function getMaxIndex() {
        return cards.length - getVisibleCardsCount();
    }

    // إنشاء النقاط السفلى (Dots)
    function createDots() {
        dotsContainer.innerHTML = '';
        const maxIndex = getMaxIndex();
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.classList.add('sl-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // تحديث مكان السلايدر والنقاط
    function updateSlider() {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 24; // نفس قيمة Gap في CSS
        const maxIndex = getMaxIndex();

        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const amountToMove = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${amountToMove}px)`;

        // تحديث النقاط النشطة
        const dots = dotsContainer.querySelectorAll('.sl-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
        } else {
            currentIndex = 0; // العودة للبداية
        }
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = getMaxIndex(); // الذهاب للنهاية
        }
        updateSlider();
    });

    // إعادة التهيئة عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        createDots();
        updateSlider();
    });

    // البدء
    createDots();
    updateSlider();
});


 // ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const fileInput = document.getElementById('file');
    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');

    // 1. التحقق من حجم الملفات (أقل من 10MB)
    if (fileInput.files.length > 0) {
        let totalSize = 0;
        for (let i = 0; i < fileInput.files.length; i++) {
            totalSize += fileInput.files[i].size;
        }

        if (totalSize > 10485760) { // 10 MB
            alert('Die Datei ist zu groß! Die maximal zulässige Größe beträgt 10 MB.');
            return;
        }
    }

    // 2. تغيير حالة الزر
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet...';

    // 3. إرسال البيانات المباشرة بدون /ajax/ لضمان قبول الملف المرفق
    const formData = new FormData(form);

    fetch('https://formsubmit.co/ymarmoud@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert(currentLang === 'de' ? 'Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.' :
              currentLang === 'en' ? 'Thank you for your inquiry! We will get back to you shortly.' :
              'Merci pour votre demande ! Nous vous contacterons sous peu.');
            form.reset(); // إعادة إعادة تعيين حقول النموذج
        } else {
            alert('Fehler beim Senden. Bitte überprüfen Sie Ihre Eingaben.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Verbindungsfehler. Bitte versuchen Sie es erneut.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer la demande';
    });
});
