# Storm Chaser

Mobile field log for hobbyist meteorologists. Track current conditions at your location and document storms with photos and metadata.

Product platforms are **iOS and Android**. Web is not a supported product target.

## Stack

- Expo SDK 57, React Native, TypeScript, Expo Router (native tabs)
- Open-Meteo for current weather (Milestone 1)
- `expo-sqlite` + filesystem for observations (Milestone 2)
- `expo-camera` and `expo-location` (Milestones 1 and 3)

## Requirements

- Node.js 22.13+ (Expo SDK 57)
- pnpm
- Xcode (iOS) and/or Android Studio

## Setup

```bash
pnpm install
pnpm start
```

Then open the iOS Simulator or an Android emulator. Expo Go is enough through Milestone 4.

```bash
pnpm ios
pnpm android
```

## Scripts

| Command         | Purpose                    |
| --------------- | -------------------------- |
| `pnpm start`    | Expo dev server            |
| `pnpm ios`      | iOS Simulator              |
| `pnpm android`  | Android emulator           |
| `pnpm lint`     | ESLint                     |
| `pnpm format`   | Prettier                   |
| `pnpm test`     | Jest                       |

## Architecture

Feature-first. Screens in `src/app/` stay thin. Domain logic lives in `src/features/` and device wrappers in `src/services/`.

Read [docs/architecture.md](docs/architecture.md) before changing structure.

## Implementation decisions

Locked decisions are recorded as ADRs:

- [0001 Architecture](docs/decisions/0001-architecture.md) - feature-first, not Redux or Clean Architecture
- [0002 Weather API](docs/decisions/0002-weather-api.md) - Open-Meteo, imperial units, Zod at the boundary
- [0003 Persistence](docs/decisions/0003-persistence.md) - SQLite rows, photos on disk, no ORM
- [0004 State management](docs/decisions/0004-state-management.md) - TanStack Query for weather, SQLite for the log
- [0005 Tooling](docs/decisions/0005-tooling.md) - what we add, and when

A formatted Decision Log is at [docs/StormChaser-Decision-Log.docx](docs/StormChaser-Decision-Log.docx).

## Milestones

Build incrementally. Do not implement a later milestone in the same session as an earlier one.

| ID | Name | Status | Plan |
| -- | ---- | ------ | ---- |
| M0 | Foundation (tabs, tooling, docs) | Done | [m0-foundation.md](docs/milestones/m0-foundation.md) |
| M1 | Current conditions | Done | [m1-weather.md](docs/milestones/m1-weather.md) |
| M2 | Persistence | Done | [m2-persistence.md](docs/milestones/m2-persistence.md) |
| M3 | Storm capture | Done | [m3-capture.md](docs/milestones/m3-capture.md) |
| M4 | Field log | Next | [m4-field-log.md](docs/milestones/m4-field-log.md) |
| M5 | Hardening | Planned | [m5-hardening.md](docs/milestones/m5-hardening.md) |

Product spec: [docs/StormChaser.md](docs/StormChaser.md).

## Expo docs

This project targets SDK 57. Use https://docs.expo.dev/versions/v57.0.0/ rather than unversioned pages.
