# Entwickler- & Wartungsanleitung | HSN Metallbau

Diese Dokumentation beschreibt, wie Sie die HSN Metallbau-Website anpassen, neue Inhalte einpflegen, Bilder austauschen und das System erweitern können.

---

## 1. BILDER HINZUFÜGEN & AKTUALISIEREN

Sämtliche Bilder auf der Website sind mit sprechenden `alt`-Attributen für hervorragende Suchmaschinenoptimierung (SEO) ausgestattet und nutzen standardmäßig `loading="lazy"` (außer das Hero-Bild, das für schnellen Seitenaufbau priorisiert geladen wird).

### A. Lokale Bilder einsetzen (Empfohlen)
Erstellen Sie im Projektverzeichnis einen Unterordner `images/` oder legen Sie Bilddateien direkt im Hauptordner ab.
Ersetzen Sie die entsprechenden Platzhalter-URLs (`https://images.unsplash.com/...`) durch den relativen Pfad zu Ihrer Datei:

```html
<!-- Beispiel für ein lokales Bild im Hauptverzeichnis -->
<img src="mein-treppen-projekt.jpg" alt="Maßgefertigte Edelstahl-Treppe in Kraichtal - HSN Metallbau" width="800" height="500" loading="lazy">

<!-- Beispiel für ein lokales Bild in einem Unterordner -->
<img src="images/mein-balkon-projekt.jpg" alt="Moderner Anbaubalkon aus verzinktem Stahl - HSN Metallbau" width="800" height="500" loading="lazy">
```

### B. Wichtige Bild-Positionen im HTML
Im Code sind alle Bild-Positionen mit auffälligen Kommentaren der Form `<!-- PHOTO LOCATION: ... -->` markiert:
* **Hero-Bild (Hintergrund):** Zeile ~320 (`<section class="hero" id="hero">`) – Muss immer hochauflösend sein (empfohlen: `1920x1080px`).
* **Über Uns (Geschichte):** Zeile ~358 (`<div class="about-images">`) – Zeigt das Team oder die Werkstatt (empfohlen: `800x500px`).
* **Treppen-Sektion (Detail):** Zeile ~565 (`<section class="treppen-section" id="treppen">`) – Zeigt ein Referenzbild für Treppenbau (empfohlen: `800x500px`).
* **Balkone-Sektion (Detail):** Zeile ~606 (`<section class="balkone-section" id="balkone">`) – Zeigt ein Referenzbild für Balkonbau (empfohlen: `800x500px`).

---

## 2. NEUE LEISTUNGEN HINZUFÜGEN

Die Leistungen der Website sind als interaktive Cards im Grid der Sektion `#services` (Zeile ~380) organisiert.

### Schritt-für-Schritt-Anleitung:
1. Suchen Sie das Element `<div class="services-grid">`.
2. Kopieren Sie ein bestehendes Service-Card-Element (z.B. Service 1) und fügen Sie es vor der gestrichelten "In Planung"-Card ein.
3. Erhöhen Sie die Sektionsnummer (`<div class="service-num">10</div>`).
4. Ändern Sie das FontAwesome-Icon (`<i class="fas fa-stairs"></i>`) nach Wunsch. Eine Übersicht aller Icons finden Sie auf [fontawesome.com](https://fontawesome.com/).
5. Fügen Sie dem Titel und der Beschreibung ein `data-i18n` Attribut hinzu, um Mehrsprachigkeit zu unterstützen.

**Beispiel-Code:**
```html
<div class="service-card fade-in">
    <div class="service-img">
        <img src="images/neuer-service.jpg" alt="Neuer Metallbau-Service - HSN Metallbau" width="600" height="400" loading="lazy">
        <div class="service-img-overlay"></div>
        <div class="service-num">10</div>
    </div>
    <div class="service-body">
        <div class="service-icon"><i class="fas fa-shield"></i></div>
        <h3 data-i18n="svc_safety">Sicherheitstechnik</h3>
        <p data-i18n="svc_safety_desc">Einbruchschutz, Gittertüren, Fenstersicherungen und Geländererhöhungen für Gewerbe und Privathäuser.</p>
        <div class="service-tags">
            <span class="service-tag">Sicherheit</span>
            <span class="service-tag">Privat & Gewerbe</span>
        </div>
    </div>
</div>
```

6. Fügen Sie die Übersetzungen in das `<script>`-Tag unter `translations` für alle Sprachen (DE, EN, FR) ein:
```javascript
// Unter de:
svc_safety: "Sicherheitstechnik",
svc_safety_desc: "Einbruchschutz, Gittertüren, Fenstersicherungen und Geländererhöhungen für Gewerbe und Privathäuser.",

// Unter en:
svc_safety: "Security Systems",
svc_safety_desc: "Intrusion protection, barred doors, window security guards and railing extensions for commercial and residential properties.",

// Unter fr:
svc_safety: "Systèmes de Sécurité",
svc_safety_desc: "Protection contre les effractions, portes à barreaux, protections de fenêtres et rehausses de garde-corps.",
```

---

## 3. NEUE REFERENZEN (GALLERY) HINZUFÜGEN

Die Projekt-Referenzen werden über das **JavaScript Photo Management System** dynamisch geladen und mit einem interaktiven Kategorie-Filter gerendert. Sie müssen kein HTML bearbeiten, um neue Bilder in die Galerie einzufügen!

### Schritt-für-Schritt-Anleitung:
1. Suchen Sie die Variable `galleryImages` im `<script>`-Bereich (Zeile ~1000).
2. Fügen Sie am Ende des Arrays ein neues Objekt mit folgendem Schema hinzu:

```javascript
{
    id: 8,                                     // Fortlaufende, eindeutige ID
    category: "stairs",                        // Kategorie: stairs, balconies, gates, fences, facades, carports
    src: "images/referenz-treppe-8.jpg",       // Bildpfad
    alt_de: "Beschreibung für deutsche SEO",
    alt_en: "Description for English SEO",
    alt_fr: "Description for French SEO",
    titleKey: "gal8_title",                    // Eindeutiger Übersetzungsschlüssel für den Projekttitel
    desc_de: "Bruchsal · Stahl & Holz",        // Details (Ort & Materialien)
    desc_en: "Bruchsal · Steel & Wood",
    desc_fr: "Bruchsal · Acier & Bois",
    layout: ""                                 // Optional: "tall" (nimmt 2 Zeilen ein) oder "wide" (nimmt 2 Spalten ein), sonst leer ""
}
```

3. Registrieren Sie den Titel-Schlüssel (`gal8_title`) in der `translations`-Variable für alle Sprachen:
```javascript
// Unter de:
gal8_title: "Moderne Faltwerktreppe"

// Unter en:
gal8_title: "Modern Cantilever Stairs"

// Unter fr:
gal8_title: "Escalier Suspendu Moderne"
```

Das Bild wird automatisch im Hauptbereich gerendert, reagiert auf den Kategorie-Filter und passt sich nahtlos an alle Bildschirmgrößen an.

---

## 4. NEUE FAQ-ELEMENTE HINZUFÜGEN

Die FAQ-Sektion nutzt ein Akkordeon-Skript.

### Schritt-für-Schritt-Anleitung:
1. Suchen Sie das Element `<div class="faq-list fade-in">` im HTML (Zeile ~730).
2. Fügen Sie ein neues FAQ-Item-Element hinzu:

```html
<div class="faq-item">
    <button class="faq-question">
        <span data-i18n="faq7_q">Wie lange dauert die Fertigung einer Treppe?</span>
        <i class="fas fa-chevron-down"></i>
    </button>
    <div class="faq-answer">
        <p data-i18n="faq7_a">Die Fertigungszeit hängt vom Umfang ab. In der Regel beträgt sie ab Freigabe der CAD-Zeichnungen etwa 3 bis 6 Wochen.</p>
    </div>
</div>
```

3. Tragen Sie die Frage und Antwort in die `translations` ein:
```javascript
// Unter de:
faq7_q: "Wie lange dauert die Fertigung einer Treppe?",
faq7_a: "Die Fertigungszeit hängt vom Umfang ab. In der Regel beträgt sie ab Freigabe der CAD-Zeichnungen etwa 3 bis 6 Wochen.",

// Unter en:
faq7_q: "How long does it take to manufacture a staircase?",
faq7_a: "The manufacturing time depends on the scope. Generally, it takes about 3 to 6 weeks from the approval of the CAD drawings.",

// Unter fr:
faq7_q: "Combien de temps faut-il pour fabriquer un escalier ?",
faq7_a: "Le délai de fabrication dépend de l'envergure du projet. En général, il faut compter environ 3 à 6 semaines à partir de l'approbation des plans CAO."
```

---

## 5. EINEN NEUEN ABSCHNITT (SECTION) ERSTELLEN

Sollten Sie in Zukunft eine neue Sektion benötigen (z.B. "Karriereseite" oder "News"), nutzen Sie dieses standardisierte HTML-Skelett, um das visuelle Design der "Blue Steel"-Industrial-Ästhetik perfekt zu wahren:

```html
<!-- NEW: STANDARD SECTION PATTERN -->
<section class="neue-sektion" id="neue-sektion">
    <div class="container">
        <!-- Einheitlicher Sektions-Header -->
        <div class="section-header fade-in">
            <div class="section-tag" data-i18n="newsec_tag">Sub-Überschrift</div>
            <h2 class="section-title" data-i18n="newsec_title">Haupt-Überschrift</h2>
            <p class="section-desc" data-i18n="newsec_desc">Ein einleitender Satz, der die Inhalte dieser Sektion zusammenfasst.</p>
        </div>

        <!-- 2-Spalten-Layout (Falls benötigt, sonst weglassen) -->
        <div class="about-grid">
            <div class="about-content fade-in">
                <h3 data-i18n="newsec_subtitle">Untertitel</h3>
                <p data-i18n="newsec_text">Hier steht Ihr beschreibender Text. Nutzen Sie das Übersetzungs-Skript für die Internationalisierung.</p>
                
                <!-- Beispiel-Button -->
                <a href="#contact" class="btn-primary" style="margin-top: 24px;">
                    <i class="fas fa-envelope"></i>
                    <span data-i18n="cta_inquiry">Anfrage stellen</span>
                </a>
            </div>
            
            <div class="about-images fade-in">
                <div class="about-img-main">
                    <img src="images/neu-bild.jpg" alt="Neues Bildbeschreibung HSN Metallbau" width="800" height="500" loading="lazy">
                </div>
            </div>
        </div>
    </div>
</section>
```

---

## 6. COLOR & THEME ANPASSUNGEN (CSS VARIABLES)

Wenn Sie Farb-Feintuning vornehmen möchten, können Sie dies global über die CSS-Variablen im `:root` Bereich der Seite (Zeile ~40) tun:

```css
:root {
    --color-bg: #0D1117;          /* Hintergrundfarbe (Dunkler Blue-Black Ton) */
    --color-bg-light: #151B24;    /* Zwischenfarbe (Kühler Dunkelgraublau) */
    --color-bg-card: #1A202C;     /* Kartenhintergründe (Schiefergrau-Stahl) */
    --color-primary: #2C5F8A;     /* Primäre Akzentfarbe (Mattes Stahlblau) */
    --color-primary-hover: #1E4A6D;/* Hover-Zustand für Primärfarbe (Tiefblau) */
    --color-accent: #5B8CBF;      /* Sekundärer Akzent (Helleres Stahlblau) */
    --color-border: #2D3748;      /* Rahmen und Linien (Stahlgrau) */
}
```

---

Mit diesen Standardstrukturen bleibt Ihre Website auch bei zukünftigen Erweiterungen hochperformant, suchmaschinenoptimiert und visuell absolut einheitlich gestaltet!
