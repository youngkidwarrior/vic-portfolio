# Campaign 4 Simplicity Implementation Plan

**Goal:** Make Victor's portfolio immediately understandable to nontechnical clients, founders, and designers.
**Scope:** Simplify the homepage and case studies, replace public evidence machinery with authentic cropped screenshots, and keep one claim and one primary action per section.
**Non-goals:** Rewriting the resume, inventing outcomes, or changing the approved Montréal Editorial palette.
**Risks:** Public screenshots may change when source sites change; aggressive editing must preserve the strongest measurable outcomes and accessible context.

### Files

- Create: `public/images/work/*.jpg`
- Modify: `app/data/site.ts`
- Modify: `app/routes/home.tsx`
- Modify: `app/components/selected-work/selected-work-composition.tsx`
- Modify: `app/components/project-page.tsx`
- Modify: `app/routes/work.*.tsx`
- Modify: `app/styles/app.css`
- Test: `tests/home-hero.test.tsx`
- Test: `tests/selected-work.test.tsx`
- Test: `tests/case-study.test.tsx`
- Test: `tests/design-system.test.ts`

### Task 1: Establish the public copy budget

- Status: complete
- Risk: low
- Outcome: Public tests reject approval states, evidence IDs, dense diagrams, and more than two project metrics.
- Steps:
  - Rewrite homepage and selected-work tests around the concise visitor experience.
  - Rewrite case-study tests around screenshot, challenge, contribution, result, and live link.
  - Run the targeted tests and confirm they fail against Campaign 3.
- Verification: `bun run test -- tests/home-hero.test.tsx tests/selected-work.test.tsx tests/case-study.test.tsx`
- Dependencies: none

### Task 2: Capture and crop authentic work

- Status: complete
- Risk: low
- Outcome: Send, PANTS, BrightID Bot, and GitHub screenshots are committed as deliberate project imagery.
- Steps:
  - Visit each public URL and capture its visible product state.
  - Crop around the strongest recognizable product or brand moment.
  - Store only the final crops in `public/images/work/`.
- Verification: inspect every final crop and confirm its dimensions.
- Dependencies: none

### Task 3: Simplify the homepage

- Status: complete
- Risk: medium
- Outcome: The homepage contains hero, selected work, recognition, about, and contact only.
- Steps:
  - Remove the hero proof system, practice band, systems taxonomy, recognition dossier, and duplicate availability block.
  - Render each project with one screenshot, one sentence, two outcomes, and one primary live-project link.
  - Reduce About to two sentences and keep the portrait.
- Verification: `bun run test -- tests/home-hero.test.tsx tests/selected-work.test.tsx tests/recognition-dossier.test.tsx`
- Dependencies: Task 1, Task 2

### Task 4: Simplify case studies

- Status: complete
- Risk: medium
- Outcome: Every case study reads as Challenge / Contribution / Result and stays under a client-friendly copy budget.
- Steps:
  - Add concise client stories and screenshots to the project content model.
  - Replace expanded proof, ownership ledger, evidence sequence, and long MDX rendering.
  - Keep two strong metrics and direct project links.
- Verification: `bun run test -- tests/case-study.test.tsx tests/site-data.test.ts`
- Dependencies: Task 1, Task 2

### Task 5: Validate and publish

- Status: complete
- Risk: medium
- Outcome: Campaign 4 is accessible, responsive, built, reviewed, and live.
- Steps:
  - Run the full quality gate and production build.
  - Inspect desktop and mobile screenshots for hierarchy, cropping, and overflow.
  - Record review notes, commit the coherent changeset, and publish the validated version.
- Verification: `bun run check` and `bun run build:sites`
- Dependencies: Tasks 3 and 4

### Task 6: Remove retired agent-facing presentation machinery

- Status: complete
- Risk: medium
- Outcome: Dead Campaign 1–3 presentation code and its internal review language no longer remain as a future regression path.
- Marked for removal:
  - `app/components/recognition-dossier.tsx`: candidate IDs, approval states, and artifact-review labels.
  - `app/components/product-proof.tsx`: evidence priority, approval slots, disclosures, and source counters.
  - `app/components/case-study/{evidence-sequence,expanded-proof,ownership-panel}.tsx`: numbered stages, evidence records, rights review, and ownership-ledger language.
  - `app/components/selected-work/{send-product-stage,shenanigan-archive,brightid-verification-path,open-source-ledger,evidence}.tsx`: source-linked badges, numbered ledgers, and evidence IDs.
  - Matching orphaned CSS and tests after confirming that no public route imports these components.
  - Internal evidence fields in `app/data/site.ts` only after their useful source links are preserved in a visitor-facing content model.
- Verification: search built pages for `agent-approved`, `human-pending`, candidate IDs, evidence counters, numbered project indices, and review-state labels.
- Dependencies: Task 5
