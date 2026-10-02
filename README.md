# Orizon — animated property landing page

A responsive, static landing page developed from the supplied curved villa hero reference.

## Preview locally

Serve the project root using a static server:

```bash
npx serve .
```

Open the URL printed by the server. No build step or API key is required.

## Features

- Full-screen sculptural villa hero and custom glass card with a curved logo recess.
- GSAP / ScrollTrigger background parallax, scroll-linked card stacking and section motion.
- SplitType word and character reveals.
- Lenis smooth wheel scrolling on pointer-based devices; native touch scrolling on mobile.
- Property filtering, property detail dialogs, persistent saved homes and a budget-based shortlist builder.
- Reduced-motion support, a manual motion toggle, keyboard controls and responsive layouts.

## Files

`index.html`, `style.css`, `landing.css`, `app.js`, `landing.js`, `motion.js`, three WebP images and `vendor/` contain the complete site. `vercel.json` configures static hosting with no framework build.

Third-party animation libraries are pinned and vendored locally: GSAP 3.13.0, ScrollTrigger 3.13.0, SplitType 0.3.4 and Lenis 1.3.11. Their source license notices are retained. Google Fonts and the small profile avatar are external requests.

## Demo content

The residences, addresses, prices and counts are illustrative, not live property listings. Architectural photographs are AI-generated. Saved homes remain in the current browser's local storage. The shortlist builder runs locally and does not collect personal data, send email or contact an agent. There is no live listings backend, account authentication or mortgage service.

The user requested no browser QA; the source was prepared without a browser QA pass.
