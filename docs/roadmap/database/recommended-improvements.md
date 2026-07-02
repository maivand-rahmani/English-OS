# Recommended Schema Improvements

## Purpose

This document proposes targeted schema improvements based on the analysis in [Schema Review](./schema-review.md), [Coverage Matrix](../coverage-matrix.md), and the resource research pipeline needs.

All proposals are categorized as:

| Priority | Meaning |
|----------|---------|
| **P0** | Critical for next phase of work |
| **P1** | Important but not blocking |
| **P2** | Nice to have / future-facing |

---

## P0: Resource Candidates Table

### Problem

Phase 2 (Hidden Gem Research) will generate hundreds of candidate resources. Each candidate needs tracking fields: evaluation scores, evidence links, CEFR mapping, skill mapping, approval status, and notes.

The current `resources` table only stores **approved** resources. There is no staging area for pre-approval candidates.

### Proposal

Create a `resource_candidates` table:

```prisma
enum CandidateStatus {
  RAW
  EVALUATED
  APPROVED
  REJECTED
  DUPLICATE
}

enum EvidenceStrength {
  ANECDOTAL
  COMMUNITY_CONSENSUS
  EXPERT_ENDORSEMENT
  LEARNER_TESTIMONIALS
  PEDAGOGICAL_ANALYSIS
}

model ResourceCandidate {
  id              String          @id @default(cuid())
  slug            String          @unique
  title           String
  sourceName      String          @map("source_name")
  url             String          @db.Text
  creator         String?
  platform        String?         // YouTube, Reddit, Blog, GitHub, etc.
  description     String?         @db.Text
  resourceType    ResourceType?   @map("resource_type")
  resourceFormat  ResourceFormat? @map("resource_format")
  accessType      ResourceAccessType? @map("access_type")
  difficulty      ResourceDifficulty?
  cefrStart       CefrLevel?      @map("cefr_start")
  cefrEnd         CefrLevel?      @map("cefr_end")

  // Evaluation fields
  status          CandidateStatus @default(RAW)
  pedagogicalScore    Int?        @map("pedagogical_score")    // 1-10
  hiddenGemScore      Int?        @map("hidden_gem_score")    // 1-10
  englishOsFit        Int?        @map("english_os_fit")      // 1-10
  roadmapFit          Int?        @map("roadmap_fit")         // 1-10
  confidence          Int?        @map("confidence")          // 1-10
  evidenceStrength    EvidenceStrength? @map("evidence_strength")

  // Curation fields
  whyRecommended   String?        @db.Text @map("why_recommended")
  bestUseCase      String?        @db.Text @map("best_use_case")
  recommendedSessionLength Int?   @map("recommended_session_length")
  learnerProfile   String?        @db.Text @map("learner_profile")
  followUpHint     String?        @db.Text @map("follow_up_hint")

  // Evidence
  communityEvidence  String?      @db.Text @map("community_evidence")
  learnerEvidence    String?      @db.Text @map("learner_evidence")
  researchNotes      String?      @db.Text @map("research_notes")
  searchQueries      String?      @db.Text @map("search_queries") // JSON array

  // Audit
  reviewedBy       String?        @map("reviewed_by")
  reviewedAt       DateTime?      @map("reviewed_at")
  rejectionReason  String?        @db.Text @map("rejection_reason")

  // Links to approved resource (if approved)
  approvedResourceId String?      @unique @map("approved_resource_id")

  createdAt        DateTime       @default(now()) @map("created_at")
  updatedAt        DateTime       @updatedAt @map("updated_at")

  approvedResource Resource?      @relation(fields: [approvedResourceId], references: [id])

  @@index([status])
  @@index([pedagogicalScore])
  @@index([cefrStart, cefrEnd])
  @@index([resourceType])
  @@map("resource_candidates")
}
```

### Candidate → Skill/Subskill Maps

```prisma
model ResourceCandidateSkillMap {
  id            String             @id @default(cuid())
  candidateId   String             @map("candidate_id")
  skillId       String             @map("skill_id")
  subskillId    String?            @map("subskill_id")
  emphasis      MapStrength        @default(PRIMARY)
  candidate     ResourceCandidate  @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  skill         Skill              @relation(fields: [skillId], references: [id], onDelete: Cascade)
  subskill      Subskill?          @relation(fields: [subskillId], references: [id], onDelete: SetNull)

  @@index([candidateId])
  @@index([skillId])
  @@map("resource_candidate_skill_maps")
}
```

### Benefits

- Clean pipeline from research → evaluation → approval → production
- Preserves evaluation scores and evidence for audit
- Prevents loss of rejected candidates (useful for future re-evaluation)
- `approved_resource_id` creates a traceable link from candidate → published resource

### Migration Strategy

1. Add `resource_candidates` table
2. Add `resource_candidate_skill_maps` table
3. No changes to existing tables required
4. All existing resources can optionally be backfilled as APPROVED candidates

---

## P0: Expanded Subskill Data

### Problem

The current `subskills` table uses string-based `cefr_min` and `cefr_max` fields. For precise recommendation and progress tracking, subskills should also store prerequisite relationships and progressive difficulty levels.

### Proposal

Expand the `subskills` model with:

```prisma
model Subskill {
  // ... existing fields ...
  prerequisiteId  String?       @map("prerequisite_id")  // Optional prerequisite subskill
  learningObjective String?     @db.Text @map("learning_objective") // "By the end of this subskill, the learner can..."
  keywords        String?       @db.Text // Searchable keywords for resource matching
  
  prerequisite    Subskill?     @relation("SubskillPrerequisite", fields: [prerequisiteId], references: [id])
  dependents      Subskill[]    @relation("SubskillPrerequisite")
}
```

### Benefits

- Prerequisite chains enable intelligent roadmap sequencing
- Learning objectives make subskill purpose explicit
- Keywords improve resource-to-subskill matching algorithms

### Migration Strategy

1. Add optional fields to existing `subskills` table
2. No data migration needed (null-safe additions)

---

## P1: Resource Creator/Platform Split

### Problem

The `resources.source_name` field conflates creator (BBC, British Council) with platform (YouTube, Website).

### Proposal

Add optional `creator_name` and `platform` fields:

```prisma
model Resource {
  // ... existing fields ...
  creatorName   String?       @map("creator_name")    // e.g., "BBC", "VOA"
  platform      String?                               // e.g., "YouTube", "Website"
}
```

Or, for maximum flexibility, add a `ResourceSource` model:

```prisma
model ResourceSource {
  id        String     @id @default(cuid())
  name      String     @unique
  slug      String     @unique
  platform  String?    // YouTube channel, website, podcast platform
  url       String?    @db.Text
  createdAt DateTime   @default(now()) @map("created_at")

  resources Resource[]

  @@map("resource_sources")
}
```

### Benefits

- Clean attribution (creator vs platform)
- Filterable by platform (e.g., "all YouTube resources")
- Future: link to creator pages, channel metadata

### Migration Strategy

- P1 — can be deferred. `source_name` is functional for V1.
- If `ResourceSource` model is added, migrate via: move unique `source_name` values to `resource_sources`, then add `source_id` FK to `resources`.

---

## P1: Writing Task Type Expansion

### Problem

The current `WritingTaskType` enum has 4 values. For full roadmap coverage, additional types would improve variety.

### Proposal

Add to enum:

```prisma
enum WritingTaskType {
  SHORT_GUIDED_RESPONSE
  JOURNAL_REFLECTION
  OPINION_PARAGRAPH
  PRACTICAL_RESPONSE
  DESCRIPTIVE_PARAGRAPH   // NEW
  EMAIL_MESSAGE           // NEW
  STORY_COMPLETION        // NEW
  SUMMARY                 // NEW (B1+)
  FORMAL_EMAIL            // NEW (B2+)
  ARGUMENTATIVE_ESSAY     // NEW (B2+)
}
```

### Benefits

- More diverse writing practice across CEFR levels
- Better alignment with real-world writing needs
- Enables more specific roadmap-to-practice connections

---

## P1: Roadmap Block Template Expansion

### Problem

The `roadmap_blocks` table lacks fields for:
- Learner-facing learning objectives
- Success criteria
- Completion requirements
- Estimated total time (vs per-session time)

### Proposal

```prisma
model RoadmapBlock {
  // ... existing fields ...
  learningObjectives String?   @db.Text @map("learning_objectives")  // "After this block, you will be able to..."
  successCriteria    String?   @db.Text @map("success_criteria")     // "You have completed this block when..."
  completionType     String?   @map("completion_type")               // "all_resources_completed" | "checkpoint_passed" | "any_one"
}
```

### Benefits

- Clearer learner-facing guidance in roadmap UI
- Machine-readable completion rules for progress tracking
- Better alignment with checkpoint blocks

---

## P2: Resource Collections

### Problem

The data model document defines `resource_collection` and `resource_collection_item`, but V1 has no grouping mechanism beyond individual block-resource links.

### Proposal

```prisma
model ResourceCollection {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  summary     String?  @db.Text
  isFeatured  Boolean  @default(false) @map("is_featured")
  createdAt   DateTime @default(now()) @map("created_at")

  items       ResourceCollectionItem[]

  @@map("resource_collections")
}

model ResourceCollectionItem {
  id           String              @id @default(cuid())
  collectionId String              @map("collection_id")
  resourceId   String              @map("resource_id")
  sortOrder    Int                 @default(0) @map("sort_order")
  note         String?             @db.Text
  collection   ResourceCollection  @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  resource     Resource            @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@unique([collectionId, resourceId])
  @@index([collectionId])
  @@index([resourceId])
  @@map("resource_collection_items")
}
```

### Benefits

- Thematic groupings beyond individual blocks
- "Hidden gems" collection, "Best for pronunciation" collection, etc.
- Featured collections on dashboard

---

## P2: Pronunciation / Phonetics Entity

### Future-Proofing

```prisma
model PronunciationTarget {
  id         String   @id @default(cuid())
  slug       String   @unique
  phoneme    String                 // e.g., /θ/, /ð/, /ɪ/, /i:/
  description String? @db.Text
  cefrLevel  CefrLevel? @map("cefr_level")
  difficulty ResourceDifficulty
  createdAt  DateTime @default(now()) @map("created_at")

  // Could link to resources, speaking prompts, subskills
  @@map("pronunciation_targets")
}
```

---

## Priority Summary

| Priority | Change | Effort | Impact | When |
|----------|--------|--------|--------|------|
| **P0** | Resource Candidates table | Medium | High | Before Phase 2 |
| **P0** | Subskills prerequisite/objective fields | Low | Medium | Before Phase 2 |
| **P1** | Creator/platform split | Low | Medium | After Phase 2 |
| **P1** | Writing task type expansion | Low | Medium | After Phase 2 |
| **P1** | Block template expansion | Low | Medium | After Phase 2 |
| **P2** | Resource Collections | Medium | Medium | V2 |
| **P2** | Pronunciation targets | Low | Low | V2+ |

---

## Decision: Resource Candidates Table

**Strongly recommended before Phase 2 begins.**

Without this table, the output of hidden-gem research has no structured home. Candidates would be tracked in JSON files, spreadsheets, or lost in conversation history. The `resource_candidates` table ensures every researched resource is captured with its evaluation data and can flow through a defined approval pipeline.

### Implementation Note

The `resource_candidates` table does **not** need to be added to Prisma before Phase 2 begins. The research phase can output structured JSON files that follow the same schema. Adding the Prisma model can be done in Phase 4 (Production Integration) when candidates are ready for migration to production.

However, if Prisma migration capacity is available now, adding it immediately is cleaner.

---

## Status

Draft — proposals are recommendations, not decisions. Each requires approval before implementation.

## Related Docs

- [Schema Review](./schema-review.md)
- [Coverage Matrix](../coverage-matrix.md)
- [Resource Need Specs](./resource-need-specs.md)
- [Data Model](../../system/data-model.md)
