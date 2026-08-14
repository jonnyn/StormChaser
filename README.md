# Storm Chaser

Mobile field log for hobbyist meteorologists. View current conditions at your location, capture storm photos with metadata, and browse saved observations on a list or map.

**Platforms:** iOS and Android (Expo Go or dev client). Web is not a product target.

## Stack

| Layer         | Choice                                                          |
| ------------- | --------------------------------------------------------------- |
| Framework     | Expo SDK 57, React Native, TypeScript                           |
| Navigation    | Expo Router (native tabs + stack modals)                        |
| Weather       | [Open-Meteo Forecast API](https://open-meteo.com/) (no API key) |
| Remote cache  | TanStack Query + AsyncStorage persistence                       |
| Local storage | `expo-sqlite` (observations) + filesystem (photos)              |
| Validation    | Zod at API boundaries                                           |
| Maps          | `react-native-maps` (read-only observation pins)                |
| Cloud backup  | Supabase Storage REST (optional, env-configured)                |
| Testing       | Jest, jest-expo, Testing Library                                |

Deliberately omitted: Redux, Zustand, axios, NativeWind, ORMs (Drizzle/Prisma).

## Requirements

- Node.js 22.13+
- pnpm
- Xcode (iOS) and/or Android Studio

## Setup

```bash
pnpm install
pnpm start
```

Open the iOS Simulator or an Android emulator, then press `i` or `a` in the Expo CLI. Alternatively:

```bash
pnpm ios
pnpm android
```

### Optional cloud backup

Copy `.env.example` to `.env.local` and fill in Supabase credentials. Without them, local features work normally; the Field Log shows that backup is unconfigured.

```bash
cp .env.example .env.local
```

## Scripts

| Command        | Purpose                 |
| -------------- | ----------------------- |
| `pnpm start`   | Expo dev server         |
| `pnpm ios`     | Run on iOS Simulator    |
| `pnpm android` | Run on Android emulator |
| `pnpm lint`    | ESLint                  |
| `pnpm format`  | Prettier                |
| `pnpm test`    | Jest (14 suites)        |

## Features

### Conditions tab

- Fetches current weather, 24-hour hourly, and 5-day daily forecast from Open-Meteo using device location.
- Displays temperature, wind speed, precipitation, and weather code.
- Metric/imperial toggle (stored in AsyncStorage; API and SQLite stay metric).
- Pull-to-refresh, offline banner, and cached "last saved" weather when connectivity is lost.
- Dedicated "Not found" state when data cannot be retrieved.
- "Log this" shortcut opens the capture flow with the current weather snapshot.

### Field Log tab

- Lists saved storm observations (newest first) with photo thumbnail, storm type, and timestamp.
- Pull-to-refresh reloads from SQLite.
- Optional one-way cloud backup to Supabase Storage (manifest JSON + JPEGs per batch).

### Map tab

- Read-only map of observation coordinates with tappable markers.
- Empty state when no observations exist.

### Capture modal

- Camera capture via `expo-camera`.
- Attaches GPS coordinates, timestamp, storm type, notes, and a weather snapshot (nullable if weather failed).
- Saves photo to disk and metadata row to SQLite.

### Observation detail

- Full photo, metadata, and delete action.

## Architecture

Feature-first layout with thin route files and a small domain layer.

```
src/
  app/          # Expo Router screens — compose hooks and UI only
  features/
    weather/    # Open-Meteo client, mappers, hooks, forecast UI
    storms/     # repository, capture flow, list, map, detail
  services/     # device API wrappers (location, camera, files, network, cloud)
  shared/       # UI primitives (Screen, Skeleton, OfflineBanner), lib (http, errors, dates, units)
  db/           # SQLite open + versioned migrations
  components/   # themed primitives and tab bar
  constants/    # theme tokens
```

### Data flow

```
Conditions  →  useCurrentWeather  →  location service  →  Open-Meteo (Zod + mapper)  →  TanStack Query cache

Capture     →  camera + location + weather snapshot  →  StormRepository  →  SQLite row + photo file

Field Log / Map  →  StormRepository  →  SQLite

Cloud backup (optional)  →  StormRepository list  →  CloudBackupProvider  →  Supabase Storage REST
```

Screens never call `fetch`, SQLite, or device APIs directly. Weather snapshots are copied onto an observation at capture time so later refreshes do not rewrite historical records.

### Navigation

| Route      | Path               | Role                               |
| ---------- | ------------------ | ---------------------------------- |
| Conditions | `(tabs)/index`     | Current weather at device location |
| Field Log  | `(tabs)/log`       | Saved observations                 |
| Map        | `(tabs)/map`       | Documented locations (read-only)   |
| Capture    | `capture`          | Photo + metadata (modal)           |
| Detail     | `observation/[id]` | View and delete                    |

## Implementation decisions

### Feature-first, not Clean Architecture or Redux

Each feature owns its types, data access, hooks, and UI. Device APIs sit behind `src/services/`. This avoids ceremony (use-case classes, global stores) that does not pay off for a local-first app of this size.

### Open-Meteo with Zod validation

Free Forecast API, no API key, works globally. Responses are validated with Zod and mapped to domain types (`CurrentWeather`, `HourlyForecastHour`, `DailyForecastDay`). Canonical storage units are metric (°C, km/h, mm); display conversion happens in formatters only.

### SQLite + filesystem persistence

One `storm_observations` table in `expo-sqlite` with WAL and `PRAGMA user_version` migrations. Photos live as files under the app document directory; SQLite stores a relative path, not a BLOB. A `StormRepository` interface keeps screens decoupled from `expo-sqlite`. UUIDs (`expo-crypto`) for observation IDs.

Storm types: `supercell`, `tornado`, `wall_cloud`, `funnel_cloud`, `hail`, `lightning`, `flash_flood`, `dust_storm`, `tropical`, `other`.

### TanStack Query for weather, SQLite for the log

Remote weather is cached and retried via React Query (query key includes rounded coordinates). Storm observations are read/written through the repository. UI state (form fields, camera facing) stays in screens or feature hooks. HTTP uses a shared `fetch` wrapper with timeout and typed `AppError`.

### Offline behavior

Connectivity via `expo-network`. Weather and location query cache persist to AsyncStorage (~24 h `gcTime`). When offline, Conditions shows a banner and renders cached data with a "last saved" note. Field Log and Map work without network (SQLite is local).

### System-driven dark mode

Appearance follows the OS (`userInterfaceStyle: automatic`). Theme tokens in `src/constants/theme.ts` include `onAccent` / `onDanger` for readable labels on solid buttons.

### Maps without committed API keys

`react-native-maps` with Apple Maps on iOS. Android uses the library default in Expo Go; a production Android build would need a restricted Google Maps key via env (not committed).

### Optional cloud backup

`CloudBackupProvider` interface with a Supabase Storage REST implementation (no vendor SDK). One-way export: versioned JSON manifest + JPEGs. Local SQLite remains the source of truth. Credentials via `EXPO_PUBLIC_*` env vars; `.env.example` documents the shape.

### Styling

StyleSheet + tokens in `src/constants/theme.ts`. Shared UI primitives live in `src/shared/ui/`:

| Component           | Role                                                    |
| ------------------- | ------------------------------------------------------- |
| `Screen`            | Safe-area wrapper with consistent padding               |
| `Button`            | Accent, danger, and outline variants with loading state |
| `InfoCard`          | Themed surface for grouped metadata                     |
| `LoadingBlock`      | Spinner with optional status message                    |
| `AppRefreshControl` | Pull-to-refresh wired to theme accent                   |
| `Skeleton`          | Placeholder loading states                              |
| `OfflineBanner`     | Connectivity warning on Conditions                      |

Template-themed primitives (`ThemedText`, `ThemedView`) remain in `src/components/`.

## Code tour

Start here when walking a reviewer through the project:

| Layer           | Start with                                                                 | Why                                                       |
| --------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| Routes          | `src/app/(tabs)/index.tsx`                                                 | Routes only compose feature views — no fetch or SQLite    |
| Weather feature | `use-current-weather.ts` → `open-meteo-client.ts` → `open-meteo-mapper.ts` | Remote data: location → API → Zod → domain → React Query  |
| Storms feature  | `use-capture-observation.ts` → `sqlite-storm-repository.ts`                | Local data: camera/location → repository → SQLite + files |
| Services        | `src/services/location/`, `camera/`, `files/`, `cloud/`                    | Device and vendor APIs wrapped behind small modules       |
| Shared          | `src/shared/lib/errors.ts`, `http.ts`, `coordinates.ts`                    | Cross-cutting utilities and typed errors                  |
| Persistence     | `src/db/migrations.ts`                                                     | Schema versioning with `PRAGMA user_version`              |

Each tab screen maps to one feature view: `ConditionsView`, `ObservationList` + `CloudBackupSection`, `ObservationMap`. Capture and detail use `CaptureFlowView` and `ObservationDetailView`.

## Testing

Tests are colocated as `*.test.ts(x)` next to the module under test. Focus is on pure logic:

| Area                   | Example                                                      |
| ---------------------- | ------------------------------------------------------------ |
| API mappers            | `open-meteo-mapper.test.ts`                                  |
| Repository             | `sqlite-storm-repository.test.ts`                            |
| Domain helpers         | `weather-snapshot.test.ts`, `coordinates.test.ts`            |
| Units / dates / errors | `units.test.ts`, `parse.test.ts`, `errors.test.ts`           |
| Cloud backup           | `backup-manifest.test.ts`, `supabase-cloud-provider.test.ts` |
| UI empty states        | `observation-list.empty.test.tsx`                            |

Run: `pnpm test`

## AI tools disclosure

See [AI_TOOLS_DISCLOSURE.md](AI_TOOLS_DISCLOSURE.md) for which AI tools were used during development and what code they assisted with.

## Expo docs

This project targets SDK 57. Refer to https://docs.expo.dev/versions/v57.0.0/ for version-accurate API documentation.
