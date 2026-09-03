# PLAN.md
# Museu de l'Etnicisme Català — MVP

## 0. MVP Objective

Build a **lightweight, static-first, source-driven interactive museum** documenting selected public statements by contemporary Catalan political figures and organisations concerning ethnicity, immigration, identity, religion, language and belonging.

The MVP should feel like a small digital museum rather than a political blog.

### The core visitor journey

```text
QR CODE
   ↓
LANDING PAGE
   ↓
ENTER MUSEUM
   ↓
EXHIBIT
   ↓
ORIGINAL SOURCE
   ↓
CONTEXT
   ↓
RELATED EXHIBITS
```

If this works beautifully, the MVP is successful.

Do **not** build a large database, accounts, comments, analytics system, sophisticated visualisations or elaborate gamification yet.

---

# 1. MVP Scope

## Build

- Landing page
- Museum index
- 3–5 thematic rooms
- 10–15 carefully researched exhibits
- Individual exhibit pages
- Primary-source screenshots/links
- Context and editorial analysis
- Person/organisation metadata
- Basic filtering
- Basic search
- Mobile-first responsive design
- QR-code entry point
- Source/correction methodology
- Static deployment
- Automated build/deployment

## Defer

- User accounts
- Public voting
- Comments
- Visitor tracking
- Advanced analytics
- Audio guides
- User submissions
- Public API
- Database
- Complex timeline
- Data visualisations
- CMS
- Multi-language interface
- Automated social-media ingestion
- AI-generated summaries
- Interactive vocabulary graphs
- Print-PDF generator
- Visitor-pass gamification
- Sophisticated "guess the quote" game

The MVP should be **small enough that one person can maintain it manually**.

---

# 2. Technology

Use:

```text
Astro
TypeScript
Markdown
CSS
minimal vanilla JavaScript
GitHub
Cloudflare Pages
```

No frontend framework is necessary.

The site should be statically generated.

### Why Astro?

The museum is primarily:

- text
- images
- metadata
- links
- editorial content

Astro allows the majority of the site to be generated as static HTML, keeping the visitor experience extremely fast.

---

# 3. Repository Structure

Keep the repository small.

```text
museu-etnicisme/
│
├── public/
│   ├── images/
│   │   └── exhibits/
│   └── favicon.svg
│
├── src/
│   ├── content/
│   │   ├── exhibits/
│   │   ├── people/
│   │   └── rooms/
│   │
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ExhibitCard.astro
│   │   ├── MuseumLabel.astro
│   │   ├── SourcePanel.astro
│   │   └── Filters.ts
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ExhibitLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── museu/
│   │   │   └── index.astro
│   │   ├── exhibits/
│   │   │   └── [...slug].astro
│   │   ├── persones/
│   │   │   └── [...slug].astro
│   │   ├── sobre.astro
│   │   └── correccions.astro
│   │
│   └── styles/
│       └── global.css
│
├── scripts/
│   └── validate-exhibits.ts
│
├── PLAN.md
├── README.md
├── package.json
└── astro.config.mjs
```

Do not create abstractions until they are needed.

---

# 4. Content Model

The MVP needs only three content types:

```text
Exhibit
Person
Room
```

No separate database of sources is necessary initially.

---

## 4.1 Exhibit

Each exhibit is one Markdown file.

Example:

```yaml
---
id: EX-2026-001

title: "Exhibit title"

date: "2026-02-14"

person:
  name: "Sílvia Orriols"
  slug: "silvia-orriols"

organisation:
  name: "Aliança Catalana"
  slug: "alianca-catalana"

room: "qui-es-catala"

topics:
  - identity
  - immigration

source:
  platform: "X"
  url: "https://..."
  archive_url: "https://..."

media:
  image: "/images/exhibits/EX-2026-001.webp"
  alt: "Screenshot of original post"

verification:
  status: "verified"
  checked: "2026-09-03"
---
```

Markdown body:

```markdown
## El que es va dir

> Exact quotation.

## Context

What prompted the statement and what was happening
around it.

## El que sabem

Relevant factual information.

## Lectura

Short editorial analysis explaining why the
statement is included in the museum.

## Fonts

- Primary source
- Secondary/contextual sources
```

---

# 5. Editorial Rule

The most important rule in the entire project:

> **Every exhibit must be independently verifiable.**

Before publication, verify:

```text
[ ] Original source found
[ ] Author confirmed
[ ] Date confirmed
[ ] Exact wording transcribed
[ ] Screenshot preserved
[ ] URL recorded
[ ] Context researched
[ ] Claims checked
[ ] Editorial interpretation separated from facts
```

If any of these cannot be established, **don't publish the exhibit yet**.

---

# 6. Number of Exhibits

Launch with:

## 10–15 exhibits

Do not attempt to document everything.

The initial collection should contain only the strongest examples.

A possible distribution:

```text
Identity / belonging       3
Immigration                3
Islam / religion           2
Crime / immigration        2
Language                   1–2
Other                      1–3
```

The precise selection should follow research rather than quotas.

---

# 7. Museum Rooms

Keep the MVP to **four or five rooms**.

## Sala 01 — QUI ÉS CATALÀ?

Statements concerning:

- Catalan identity
- belonging
- who can become Catalan
- cultural/ethnic definitions

---

## Sala 02 — LA INVASIÓ

Statements concerning:

- immigration
- demographic change
- "invasion"
- "replacement"
- "occupation"

---

## Sala 03 — NOSALTRES / ELLS

Statements explicitly distinguishing:

- Catalans / foreigners
- natives / immigrants
- "us" / "them"

---

## Sala 04 — RELIGIÓ

Statements concerning:

- Islam
- Muslims
- mosques
- religious integration
- religious identity

---

## Sala 05 — CRIM I IMMIGRACIÓ

Statements connecting:

- particular crimes
- immigrants
- nationalities
- demographic groups

This room requires especially careful sourcing and context.

---

# 8. Landing Page

The homepage should be extremely simple.

## Hero

```text
MUSEU
DE L'ETNICISME
CATALÀ

Una exposició sobre identitat,
immigració, nació i exclusió.

LES PECES SÓN REALS.
LES FONTS TAMBÉ.

[ ENTRAR AL MUSEU ]
```

Below it:

```text
10+ PECES
5 SALES
FONT PRIMÀRIA
```

Then one featured exhibit.

Then:

```text
EL MUSEU

Aquest projecte documenta i contextualitza
discursos públics sobre identitat nacional,
immigració, religió i pertinença.

No et demanem que ens creguis.

Mira les fonts.

[ SOBRE EL PROJECTE ]
```

---

# 9. Visual Identity

The design should immediately distinguish itself from a conventional activist website.

## Desired feeling

**Museum + archive + slightly unsettling satire.**

Use:

- warm off-white background
- black/dark typography
- one restrained accent colour
- thin borders
- serif exhibition headings
- sans-serif UI
- monospace catalogue metadata
- generous whitespace

Avoid:

- gradients
- enormous animations
- generic stock photography
- excessive red
- activist-poster aesthetics
- flashy JavaScript effects

The site should look almost respectable enough to be a real museum.

Then the content creates the discomfort.

---

# 10. Signature Museum Label

Every exhibit begins with:

```text
EXHIBIT
EX-2026-001

SALA 01
QUI ÉS CATALÀ?

SÍLVIA ORRIOLS
2026
```

This becomes a recurring visual element throughout the site.

---

# 11. Exhibit Page

The exhibit page is the heart of the MVP.

Structure:

```text
┌──────────────────────────────┐
│ EXHIBIT EX-2026-001          │
│ SALA 01                      │
│                              │
│ TITLE                        │
│                              │
│ Person                       │
│ Organisation                │
│ Date                         │
└──────────────────────────────┘

[ ORIGINAL SOURCE SCREENSHOT ]

ORIGINAL SOURCE
X · DATE

[ VIEW ORIGINAL ]

──────────────────────────────

EL QUE ES VA DIR

"Exact quotation..."

──────────────────────────────

CONTEXT

What was happening?

──────────────────────────────

EL QUE SABEM

What can actually be established?

──────────────────────────────

LECTURA

Editorial interpretation.

──────────────────────────────

FONTS

Primary + secondary sources.

──────────────────────────────

[ NEXT EXHIBIT ]
```

---

# 12. Primary Source Must Be Visually Dominant

The original source should appear before the editorial interpretation.

The visitor should encounter:

**evidence → context → interpretation**

not:

**interpretation → evidence**

This ordering is central to the project's credibility.

---

# 13. Screenshot Treatment

Screenshots should remain authentic.

Do not alter the original text.

Do not add coloured arrows or misleading highlights.

Instead:

```text
ORIGINAL

[ untouched screenshot ]

SOURCE
[link]

ARCHIVE
[link]
```

Any editorial annotation goes underneath.

---

# 14. Context Panel

Keep it short.

Aim for:

**100–250 words**

It should explain:

- what prompted the statement
- relevant circumstances
- whether the statement was later clarified
- important information that was known at the time

Avoid turning every exhibit into an essay.

---

# 15. Editorial Analysis

Aim for:

**50–150 words**

Explain why the exhibit matters.

Use precise language.

Prefer:

> "The statement excludes X from the speaker's definition of Catalan identity."

over:

> "This proves that X hates Y."

The first is demonstrable.

The second attributes an internal psychological state.

---

# 16. Source Panel

Use a simple component:

```text
PRIMARY SOURCE

Sílvia Orriols
X
14 February 2026

[ ORIGINAL POST ↗ ]

[ ARCHIVED COPY ↗ ]
```

Secondary sources appear separately:

```text
CONTEXTUAL SOURCES

Publication — Article
Publication — Article
```

---

# 17. Museum Index

`/museu/`

Show rooms first:

```text
SALAS

01  QUI ÉS CATALÀ?
02  LA INVASIÓ
03  NOSALTRES / ELLS
04  RELIGIÓ
05  CRIM I IMMIGRACIÓ
```

Then:

```text
TOTES LES PECES

EX-2026-001
EX-2026-002
EX-2026-003
...
```

---

# 18. Exhibit Cards

Minimal card:

```text
┌─────────────────────────────┐
│ EX-2026-004                 │
│                             │
│ "Short quotation..."        │
│                             │
│ SÍLVIA ORRIOLS              │
│ 2026                        │
│                             │
│ IMMIGRACIÓ                  │
│                             │
│ VEURE PEÇA →                │
└─────────────────────────────┘
```

Cards should be highly reusable.

---

# 19. Basic Filtering

Implement only:

- room
- person
- topic

No sophisticated search UI initially.

Query parameters:

```text
/museu/?room=immigration
/museu/?person=silvia-orriols
/museu/?topic=islam
```

This can be implemented with ordinary client-side TypeScript.

---

# 20. Search

If the initial 10–15 exhibits are easily browsable, **search can initially be omitted**.

If included, use Astro's static search capabilities rather than building a backend.

The important thing is that the museum remains static.

---

# 21. Person Pages

Create only when there are at least two exhibits associated with a person.

Example:

```text
/persones/silvia-orriols/
```

Display:

```text
SÍLVIA ORRIOLS

Selected documented exhibits:

EX-2026-001
EX-2026-004
EX-2026-009
```

No biography beyond what is necessary.

---

# 22. About Page

`/sobre/`

Keep this concise.

Sections:

### What is this?

### Why does it exist?

### Editorial methodology

### Source policy

### Corrections policy

### Independence

Explicitly state that the museum is independent and is not affiliated with Aliança Catalana or any other organisation it documents.

---

# 23. Corrections Page

`/correccions/`

Initially this can simply be a Markdown page.

If something is wrong:

```text
CORRECCIÓ — 2026-09-XX

EX-2026-004

What was incorrect:
...

Correction:
...

Source:
...
```

Never silently alter an important factual claim.

---

# 24. QR Code

The MVP needs **one canonical QR destination**:

```text
https://YOUR-DOMAIN/museu/
```

Use this on:

- posters
- stickers
- counter-protest materials
- flyers

Do not make QR infrastructure complicated yet.

The museum index is the safest destination because it remains useful even as exhibits change.

---

# 25. Mobile First

Assume most visitors arrive from a QR code on a phone.

Design at:

```text
320px
375px
390px
430px
```

before desktop.

The exhibit page must work beautifully on a phone.

The screenshot should be readable without requiring horizontal scrolling.

---

# 26. Performance Target

Aim for:

```text
Static HTML
Minimal JS
Compressed images
No autoplay video
No heavy frameworks
No tracking scripts
```

A visitor scanning the QR should see meaningful content almost immediately.

---

# 27. Images

For each exhibit:

```text
public/images/exhibits/EX-2026-001.webp
```

Use WebP/AVIF where appropriate.

Keep original archival files outside the public build if they are large.

The website needs the display version, not the entire archival collection.

---

# 28. Content Validation

Implement:

```bash
npm run validate
```

It should check:

- unique exhibit IDs
- required metadata
- valid dates
- valid room
- person references
- image existence
- source URL presence

Example failure:

```text
ERROR EX-2026-007

Missing:
primary_source.url
```

The build should fail.

---

# 29. Development Workflow

## Start

```bash
npm install
npm run dev
```

## Add exhibit

Create:

```text
src/content/exhibits/EX-2026-016.md
```

Add image:

```text
public/images/exhibits/EX-2026-016.webp
```

Run:

```bash
npm run validate
npm run build
```

Preview locally.

Then commit.

---

# 30. Git Workflow

Use:

```text
main
```

for production.

For exhibits:

```text
exhibit/EX-2026-016
```

For corrections:

```text
fix/EX-2026-004
```

Merge only after editorial review.

---

# 31. Deployment

Use **Cloudflare Pages** connected to the GitHub repository.

Production:

```text
GitHub
   ↓
push to main
   ↓
Cloudflare build
   ↓
Astro static generation
   ↓
dist/
   ↓
production
```

Build command:

```text
npm run build
```

Output:

```text
dist
```

No server or database is required.

---

# 32. Deployment Checklist

Before launch:

```text
[ ] Production build succeeds
[ ] All exhibits validate
[ ] All source links work
[ ] All images load
[ ] Mobile tested
[ ] Desktop tested
[ ] 404 page exists
[ ] Favicon exists
[ ] Sitemap exists
[ ] robots.txt exists
[ ] HTTPS active
[ ] Canonical domain configured
[ ] QR tested with multiple phones
```

---

# 33. MVP Content Production Process

Do not begin by building the entire dataset.

Instead:

### Step 1

Research 30–40 candidate statements.

### Step 2

Discard weak or ambiguous examples.

### Step 3

Select the strongest 10–15.

### Step 4

Independently verify each.

### Step 5

Write concise context.

### Step 6

Have another person read the exhibit if possible.

### Step 7

Publish.

This is much more valuable than building sophisticated technology around weak evidence.

---

# 34. Exhibit Quality Standard

An exhibit should satisfy:

### Evidence

Can a visitor independently find the original?

### Relevance

Does it genuinely illuminate the museum's subject?

### Context

Could someone misunderstand it without additional information?

### Precision

Are we describing what the statement actually establishes?

### Restraint

Are we avoiding claims that go beyond the evidence?

If an exhibit fails any of these, fix it before publishing.

---

# 35. MVP Visual Components

Only build these reusable components:

```text
Header
Footer
MuseumLabel
ExhibitCard
SourcePanel
RoomCard
```

Everything else can be ordinary Astro markup.

Don't build a component library.

---

# 36. MVP Interactive Component

Build **one** distinctive interaction:

## Context Reveal

On the exhibit page:

```text
┌───────────────────────────────┐
│ WHAT YOU SEE                  │
│                               │
│ "quotation..."                │
│                               │
│ + SHOW CONTEXT                │
└───────────────────────────────┘
```

Click:

```text
┌───────────────────────────────┐
│ WHAT YOU SEE                  │
│                               │
│ "quotation..."                │
│                               │
│ CONTEXT                       │
│                               │
│ preceding event...             │
│ surrounding statement...      │
│ subsequent clarification...   │
└───────────────────────────────┘
```

This is enough interactivity for the MVP.

Do not build five different games.

---

# 37. Landing Page Tone

The landing page should establish the project's voice.

Possible copy:

```text
MUSEU
DE L'ETNICISME CATALÀ

Una exposició permanent
sobre identitat, nació,
immigració i exclusió.

Les peces són reals.
Les fonts també.

NO T'HO HEM DE DIR.
MIRA-HO TU MATEIX.

[ ENTRAR AL MUSEU ]
```

The exact wording should be finalised after the visual design is established.

---

# 38. Editorial Tone

The site should be:

**sharp, not hysterical.**

Good:

> "The statement explicitly distinguishes between people considered Catalan and people who, regardless of residence, are said never to become Catalan."

Bad:

> "Look at this disgusting monster."

The museum should make the **source** uncomfortable, not the website's adjectives.

---

# 39. What Makes It Distinctive

The project's signature formula:

```text
ARCHIVE AESTHETIC
        +
PRIMARY SOURCES
        +
SHORT CONTEXT
        +
DARK HUMOUR
        +
MOBILE QR EXPERIENCE
```

Nothing more is required for version 1.

---

# 40. Definition of Done

The MVP is finished when:

### Visitor experience

- [ ] QR opens the museum
- [ ] Landing page communicates concept immediately
- [ ] Museum has 4–5 rooms
- [ ] 10–15 exhibits are live
- [ ] Every exhibit has primary sourcing
- [ ] Every exhibit has context
- [ ] Every exhibit works on mobile
- [ ] Visitor can navigate from one exhibit to another
- [ ] Visitor can reach original sources

### Technical

- [ ] Astro build works
- [ ] TypeScript checks pass
- [ ] Exhibit validation passes
- [ ] Git repository is clean
- [ ] Cloudflare deployment works
- [ ] HTTPS works
- [ ] QR works

### Editorial

- [ ] Sources independently checked
- [ ] No fabricated quotations
- [ ] No misleading crops
- [ ] Fact and interpretation separated
- [ ] Corrections mechanism exists
- [ ] Project independence disclosed

---

# 41. Explicitly Deferred Roadmap

These are **version 2+**, not MVP requirements.

## V2

- Full-text search
- Timeline
- More rooms
- 50–100 exhibits
- richer person pages
- richer organisation pages
- source archive
- quote wall
- better filtering

## V3

- Interactive data visualisation
- vocabulary analysis
- historical comparisons
- multilingual interface
- contributor workflow
- private editorial submission system

## V4

- Public dataset/API
- audio guide
- physical exhibition generator
- advanced archival infrastructure

These should only be built if the collection actually grows enough to justify them.

---

# 42. Priority Order

If development time becomes constrained, implement in exactly this order:

```text
1. Exhibit content
2. Exhibit page
3. Source presentation
4. Mobile design
5. Landing page
6. Museum index
7. Rooms
8. Basic filtering
9. Validation
10. Deployment
11. QR
12. Everything else
```

**Content quality comes before technical sophistication.**

---

# 43. The MVP Philosophy

The first release should feel almost suspiciously simple.

A visitor scans a QR.

They see:

> **MUSEU DE L'ETNICISME CATALÀ**

They enter.

They see an authentic statement.

They click the source.

They read the context.

They look at another exhibit.

They leave with a different understanding of what was actually said.

That's the product.

Everything else is infrastructure for making that experience better later.