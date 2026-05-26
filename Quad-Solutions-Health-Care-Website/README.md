# Quad Solutions Medical Credentialing Website

Quad Solutions is a professional multi-page healthcare website built for a medical credentialing company. The project is built with plain HTML, CSS, and JavaScript using a clean teal-and-white healthcare theme, simple class names, responsive layouts, and accessible interactions.

The site is structured to feel polished, trustworthy, and easy to maintain. It does not depend on Tailwind, React, or any build tool.

---

## Folder Structure

```
QUAD SOLUTIONS/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── img/
│       ├── hero-bg.png
│       └── (person images...)
└── pages/
    ├── about.html
    ├── contact.html
    ├── faq.html
    ├── privacy.html
    ├── process.html
    ├── services.html
    ├── signin.html
    ├── signup.html
    ├── terms.html
    └── testimonials.html
```

### Why this structure works

- `index.html` stays in the root so servers and hosting platforms find it automatically.
- `assets/` keeps all CSS, JS, and images cleanly separated from HTML.
- `img/` sits directly inside `assets/` — not inside `css/` — because images are unrelated to styles.
- `pages/` groups all inner HTML pages together, keeping the root clean.
- One `style.css` and one `main.js` keep the codebase simple and easy to maintain.
- Works out of the box on GitHub Pages, Netlify, Vercel, or any shared hosting.

---

## Linking Rules

Because `index.html` is in root and pages are inside `pages/`, links must be written correctly.

### From `index.html` → a page

```html
<a href="pages/about.html">About</a>
<a href="pages/contact.html">Contact</a>
```

### From a page → back to home or another page

```html
<!-- pages/about.html -->
<a href="../index.html">Home</a>
<a href="contact.html">Contact</a>   <!-- same folder, no ../ needed -->
```

### CSS, JS, and image paths inside pages

```html
<!-- pages/about.html -->
<link rel="stylesheet" href="../assets/css/style.css" />
<script src="../assets/js/main.js" defer></script>
<img src="../assets/img/hero-bg.png" alt="Hero" />
```

---

## Pages Included

### Home — `index.html`

Main marketing page for Quad Solutions.

- Sticky navigation header
- Hero section with healthcare background image
- CTA buttons
- Service highlights
- About preview
- Process preview
- Testimonials preview
- FAQ preview

### About — `pages/about.html`

Builds credibility and explains the company's operational value.

- Healthcare-focused positioning
- Accuracy and workflow clarity messaging
- Value cards for trust and professionalism

### Services — `pages/services.html`

Focused service page for core credentialing offerings.

- Provider Credentialing
- Insurance Enrollment
- Medical Billing Support
- Compliance and Documentation
- CAQH Profile Management

### Process / Workflow — `pages/process.html`

Explains the working model clearly and simply.

- Assessment
- Documentation
- Submission
- Approval

### Testimonials — `pages/testimonials.html`

Trust-building page that reinforces professional credibility.

- Doctor and clinic manager testimonials
- Clean quote card layout
- Healthcare business tone

### FAQ — `pages/faq.html`

Interactive question-and-answer page.

- Expand and collapse accordion
- Clean, readable answer blocks
- Accessible button states

### Contact — `pages/contact.html`

Lead generation page for consultations and inquiries.

- Contact information cards
- Consultation form
- Required field validation
- Service selection dropdown

### Sign In — `pages/signin.html`

Minimal, clean login page.

- Email and password fields
- Remember me option
- No visual clutter

### Sign Up — `pages/signup.html`

Minimal account request page.

- Full name, practice name, work email, phone number
- Primary need dropdown
- Password and confirm password fields

### Privacy Policy — `pages/privacy.html`

Standard privacy information page.

### Terms of Service — `pages/terms.html`

General website terms page. Should be reviewed by legal counsel before public launch.

---

## Asset Files

| File | Purpose |
|---|---|
| `assets/css/style.css` | Global design system — colors, layout, typography, responsive rules, animations |
| `assets/js/main.js` | Mobile menu, FAQ accordion, smooth scroll, form validation |
| `assets/img/hero-bg.png` | Home hero background image |
| `assets/img/about-bg.png` | About page hero background |
| `assets/img/services-bg.png` | Services page hero background |
| `assets/img/process-bg.png` | Process page hero background |
| `assets/img/testimonial-bg.png` | Testimonials page hero background |
| `assets/img/faq-bg.png` | FAQ page hero background |

---

## Design System

The visual direction is based on a clean healthcare brand style.

- **Backgrounds:** soft white and light clinical blue tones
- **Primary color:** teal — `#2b979f`
- **Dark tone:** muted navy — `#1f4b57`
- **Cards:** white or translucent white panels
- **Text:** dark slate for readability
- **Shadows:** soft and controlled for depth without clutter

---

## Class Naming Style

The site uses simple, readable class names so the code stays maintainable.

Examples: `top`, `nav`, `hero`, `card`, `grid`, `form`, `footer`, `btn`, `field`, `quote`, `faq`

---

## JavaScript Features

All interactivity is in `assets/js/main.js`.

- Mobile menu open and close
- Auto-close mobile menu on link click
- Close mobile menu on outside click or Escape key
- Smooth scrolling for hash links
- FAQ accordion expand and collapse
- Form validation for contact, sign-in, and sign-up forms
- Email, phone, password length, and confirm-password matching checks

---

## Accessibility

- Semantic HTML structure throughout
- `aria-label` on key navigation controls
- `aria-expanded` on menu and FAQ toggle buttons
- Associated `label` tags for every form field
- Live regions for form feedback
- Strong color contrast for text and buttons
- Reduced motion support via `prefers-reduced-motion`

---

## Deployment

This is a fully static website — no build step required.

Good hosting options:

- GitHub Pages
- Netlify
- Vercel
- cPanel / shared hosting

Just upload the project folder as-is and it works.

---

## How to Edit

| What to change | Where to edit |
|---|---|
| Page text or content | The relevant `.html` file |
| Colors, spacing, fonts | `assets/css/style.css` |
| Hero or page background images | `assets/img/` |
| Navigation, menu, form behavior | `assets/js/main.js` |

---

## Recommended Next Improvements

- Connect forms to a real backend or email service
- Add a custom SVG logo for Quad Solutions
- Add Open Graph and social preview metadata
- Compress images for production performance
- Add a favicon and web manifest
- Have legal counsel review `privacy.html` and `terms.html` before launch

---

## Summary

Quad Solutions is a clean, maintainable, professional healthcare website with a clear folder structure, simple class naming, responsive multi-page design, professional visual direction, accessible interactions, and full documentation for easy handoff and future maintenance.

---

*Designed and developed by M Asim Fayyaz — © 2026 Quad Solutions. All rights reserved.*
