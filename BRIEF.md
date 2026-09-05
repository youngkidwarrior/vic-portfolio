# Portfolio Brief

## Purpose

The portfolio presents Victor Ginelli as a founder and full-stack product engineer. It is designed for founders, clients, designers, and engineering teams who need to understand his work quickly.

## Content

- Victor's identity, portrait, profile, and resume lead the experience.
- Project summaries use concise, visitor-facing language and show the full primary contribution scope rather than a single challenge or contribution.
- Claims remain grounded in the shared resume and approved evidence. Outcomes belong in the narrative; the interface does not use a separate metrics model.
- Project screenshots are authentic product views. Each screenshot links to the relevant live project, while the accompanying action opens the portfolio's project details.
- Technical detail belongs in the resume and project pages when it clarifies responsibility. Internal review language, evidence IDs, commit hashes, numbered stages, and temporary approval states never appear publicly.

## Visual direction

- The visual system follows a Montreal editorial and screen-print sensibility: warm off-white paper, saturated blue, red, yellow, and green, visible grain, bold typography, and flat editorial rules.
- Generated artwork functions as texture or accent rather than primary project evidence.
- Layouts avoid offset card effects, decorative interface chrome, and dense diagrams.
- Every section has one clear focus and no more copy than a nontechnical reader needs.

## Motion direction

- The portfolio is kinetic throughout. Pointer-reactive depth and coordinated movement demonstrate frontend craft while Victor and the work remain the focus.
- Desktop interaction uses bounded, spring-based pointer response. Touch devices receive scroll and tap equivalents without orientation permissions or scroll hijacking.
- Documentary project screenshots stay straight and readable. Movement belongs to surrounding ink, framing, hierarchy, and interaction feedback.
- Motion is an intentional product dependency. Optimize its delivery and measure runtime behavior; removing it solely for a smaller bundle does not satisfy the visual goal.
- Content remains readable before hydration, when JavaScript is unavailable, and with reduced motion enabled. Motion never holds navigation or reading behind an entrance sequence.
- Browser review covers entry, pointer movement and reset, touch response, route navigation, and both themes. Automated checks establish functional floors; Victor judges the final visual taste.
- The generated convergence, Send, Shenanigan, BrightID, and open-source prints remain visible supporting artwork. Hero and project choreography responds to their composition while the real portrait, project screenshots, and copy remain primary.
- Project details carry the screenshot and colored framing into the case study when the browser supports shared transitions. Returning from an internally opened project restores the originating position; direct case-study entries retain an All work destination.
- Artwork media remains replaceable independently of page choreography, so future animated assets can use the same framing and accessibility policy.
- The hero's Convergence entrance assembles the colored paths once, keeps the central ring and arrow intact, and holds the completed print. It begins when visible and resolves immediately to the original artwork with reduced motion.
- Generated prints appear enlarged as background accents around the portrait and authentic screenshots, with enough exposed ink for their motion to read. They do not occupy separate foreground panels or compete with Victor and the work. Timed assembly continues while the visitor holds the page still; scrolling may reveal the artwork but does not scrub its playback. A discreet replay control allows another viewing. Automatic sequences settle within five seconds, and reduced motion presents the completed print without playback controls.

## Quality bar

- The site remains accessible, responsive, and legible across desktop and mobile widths.
- Public images include useful alternative text, keyboard focus remains visible, and motion respects reduced-motion preferences.
- The web resume and downloadable one-page PDF derive from `content/resume.json`.
- The repository keeps raw references and local operating notes out of version control through `*.ignore.*` and `*.local.*` patterns.
- Publishing or merging any change that triggers a production deployment requires explicit owner approval.

## Decisions

- 2026-08-27: The Montreal editorial palette and textured paper treatment define the standing visual direction because they best reflect the approved references.
- 2026-08-27: Project sections present the totality of Victor's primary contributions because a single challenge/contribution/result frame understates the work.
- 2026-09-05: The original interview explicitly selected “Kinetic throughout,” “Pointer-reactive system,” and “Scroll and tap equivalents.” The owner reaffirmed that ambition after an audit removed Motion. The Montréal palette, human-centered opening, and concise content remain the standing visual constraints.
- 2026-08-27: Victor's identity and resume lead the site because the portfolio is human-centered rather than product-index-centered.
