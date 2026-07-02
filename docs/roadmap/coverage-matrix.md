# Coverage Matrix

## Purpose

This document audits the complete current database state against what is needed for a production-ready curated learning system.

It identifies gaps, partial content, and missing structures that must be filled before the resource layer can support real learners.

---

## 1. Schema Overview

| Entity | Status | Tables | Notes |
|--------|--------|--------|-------|
| Auth | Complete | `users`, `accounts`, `sessions`, `verification_tokens` | Standard NextAuth/Auth.js schema |
| Learner Profile | Schema complete, 0 rows | `learner_profiles` | No learner data (expected pre-launch) |
| Skills | Complete | `skills` | 6 skills, well-defined |
| Subskills | Partial | `subskills` | 8 subskills, **needs expansion** |
| Roadmap Templates | Partial | `roadmap_templates` | 1 of 2 templates populated |
| Roadmap Stages | Partial | `roadmap_stages` | 2 of 8 stages populated |
| Roadmap Blocks | Partial | `roadmap_blocks` | 4 of ~20 blocks populated |
| Block-Skill Maps | Partial | `block_skill_maps` | 8 maps, matches existing 4 blocks |
| Resources | Partial | `resources` | 5 resources populated |
| Resource-Skill Maps | Partial | `resource_skill_maps` | 10 maps, matches existing 5 resources |
| Block-Resource Links | Partial | `roadmap_block_resources` | 8 links, matches existing 4 blocks |
| Writing Tasks | Partial | `writing_tasks` | 2 tasks, needs expansion |
| Speaking Prompts | Partial | `speaking_prompts` | 2 prompts, needs expansion |
| Migrations | Complete | `_prisma_migrations` | Schema migration tracking |

---

## 2. Skills Coverage

| Skill | Slug | Subskills Exist | Subskills Needed | CEFR Range |
|-------|------|----------------|-----------------|------------|
| Grammar | grammar | 2 | 12-15 | A1-C2 |
| Vocabulary | vocabulary | 2 | 10-12 | A1-C2 |
| Reading | reading | 1 | 8-10 | A1-C2 |
| Listening | listening | 1 | 8-10 | A1-C2 |
| Writing | writing | 1 | 8-10 | A1-C2 |
| Speaking | speaking | 1 | 8-10 | A1-C2 |

**Total: 6 skills, 8 subskills existing → 54-67 subskills needed**

---

## 3. Existing Subskill Detail

| Skill | Subskill | CEFR Min | CEFR Max |
|-------|----------|----------|----------|
| Grammar | Simple sentence order | A1 | A2 |
| Grammar | Be verb and basic questions | A1 | A2 |
| Vocabulary | Personal information vocabulary | A1 | A1 |
| Vocabulary | Everyday routines vocabulary | A1 | A2 |
| Reading | Reading for key details | A1 | A2 |
| Listening | Listening for gist | A1 | A2 |
| Writing | Short personal messages | A1 | A2 |
| Speaking | Self-introduction and daily talk | A1 | A2 |

**Gap: All subskills cover A1-A2 only. No subskills for B1, B2, C1, or C2 exist.**

---

## 4. Roadmap Template Coverage

| Template | Audience | CEFR Range | Exists | Stages | Blocks |
|----------|----------|------------|--------|--------|--------|
| Beginner Self-Learner Reset | BEGINNER_SELF_LEARNER | PRE_A1 → A2 | ✅ Yes | 2 of 4 | 4 of ~10 |
| Intermediate Self-Learner | INTERMEDIATE_STUCK_SELF_LEARNER | A2 → B1/B2 | ❌ Missing | 0 of 4 | 0 of ~10 |

---

## 5. Current Stage Coverage (Beginner Template)

| Stage | Type | Sort | Exists | Blocks |
|-------|------|------|--------|--------|
| Build a Safe Base | FOUNDATION | 1 | ✅ Yes | 2 of ~4 |
| Start Understanding and Responding | ACTIVE_USE | 2 | ✅ Yes | 2 of ~3 |
| (missing) | COMPREHENSION | — | ❌ No | 0 |
| (missing) | CONSOLIDATION | — | ❌ No | 0 |

**Stage type utilization: 2 of 4 stage types used. COMPREHENSION and CONSOLIDATION are unused.**

---

## 6. Current Block Coverage (Beginner Template)

| Stage | Block | Type | CEFR | Exists |
|-------|-------|------|------|--------|
| Build a Safe Base | Simple sentences about yourself | LEARN | A1 | ✅ Yes |
| Build a Safe Base | Starter vocabulary for daily life | PRACTICE | A1 | ✅ Yes |
| (Build a Safe Base gap) | CHECKPOINT block | CHECKPOINT | — | ❌ No |
| (Build a Safe Base gap) | Basic listening and reading input | PRACTICE | — | ❌ No |
| Start Understanding and Responding | Understand slow everyday English | PRACTICE | A1-A2 | ✅ Yes |
| Start Understanding and Responding | Express your routine in short messages | APPLY | A1-A2 | ✅ Yes |
| (Start Understanding and Responding gap) | CHECKPOINT block | CHECKPOINT | — | ❌ No |

**Block type utilization: 3 of 4 block types used. CHECKPOINT is unused.**

---

## 7. Resource Coverage

| Resource | Type | Access | CEFR | Use Case | Linked to Block? |
|----------|------|--------|------|----------|-----------------|
| British Council LearnEnglish | COURSE | FREE | A1-B1 | FOUNDATION | ✅ Yes (blocks 1, 4) |
| BBC Learning English | VIDEO_SERIES | FREE | A1-B1 | PRACTICE | ✅ Yes (block 3) |
| VOA Learning English | PODCAST | FREE | A1-B1 | IMMERSION | ✅ Yes (block 3) |
| Cambridge Dictionary | REFERENCE | FREE | PRE_A1-C2 | REFERENCE | ✅ Yes (blocks 2, 4) |
| Perfect English Grammar | REFERENCE | FREE | A1-B1 | REVIEW | ✅ Yes (block 1) |

**Resource type distribution: COURSE(1), VIDEO_SERIES(1), PODCAST(1), REFERENCE(2). Missing: VIDEO, ARTICLE, EXERCISE_SET, TOOL.**

**Resource use case distribution: FOUNDATION(1), PRACTICE(1), IMMERSION(1), REFERENCE(1), REVIEW(1).**

**Access type: All FREE. FREEMIUM and PAID unused (intentional for hidden-gem curation).**

---

## 8. Practice Content Coverage

| Type | Existing | Needed (V1) |
|------|----------|-------------|
| Writing Tasks | 2 | ~10-12 |
| Speaking Prompts | 2 | ~10-12 |

**Both writing and speaking have minimal content — only enough to demonstrate the feature exists.**

---

## 9. Learner-Specific State

| Entity | Exists? | Data |
|--------|---------|------|
| `learner_profiles` | Schema only | 0 rows |
| `learner_roadmap` | Not in schema | Not yet modeled |
| `learner_block_state` | Not in schema | See schema-review.md |

---

## 10. Overall Coverage Score

| Dimension | Coverage | Assessment |
|-----------|----------|------------|
| Schema completeness | 80% | Core entities exist; learner state entities partially modeled |
| Skill coverage (CEFR A1-C2) | 15% | Subskills only at A1-A2 |
| Roadmap templates | 50% | 1 of 2 complete |
| Roadmap stages | 25% | 2 of 8 complete |
| Roadmap blocks | 20% | 4 of ~20 complete |
| Resource library | 5% | 5 resources; need 40-60 |
| Writing tasks | 15% | 2 of ~12 complete |
| Speaking prompts | 15% | 2 of ~12 complete |
| Block-resource links | 20% | 8 links; need 40-60 |

**Overall: ~20% coverage. The architecture is sound but content is minimal.**

---

## 11. Critical Gaps (Must Fill)

1. **Second roadmap template** — Intermediate Self-Learner does not exist
2. **Subskill expansion** — Only A1-A2 covered; B1-C2 completely missing
3. **COMPREHENSION stage type** — Unused in any template
4. **CONSOLIDATION stage type** — Unused in any template
5. **CHECKPOINT block type** — Unused in any block
6. **Resource library** — Only 5 placeholder resources
7. **Resource type diversity** — VIDEO, ARTICLE, EXERCISE_SET, TOOL missing
8. **Writing tasks** — Only 2 exist
9. **Speaking prompts** — Only 2 exist

---

## 12. Strategic Observations

1. The existing 4 blocks form a coherent **A1 starter path**. The structure is good quality.
2. The existing 5 resources are well-chosen for their purpose (British Council, BBC, VOA are strong openers).
3. The schema cleanly separates product-controlled content from learner state — good architecture.
4. The `roadmap_block_resources.role` enum (CORE/SUPPORTING/STRETCH) is a strong feature.
5. The `resources` table has rich metadata (why_recommended, best_use_case, follow_up_hint) — excellent curation foundation.
6. No learner state tables exist yet for roadmap tracking — this is by design (client-first V1 approach).

---

## Related Docs

- [Schema Review](./schema-review.md)
- [Learning Ontology](./learning-ontology.md)
- [Roadmap Expanded](./roadmap-expanded.md)
- [Resource Need Specs](./resource-need-specs.md)
- [Recommended Improvements](./recommended-improvements.md)
