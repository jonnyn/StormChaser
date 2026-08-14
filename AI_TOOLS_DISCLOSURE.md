# AI Tools Disclosure

This document satisfies the assessment requirement to disclose AI tool usage during development of Storm Chaser.

## Tools used

| Tool                           | Purpose                                                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Cursor** (IDE with AI agent) | Primary development environment. Used for scaffolding, refactoring, test generation, and exploring Expo SDK 57 APIs. |
| **Claude** (via Cursor)        | Code generation, architecture planning, and documentation drafts reviewed and edited by the author.                  |
| **Expo MCP** (via Cursor)      | Looked up versioned Expo SDK 57 documentation during implementation.                                                 |
| **Context7 MCP** (via Cursor)  | Referenced library docs for TanStack Query, Zod, and Jest when needed.                                               |

No AI tool was given repository write access outside of local development sessions.

## How AI was used

### Planning and architecture

- Early folder structure and feature-first layout were discussed with AI, then refined manually.
- Implementation decisions (weather API choice, persistence strategy, state management split) were authored with AI assistance and validated against product requirements.

### Code generation (reviewed and edited)

| Area                                      | AI involvement                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Open-Meteo client, Zod schema, and mapper | Scaffolded with AI; query parameters, domain types, and unit tests reviewed and adjusted manually.   |
| SQLite repository and migrations          | Scaffolded with AI; schema, migration logic, and repository tests verified manually.                 |
| Capture flow (camera, form, validation)   | UI and hook structure drafted with AI; permission handling and save flow reviewed manually.          |
| Cloud backup (Supabase REST provider)     | Interface and upload logic drafted with AI; manifest format and error paths reviewed manually.       |
| Unit tests                                | Many test files were initially generated with AI and then tightened (edge cases, assertions, mocks). |
| README and this disclosure                | Drafted with AI; final content edited by the author.                                                 |

### What was not AI-generated

- Product requirements interpretation and feature prioritization.
- Final architectural trade-offs (feature-first over Clean Architecture/Redux, metric canonical storage, local-first authority).
- Theme tokens, color palette, and navigation UX choices.
- Git history, commit structure, and branch strategy.
- Manual device testing on iOS Simulator and Android emulator.

## Author responsibility

All AI-assisted code was reviewed, tested (`pnpm test`, `pnpm lint`), and run on simulators before commit. The author understands and can explain every module in the submission. AI was used as an accelerator, not as an unattended code author.
