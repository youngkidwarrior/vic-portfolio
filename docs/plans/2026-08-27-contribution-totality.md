# Contribution Totality Implementation Plan

**Goal:** Present the full scope of Victor's primary work on every project without returning to dense technical or evidence-review language.
**Scope:** Replace the single Challenge / Contribution / Result story with resume-grounded contribution lists on the homepage and project pages.
**Non-goals:** Add unverified claims, reproduce the full resume inside each project, change the approved visual palette, or publish without explicit approval.
**Risks:** Longer project sections can weaken scanability; concise titles and one-sentence descriptions must preserve the resume's meaning without overwhelming a nontechnical reader.

### Files

- Modify: `app/data/site.ts`
- Modify: `app/components/selected-work/selected-work-composition.tsx`
- Modify: `app/components/project-page.tsx`
- Modify: `app/styles/app.css`
- Modify: `tests/site-data.test.ts`
- Modify: `tests/selected-work.test.tsx`
- Modify: `tests/case-study.test.tsx`

### Task 1: Define the complete project scope

- Status: complete
- Risk: medium
- Outcome: Each project has a concise contribution list grounded in `resume.ignore.md`.
- Steps:
  - Replace `clientStory` with a reusable `contributions` collection.
  - Represent every primary resume contribution without inventing new outcomes.
  - Keep contribution titles legible to founders, clients, and designers.
- Verification: `bun run test -- tests/site-data.test.ts`
- Dependencies: none

### Task 2: Redesign project summaries

- Status: complete
- Risk: medium
- Outcome: Every homepage project section shows the breadth of Victor's work at a glance.
- Steps:
  - Add a compact, unnumbered scope list beneath the project summary.
  - Preserve the authentic screenshot, two strongest outcomes, and project actions.
  - Avoid cards, badges, numbered stages, and internal review language.
- Verification: `bun run test -- tests/selected-work.test.tsx`
- Dependencies: Task 1

### Task 3: Redesign project pages

- Status: complete
- Risk: medium
- Outcome: Project pages center on “What Victor built” and show the totality of contributions in an editorial list.
- Steps:
  - Remove Challenge / Contribution / Result headings and copy.
  - Render each contribution with a short title and one-sentence explanation.
  - Keep outcomes and live project links distinct from the scope-of-work list.
- Verification: `bun run test -- tests/case-study.test.tsx`
- Dependencies: Task 1

### Task 4: Validate and prepare a release

- Status: complete
- Risk: low
- Outcome: The revised portfolio is tested, built, reviewed, and saved as a deployable version.
- Steps:
  - Run targeted tests, type checks, the full quality gate, and the Sites build.
  - Review the diff and record hunk notes.
  - Commit the coherent changeset and save a new Sites version.
- Verification: `bun run check` and `bun run build:sites`
- Dependencies: Tasks 2 and 3
