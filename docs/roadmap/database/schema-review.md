# Schema Review

## Purpose

This document analyzes the current English OS database schema for correctness, completeness, and fitness for the curated learning system mission.

It identifies strengths, potential issues, gaps, and improvement opportunities.

---

## Schema Overview (17 Tables)

| # | Table | Purpose | Status |
|---|-------|---------|--------|
| 1 | `_prisma_migrations` | Prisma migration tracking | ✅ Prisma-managed |
| 2 | `users` | User accounts (Auth.js) | ✅ Standard |
| 3 | `accounts` | OAuth provider accounts | ✅ Standard |
| 4 | `sessions` | Auth sessions | ✅ Standard |
| 5 | `verification_tokens` | Email verification | ✅ Standard |
| 6 | `learner_profiles` | Learner metadata & level | ✅ Schema complete |
| 7 | `skills` | Core language skills | ✅ Complete (6 skills) |
| 8 | `subskills` | Specific learning targets | ⚠️ Needs expansion |
| 9 | `roadmap_templates` | Reusable roadmap structures | ✅ Well-designed |
| 10 | `roadmap_stages` | Major stages within a template | ✅ Well-designed |
| 11 | `roadmap_blocks` | Learning units within a stage | ✅ Well-designed |
| 12 | `block_skill_maps` | Links blocks to skills/subskills | ✅ Well-designed |
| 13 | `resources` | Curated external resources | ✅ Well-designed |
| 14 | `resource_skill_maps` | Links resources to skills/subskills | ✅ Well-designed |
| 15 | `roadmap_block_resources` | Links resources to blocks | ✅ Well-designed |
| 16 | `writing_tasks` | Curated writing prompts | ⚠️ Needs expansion |
| 17 | `speaking_prompts` | Curated speaking prompts | ⚠️ Needs expansion |

---

## Enum Review

### CefrLevel

```prisma
enum CefrLevel {
  PRE_A1
  A1
  A2
  B1
  B2
  C1
  C2
}
```

**Assessment**: ✅ Complete. Covers the full CEFR spectrum.

### RoadmapTemplateAudience

```prisma
enum RoadmapTemplateAudience {
  BEGINNER_SELF_LEARNER
  INTERMEDIATE_STUCK_SELF_LEARNER
}
```

**Assessment**: ✅ Appropriate for V1. Could be extended later (ADVANCED, EXAM_PREP, etc.).

### RoadmapStageType

```prisma
enum RoadmapStageType {
  FOUNDATION
  COMPREHENSION
  ACTIVE_USE
  CONSOLIDATION
}
```

**Assessment**: ✅ Well-designed. Four types cover the complete learning cycle for any level.

### RoadmapBlockType

```prisma
enum RoadmapBlockType {
  LEARN
  PRACTICE
  APPLY
  CHECKPOINT
}
```

**Assessment**: ✅ Well-designed. Maps to the experiential learning cycle.

### ResourceType

```prisma
enum ResourceType {
  COURSE
  VIDEO_SERIES
  VIDEO
  ARTICLE
  EXERCISE_SET
  PODCAST
  TOOL
  REFERENCE
}
```

**Assessment**: ✅ Appropriate breadth. Consider adding `WEBSITE` and `CHANNEL` for platforms like YouTube channels.

### ResourceFormat

```prisma
enum ResourceFormat {
  VIDEO
  AUDIO
  TEXT
  INTERACTIVE
  MIXED
}
```

**Assessment**: ✅ Complete.

### ResourceUseCase

```prisma
enum ResourceUseCase {
  FOUNDATION
  PRACTICE
  REFERENCE
  IMMERSION
  REVIEW
}
```

**Assessment**: ✅ Well-aligned with the learning ontology.

### ResourceAccessType

```prisma
enum ResourceAccessType {
  FREE
  FREEMIUM
  PAID
}
```

**Assessment**: ✅ Appropriate.

### ResourceDifficulty

```prisma
enum ResourceDifficulty {
  GENTLE
  STANDARD
  STRETCH
}
```

**Assessment**: ✅ Well-named. The three tiers map naturally to learner confidence levels.

### RoadmapBlockResourceRole

```prisma
enum RoadmapBlockResourceRole {
  CORE
  SUPPORTING
  STRETCH
}
```

**Assessment**: ✅ Excellent. This enables the "every block has core + supporting + optional stretch" pattern.

### WritingTaskType

```prisma
enum WritingTaskType {
  SHORT_GUIDED_RESPONSE
  JOURNAL_REFLECTION
  OPINION_PARAGRAPH
  PRACTICAL_RESPONSE
}
```

**Assessment**: ⚠️ Good start but could be expanded. Consider adding `DESCRIPTIVE_PARAGRAPH`, `EMAIL_MESSAGE`, `STORY_COMPLETION`.

### SpeakingPromptType

```prisma
enum SpeakingPromptType {
  PERSONAL_RESPONSE
  STORYTELLING
  OPINION
  ROLEPLAY
  DESCRIPTION
}
```

**Assessment**: ✅ Good breadth for V1.

---

## Index Analysis

### Existing Indexes

| Table | Index | Quality |
|-------|-------|---------|
| `skills` | sort_order | ✅ Good for ordered display |
| `subskills` | skill_id + sort_order | ✅ Good for hierarchical queries |
| `roadmap_templates` | audience + is_published | ✅ Good for filtering active templates |
| `roadmap_stages` | template_id + sort_order | ✅ Good for ordered stages |
| `roadmap_blocks` | stage_id + sort_order | ✅ Good for ordered blocks |
| `resources` | type + format | ✅ Good for filtering |
| `resources` | use_case + audience | ✅ Good for recommendation queries |
| `resources` | cefr_start + cefr_end | ✅ Good for level-based queries |
| `block_skill_maps` | block_id, skill_id, subskill_id | ✅ Good |
| `resource_skill_maps` | resource_id, skill_id, subskill_id | ✅ Good |
| `roadmap_block_resources` | block_id + sort_order | ✅ Good for ordered resource lists |

### Missing Indexes

| Table | Suggested Index | Reason |
|-------|-----------------|--------|
| `resources` | `slug` already exists | ✅ Already covered |
| `writing_tasks` | `roadmap_block_id` | Already indexed ✅ |
| `writing_tasks` | `task_type + cefr_start + cefr_end` | Already indexed ✅ |
| `speaking_prompts` | `roadmap_block_id` | Already indexed ✅ |
| `speaking_prompts` | `prompt_type + cefr_start + cefr_end` | Already indexed ✅ |

**Observation**: Index coverage is already good. No missing indexes identified for current query patterns.

---

## Schema Strengths

| Strength | Detail |
|----------|--------|
| Clean separation of product content and learner state | Product-controlled data (skills, roadmaps, resources) is entirely separate from learner-specific tables (learner_profiles, future learner_roadmap, etc.) |
| Rich resource metadata | `why_recommended`, `best_use_case`, `follow_up_hint` fields enable curated recommendation context — a core product differentiator. |
| Flexible skill mapping | Both `block_skill_maps` and `resource_skill_maps` support PRIMARY/SUPPORTING emphasis, enabling multi-skill alignment. |
| Role system for block resources | CORE/SUPPORTING/STRETCH roles let each block contain a curated resource bundle rather than a single link. |
| Unique constraints prevent duplicates | `@@unique([roadmapBlockId, resourceId])` on `roadmap_block_resources` prevents the same resource from being added twice to the same block. |
| CEFR ranges at every level | Templates, stages, blocks, resources, and subskills all carry CEFR ranges, enabling precise level matching. |

---

## Schema Weaknesses & Risks

### 1. Subskill CEFR Range vs Block CEFR Range Mismatch

Subskills have `cefrMin` and `cefrMax`. Blocks also have `cefrStart` and `cefrEnd`. If a block assigns a subskill whose CEFR range doesn't overlap with the block's range, the mapping is pedagogically questionable.

**Risk**: Low (data quality issue, not schema issue). Mitigation: enforce through curation process, not schema constraints.

### 2. No Resource Candidate Table

Phase 2 (Hidden Gem Research) will generate hundreds of candidate resources. The current schema has no `resource_candidates` table to track pre-approval resources with scores, evidence, and evaluation status.

**Risk**: Medium. Without a candidates table, the research-to-production pipeline is manual and lossy.
**Recommendation**: See [Recommended Improvements](./recommended-improvements.md).

### 3. Learner Roadmap State Not Yet Modeled

The schema has `learner_profiles` but no tables for:
- `learner_roadmap` (which template a learner is following)
- `learner_stage_state` (stage completion status)
- `learner_block_state` (block completion status)

**Risk**: Low for V1 (client-first state approach). The Prisma model already anticipates this separation.

### 4. No Activity/Event Tables

The data model document defines `learning_event`, `resource_activity`, `review_activity` etc., but these are not in the schema.

**Risk**: Low for V1 (local-first state approach). These will be needed for server-side sync.

### 5. No Pronunciation or Phonetics Support

English OS has no entity for phonemes, minimal pairs, or pronunciation patterns. This limits future speaking-focused features.

**Risk**: Low for V1. Could be added as a subskill of speaking or as a new skill type.

### 6. `sourceName` vs Creator Distinction

The `resources.source_name` field conflates the creator (e.g., "BBC") with the platform (e.g., "YouTube"). This makes it harder to filter by platform or attribute credit.

**Risk**: Low. Workaround: use `source_name` consistently for the content creator, and derive platform from `resource_type` or URL.

---

## Data Integrity Observations

| Check | Status |
|-------|--------|
| All existing resources have valid CEFR ranges | ✅ Yes |
| All existing blocks have CORE resources assigned | ✅ Yes |
| All block_skill_maps have valid skill references | ✅ Yes |
| No orphaned records | ✅ Yes |
| No duplicate slugs | ✅ Yes (unique constraints enforce this) |
| All existing resources have `why_recommended` populated | ✅ Yes |

---

## Schema Comparison: Current vs Data Model Document

| Data Model Entity | Schema Equivalent | Status |
|-------------------|-------------------|--------|
| learner | `users` | ✅ |
| learner_profile | `learner_profiles` | ✅ |
| skill | `skills` | ✅ |
| subskill | `subskills` | ✅ |
| roadmap_template | `roadmap_templates` | ✅ |
| roadmap_stage | `roadmap_stages` | ✅ |
| roadmap_block | `roadmap_blocks` | ✅ |
| block_skill_map | `block_skill_maps` | ✅ |
| resource | `resources` | ✅ |
| resource_skill_map | `resource_skill_maps` | ✅ |
| resource_collection | ❌ Not in schema | ⏳ V2 feature |
| resource_collection_item | ❌ Not in schema | ⏳ V2 feature |
| learner_roadmap | ❌ Not in schema | ⏳ Post-V1 |
| learner_stage_state | ❌ Not in schema | ⏳ Post-V1 |
| learner_block_state | ❌ Not in schema | ⏳ Post-V1 |
| learning_event | ❌ Not in schema | ⏳ Post-V1 (local-first) |
| resource_activity | ❌ Not in schema | ⏳ Post-V1 (local-first) |
| review_activity | ❌ Not in schema | ⏳ Post-V1 (local-first) |
| skill_progress_state | ❌ Not in schema | ⏳ Post-V1 |
| learner_insight | ❌ Not in schema | ⏳ Post-V1 |
| review_item | ❌ Not in schema | ⏳ Post-V1 |
| learner_writing_attempt | ❌ Not in schema | ⏳ Local-first |
| writing_feedback | ❌ Not in schema | ⏳ Local-first |
| learner_speaking_session | ❌ Not in schema | ⏳ Local-first |
| speaking_feedback | ❌ Not in schema | ⏳ Local-first |

---

## Schema Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Correctness** | 95% | Enums, types, and relationships are sound |
| **Completeness (V1)** | 80% | Core entities exist; learner state is intentionally deferred |
| **Completeness (Vision)** | 50% | ~50% of planned entities exist in schema |
| **Index coverage** | 90% | Good; no missing indexes identified |
| **Naming consistency** | 85% | Minor inconsistency: `source_name` vs creator |
| **Extensibility** | 90% | Enums, optional fields, and map tables support growth |
| **Data integrity** | 95% | Constraints, unique keys, and cascading deletes are correct |

**Overall**: The schema is well-designed and appropriate for V1. Most gaps are intentional deferrals, not design errors.

---

## Status

Active.

## Related Docs

- [Coverage Matrix](../coverage-matrix.md)
- [Recommended Improvements](./recommended-improvements.md)
- [Data Model](../../system/data-model.md)
