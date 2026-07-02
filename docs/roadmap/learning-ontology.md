# Learning Ontology

## Purpose

This document defines the complete learning ontology for English OS: the structured vocabulary of what can be learned, how skills relate to subskills, how CEFR levels organize progression, and how all these entities connect to form coherent learning paths.

The ontology is the foundation of roadmap design, resource curation, progress tracking, review logic, and recommendation behavior.

---

## 1. CEFR Level System

English OS uses the Common European Framework of Reference (CEFR) as its level backbone.

### CEFR Levels Defined

| Level | Label | Learner Profile | English OS Role |
|-------|-------|-----------------|-----------------|
| PRE_A1 | True Beginner | Cannot form complete sentences. Knows isolated words. | Entry gate. Focus on building first sentence patterns and a basic personal vocabulary. |
| A1 | Beginner | Can introduce themselves. Can form simple sentences. Understands very slow clear speech. | Foundation layer. Consolidate sentence patterns, build daily vocabulary, start understanding simple input. |
| A2 | Elementary | Can handle routine situations. Can describe their background and environment. Can understand slow, clear input on familiar topics. | Comprehension and active use. Move from isolated practice to connected output. |
| B1 | Intermediate | Can handle travel situations. Can produce simple connected text. Can describe experiences and opinions. | Growth zone. Expand from personal to abstract topics. Improve fluency and coherence. |
| B2 | Upper Intermediate | Can understand complex texts. Can interact with fluency. Can produce detailed text on various topics. | Advanced consolidation. Focus on nuance, register, and sophisticated expression. |
| C1 | Advanced | Can understand demanding texts. Can express ideas fluently. Can use language flexibly. | Mastery refinement. Focus on precision, style, and near-native facility. |
| C2 | Proficient | Can understand virtually everything. Can summarize information. Can express themselves precisely. | Peak maintenance. Focus on sophistication, cultural reference, and stylistic range. |

### CEFR Overlap Zones

Learning does not happen in strict CEFR buckets. English OS uses overlapping ranges:

| Overlap Zone | Range | Design Principle |
|-------------|-------|-----------------|
| True Starter | PRE_A1 → A1 | Maximum scaffolding. Very short sessions. High repetition. |
| Early Foundation | A1 → A2 | Structured input. Controlled output. Confidence building. |
| Growth Bridge | A2 → B1 | Expand contexts. Introduce connected output. |
| Intermediate Core | B1 → B2 | Abstract topics. Extended discourse. Self-correction. |
| Advanced Reach | B2 → C1 | Nuance, register, style. Natural speed. |
| Mastery | C1 → C2 | Precision, cultural fluency, stylistic range. |

---

## 2. Skills

Six primary skills define the English OS learning model. They are equal in importance but sequenced differently depending on the learner's level and goal.

### Skill Definitions

| # | Skill | Slug | Core Question | Description |
|---|-------|------|---------------|-------------|
| 1 | Grammar | grammar | How do I build correct sentences? | The sentence patterns that help a learner build correct, understandable English. Grammar is the structural backbone that enables all other skills. |
| 2 | Vocabulary | vocabulary | What words do I need? | The everyday words and phrases a learner needs to understand and express routine life. Vocabulary is the fuel that powers communication. |
| 3 | Reading | reading | Can I understand written English? | Understanding written English without turning every sentence into a translation task. Reading builds familiarity with sentence patterns in context. |
| 4 | Listening | listening | Can I understand spoken English? | Understanding spoken English well enough to keep momentum and confidence. Listening is the primary channel for natural language acquisition. |
| 5 | Writing | writing | Can I express myself in writing? | Turning passive understanding into written output with growing accuracy. Writing develops precision and deliberate language use. |
| 6 | Speaking | speaking | Can I express myself orally? | Using spoken English regularly enough to reduce fear and build confidence. Speaking develops fluency and real-time processing. |

### Skill Relationships

```
                  ┌─────────────┐
                  │  GRAMMAR    │
                  │ (Structure) │
                  └──────┬──────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
   ┌─────────┐     ┌──────────┐     ┌──────────┐
   │VOCABULARY│     │  READING │     │ LISTENING│
   │ (Lexis)  │     │ (Input)  │     │ (Input)  │
   └────┬─────┘     └────┬─────┘     └────┬─────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                   ┌──────────┐     ┌──────────┐
                   │  WRITING │     │ SPEAKING │
                   │(Output)  │     │(Output)  │
                   └──────────┘     └──────────┘
```

**Design implication**: Grammar and vocabulary are foundational enablers. Reading and listening are input channels. Writing and speaking are output channels. Every roadmap block should address at least one skill from each category.

---

## 3. Subskills (Complete Ontology)

### 3.1 Grammar Subskills

| # | Slug | Title | CEFR Min | CEFR Max | Description |
|---|------|-------|----------|----------|-------------|
| 1 | simple-sentence-order | Simple sentence order | PRE_A1 | A1 | Using clear subject-verb-object patterns to produce basic statements. |
| 2 | be-and-basic-questions | Be verb and basic questions | A1 | A2 | Using be, yes-no questions, and short personal questions. |
| 3 | present-tenses | Present tenses | A1 | A2 | Using present simple for routines and present continuous for current actions. |
| 4 | past-tenses | Past tenses | A2 | B1 | Using past simple for completed actions and past continuous for background. |
| 5 | future-forms | Future forms | A2 | B1 | Using going to, will, and present continuous for future plans. |
| 6 | perfect-tenses | Perfect tenses | B1 | B2 | Using present perfect for experience, past perfect for sequence. |
| 7 | modals-and-conditionals | Modals and conditionals | B1 | B2 | Using can/should/must, zero and first conditionals, then second and third. |
| 8 | passive-and-reported-speech | Passive and reported speech | B1 | B2 | Shifting focus with passive voice and reporting what others said. |
| 9 | relative-clauses-and-complex-structures | Relative clauses and complex structures | B2 | C1 | Combining ideas with relative clauses, participles, and connectors. |
| 10 | advanced-modality-and-nuance | Advanced modality and nuance | C1 | C2 | Using modal perfect, inversion, hedging, and stylistic variation. |

### 3.2 Vocabulary Subskills

| # | Slug | Title | CEFR Min | CEFR Max | Description |
|---|------|-------|----------|----------|-------------|
| 1 | personal-information-vocabulary | Personal information vocabulary | PRE_A1 | A1 | Words for name, country, job, family, likes, and basic identity topics. |
| 2 | everyday-routines-vocabulary | Everyday routines vocabulary | A1 | A2 | Common verbs and phrases for time, habits, study, meals, and daily activities. |
| 3 | places-and-travel-vocabulary | Places and travel vocabulary | A2 | B1 | Words for locations, directions, transport, accommodation, and travel situations. |
| 4 | work-and-study-vocabulary | Work and study vocabulary | A2 | B1 | Vocabulary for jobs, education, skills, workplace communication, and study contexts. |
| 5 | descriptive-vocabulary | Descriptive vocabulary | B1 | B2 | Adjectives, adverbs, and phrases for describing people, places, emotions, and experiences. |
| 6 | abstract-and-opinion-vocabulary | Abstract and opinion vocabulary | B2 | C1 | Words for expressing opinions, arguments, beliefs, and discussing abstract topics. |
| 7 | register-and-formal-vocabulary | Register and formal vocabulary | B2 | C1 | Formal vs informal register, academic vocabulary, professional language. |
| 8 | idiomatic-and-stylistic-vocabulary | Idiomatic and stylistic vocabulary | C1 | C2 | Idioms, collocations, phrasal verbs, and culturally embedded expressions. |

### 3.3 Reading Subskills

| # | Slug | Title | CEFR Min | CEFR Max | Description |
|---|------|-------|----------|----------|-------------|
| 1 | reading-for-key-details | Reading for key details | PRE_A1 | A2 | Finding names, actions, times, and simple meaning in very short texts. |
| 2 | understanding-main-ideas | Understanding main ideas | A2 | B1 | Identifying the main point of short paragraphs and simple articles. |
| 3 | reading-for-specific-information | Reading for specific information | A2 | B1 | Scanning texts to find particular facts, numbers, or answers. |
| 4 | inference-and-context-clues | Inference and context clues | B1 | B2 | Guessing meaning from context and reading between the lines. |
| 5 | understanding-structure-and-cohesion | Understanding structure and cohesion | B1 | B2 | Following text organization, linking words, paragraph structure. |
| 6 | critical-reading-and-evaluation | Critical reading and evaluation | B2 | C1 | Evaluating arguments, identifying bias, assessing evidence. |
| 7 | reading-extended-texts | Reading extended texts | B2 | C1 | Maintaining comprehension across articles, essays, and longer narratives. |
| 8 | academic-and-specialized-reading | Academic and specialized reading | C1 | C2 | Reading research, technical content, literary texts, and dense prose. |

### 3.4 Listening Subskills

| # | Slug | Title | CEFR Min | CEFR Max | Description |
|---|------|-------|----------|----------|-------------|
| 1 | listening-for-gist | Listening for gist | PRE_A1 | A2 | Catching the main idea and a few key details without needing full comprehension. |
| 2 | recognizing-words-and-sounds | Recognizing words and sounds | A1 | A2 | Identifying known words in speech, separating sounds, understanding numbers and names. |
| 3 | listening-for-detail | Listening for detail | A2 | B1 | Understanding specific information in clear, slow speech on familiar topics. |
| 4 | following-instructions-and-narratives | Following instructions and narratives | A2 | B1 | Understanding directions, instructions, and simple stories in sequence. |
| 5 | understanding-opinions-and-attitudes | Understanding opinions and attitudes | B1 | B2 | Detecting speaker attitude, agreement, disagreement, and emotional tone. |
| 6 | following-extended-speech | Following extended speech | B1 | B2 | Maintaining comprehension across longer monologues, talks, and conversations. |
| 7 | understanding-inference-and-subtext | Understanding inference and subtext | B2 | C1 | Understanding implied meaning, humor, sarcasm, and indirect requests. |
| 8 | understanding-natural-speed-speech | Understanding natural speed speech | C1 | C2 | Following fast, natural speech with varied accents, colloquialisms, and background noise. |

### 3.5 Writing Subskills

| # | Slug | Title | CEFR Min | CEFR Max | Description |
|---|------|-------|----------|----------|-------------|
| 1 | short-personal-messages | Short personal messages | PRE_A1 | A2 | Writing short introductions, updates, and routine messages about real life. |
| 2 | basic-descriptions-and-narratives | Basic descriptions and narratives | A1 | A2 | Describing people, places, and daily routines in simple connected sentences. |
| 3 | informal-correspondence | Informal correspondence | A2 | B1 | Writing informal emails, messages to friends, and personal updates. |
| 4 | expressing-opinions-in-writing | Expressing opinions in writing | B1 | B2 | Writing opinion paragraphs, forum posts, and simple arguments with support. |
| 5 | structured-paragraphs-and-essays | Structured paragraphs and essays | B1 | B2 | Organizing ideas into clear paragraphs with topic sentences and conclusions. |
| 6 | formal-correspondence | Formal correspondence | B2 | C1 | Writing formal emails, letters of application, professional communication. |
| 7 | persuasive-and-argumentative-writing | Persuasive and argumentative writing | B2 | C1 | Constructing reasoned arguments, balancing viewpoints, persuasive techniques. |
| 8 | academic-and-professional-writing | Academic and professional writing | C1 | C2 | Writing reports, proposals, research summaries, and stylistically refined prose. |

### 3.6 Speaking Subskills

| # | Slug | Title | CEFR Min | CEFR Max | Description |
|---|------|-------|----------|----------|-------------|
| 1 | self-introduction-and-daily-talk | Self-introduction and daily talk | PRE_A1 | A2 | Sharing who you are, what you do, and how your day looks in simple spoken English. |
| 2 | describing-and-narrating | Describing and narrating | A1 | A2 | Describing people, places, and events in simple connected speech. |
| 3 | asking-for-and-giving-information | Asking for and giving information | A2 | B1 | Asking questions, giving directions, making requests, and handling routine transactions. |
| 4 | expressing-opinions-and-preferences | Expressing opinions and preferences | B1 | B2 | Stating opinions, agreeing/disagreeing, explaining preferences with reasons. |
| 5 | participating-in-discussions | Participating in discussions | B1 | B2 | Taking turns, responding to others, asking follow-up questions, keeping conversations going. |
| 6 | giving-presentations-and-talks | Giving presentations and talks | B2 | C1 | Organizing and delivering short talks with clear structure and audience awareness. |
| 7 | negotiating-and-persuading | Negotiating and persuading | B2 | C1 | Discussing options, compromising, persuading, and handling disagreements. |
| 8 | fluent-and-impromptu-speaking | Fluent and impromptu speaking | C1 | C2 | Speaking at length on unfamiliar topics, handling interruptions, spontaneous expression. |

---

## 4. Subskill Count Summary

| Skill | Subskills |
|-------|-----------|
| Grammar | 10 |
| Vocabulary | 8 |
| Reading | 8 |
| Listening | 8 |
| Writing | 8 |
| Speaking | 8 |
| **Total** | **50** |

---

## 5. Roadmap Stage Types

Four stage types form the structural backbone of every roadmap template.

| Type | Slug | Purpose | Position |
|------|------|---------|----------|
| FOUNDATION | foundation | Build essential knowledge and basic patterns. High structure, low ambiguity. Safe, repeatable, confidence-building. | Start |
| COMPREHENSION | comprehension | Expand ability to understand real (but accessible) input. Train gist, context, and tolerance for ambiguity. | Early-middle |
| ACTIVE_USE | active-use | Move from passive understanding into active production. Writing, speaking, and applied tasks. | Late-middle |
| CONSOLIDATION | consolidation | Reinforce, review, connect, and stretch. Fill weak areas, revisit earlier material, push toward next level. | End |

### Stage Type Relationships

```
FOUNDATION ──→ COMPREHENSION ──→ ACTIVE_USE ──→ CONSOLIDATION
     │               │                │               │
     │               │                │               │
     ▼               ▼                ▼               ▼
  Scaffolded     Input-focused     Production      Reflection +
  learning       + tolerance       + output        review + stretch
```

---

## 6. Roadmap Block Types

Within each stage, blocks follow a repeatable learning cycle.

| Type | Slug | Purpose | Typical Activities |
|------|------|---------|-------------------|
| LEARN | learn | Introduce new patterns, concepts, or vocabulary. | Structured input, explicit explanation, guided discovery, modeling. |
| PRACTICE | practice | Reinforce through guided exercises and repeated exposure. | Controlled practice, gap-fills, matching, multiple-choice, shadowing. |
| APPLY | apply | Use the material in meaningful, semi-authentic tasks. | Writing tasks, speaking prompts, project-based output, problem-solving. |
| CHECKPOINT | checkpoint | Assess, reflect, consolidate before moving to the next unit. | Self-assessment quiz, reflection prompt, review items, confidence check. |

### Block Cycle

```
        ┌─────────────────────────────────────────┐
        │                                         │
        ▼                                         │
    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
    │  LEARN   │───→│ PRACTICE │───→│  APPLY   │──┤
    └──────────┘    └──────────┘    └──────────┘  │
                                      │           │
                                      ▼           │
                                  ┌──────────┐    │
                                  │CHECKPOINT│────┘
                                  └──────────┘
```

Not every stage requires all four block types. The sequence adapts to the stage's purpose:
- **FOUNDATION** stages: LEARN → PRACTICE → CHECKPOINT (emphasize learning)
- **COMPREHENSION** stages: PRACTICE → APPLY (emphasize input exposure)
- **ACTIVE_USE** stages: PRACTICE → APPLY → CHECKPOINT (emphasize output)
- **CONSOLIDATION** stages: APPLY → CHECKPOINT (emphasize integration)

---

## 7. Ontology Relationships

### Entity Relationship Map

```
CEFR_LEVEL (PRE_A1 → C2)
    │
    ├── defines difficulty for ───→ SKILL ──→ SUB_SKILL
    │                                      │         │
    │                                      │         │
    │                                      ▼         ▼
    │                              ROADMAP_TEMPLATE
    │                                      │
    │                                      ▼
    │                              ROADMAP_STAGE (type: FOUNDATION|COMPREHENSION|ACTIVE_USE|CONSOLIDATION)
    │                                      │
    │                                      ▼
    │                              ROADMAP_BLOCK (type: LEARN|PRACTICE|APPLY|CHECKPOINT)
    │                              /          |          \
    │                              ▼          ▼          ▼
    │                         BLOCK_SKILL_MAP ───── RESOURCE
    │                              │                     │
    │                              ▼                     ▼
    │                         SUB_SKILL           RESOURCE_SKILL_MAP
    │                                                    │
    │                                                    ▼
    │                                              SUB_SKILL
    │
    └────────────────────────────────────────────────────┘
                     (CEFR ranges apply at every level)
```

### Mapping Rules

1. **Roadmap Template → CEFR**: Each template has a cefr_start and cefr_end that define its scope.
2. **Roadmap Stage → CEFR**: Each stage targets a narrower CEFR range within the template.
3. **Roadmap Block → CEFR**: Each block has specific cefr_start and cefr_end for its content.
4. **Block → Skill**: A block maps to one PRIMARY skill and 0-2 SUPPORTING skills.
5. **Block → Subskill**: A block maps to specific subskills at the appropriate CEFR level.
6. **Resource → CEFR**: Resources have a cefr range defining who they serve.
7. **Resource → Skill**: Resources map to one PRIMARY skill and 0-2 SUPPORTING skills.
8. **Resource → Subskill**: Resources map to specific subskills for precise recommendation.

---

## 8. Design Decisions

### Decision 1: Six Skills, Not Four

Some frameworks use four skills (reading, writing, listening, speaking). English OS adds grammar and vocabulary as explicit skills because:
- Self-learners need explicit grammar guidance (university programs embed it)
- Vocabulary acquisition needs structured attention for independent learners
- Separating them enables precise progress tracking and review targeting

### Decision 2: Overlapping CEFR Ranges, Not Strict Thresholds

Subskills use overlapping CEFR ranges (e.g., A1-A2, A2-B1) instead of single-level assignments. This reflects the reality that a learner may be A2 in vocabulary but A1 in speaking. Overlap ranges enable flexible recommendation and prevent premature level-locking.

### Decision 3: Four Stage Types, Not Levels

Stage types (FOUNDATION, COMPREHENSION, ACTIVE_USE, CONSOLIDATION) describe the learning **mode** rather than the level. This allows the same stage type to repeat across different CEFR bands with appropriate content. A B1 COMPREHENSION stage looks very different from an A1 COMPREHENSION stage, but both serve the same pedagogical purpose.

### Decision 4: Four Block Types Forming a Learning Cycle

The LEARN → PRACTICE → APPLY → CHECKPOINT cycle is deliberate. It ensures every learning unit includes:
- Explicit input (LEARN)
- Controlled reinforcement (PRACTICE)
- Meaningful use (APPLY)
- Reflection/assessment (CHECKPOINT)

This cycle is a proven pedagogical pattern (see: experiential learning cycles, gradual release of responsibility).

---

## 9. Status

Active.

## Related Docs

- [Coverage Matrix](./coverage-matrix.md)
- [Roadmap Expanded](./roadmap-expanded.md)
- [Resource Need Specs](./resource-need-specs.md)
- [Data Model](../system/data-model.md)
