# Molt Coach

React Native CLI app (TypeScript) for a fitness coach to review client body
measurements. Built against the mock server in `task-files/`.

## How to run

Requirements: Node 22+, Xcode / Android Studio set up for React Native CLI.

```bash
# 1. backend (leave it running)
cd task-files
node generate-db.js      # only if the dates in db.json look old
node server.js           # http://localhost:4000

# 2. app, in a second terminal
npm install
cd ios && pod install && cd ..   # iOS only
npm start
npm run ios              # or: npm run android
```

Login: `coach@molt.app` / `molt1234`

The base URL is in `src/config/env.ts`. iOS simulator uses `localhost`, the
Android emulator uses `10.0.2.2`. For a real device, put your computer's LAN IP
there.

Tests and checks:

```bash
npm test
npx tsc --noEmit
npm run lint
```

## What is done

Priority 1–4 from the brief are all in.

- **Login**: inline validation (empty / bad email / empty password), button
  disabled + spinner while signing in, double tap is blocked, different
  messages for wrong password, server down, no network and timeout. Token is
  saved in AsyncStorage and restored on app start.
- **Navigation**: the root stack renders either `Login` or the tabs based on
  auth state, so there is no Login screen in the tree after signing in
  (hardware back can't go there). Bottom tabs: Clients (stack: list → progress)
  and Profile. All params are typed.
- **Clients list**: sorted by name, pull to refresh, loading / error with
  Retry / empty states.
- **Client progress – Weight**: range filter (7D / 30D / 90D / All) that
  refetches with `from`, sorted newest first, latest weight, total change,
  change per row, kg/lb toggle (display only), proper handling of 0 entries,
  1 entry (shows `—`, not `0.0`) and "nothing in this range" vs "no data yet".
- **Add weight**: bottom sheet with date picker (no future dates), decimal
  keyboard, local validation (empty / not a number / 20–400 kg). The new row
  shows up dimmed with a spinner straight away. On success it gets replaced
  by the server's row (real id, rounded value). On 422 or 503 the row is
  removed and the error shows in the form. A 422 goes next to the field it is
  about (e.g. duplicate date under the date field).
- **Delete**: long press a row → confirm → row disappears right away. If the
  delete fails it comes back in the same place and an alert explains why. A
  404 counts as already deleted.
- **Girth** (read only): site selector, same range filter, mm → cm, empty
  state for sites with no data (e.g. `c1` arm).
- **Profile**: coach details from `GET /me`, sign out.
- **Errors**: every request has loading / success / error. Reads have Retry,
  writes roll back. A 401 from any call (not login) logs out and shows a
  message. Requests time out after 15s, so a dropped connection
  (`offline: true`) gives an error instead of an endless spinner.

## What I did not do

- No charts, animations, dark mode or offline queue (as per the brief).
- No inch toggle on Girth. The brief says cm only, though the API contract
  mentions inches. I followed the brief.
- No add/delete for girth (the brief says read only).
- The Add form takes kilograms only, even when the list is showing lb.
- No tab icons, I didn't want to add an icon library just for two tabs.

## Folder structure

```
src/
  auth/          auth session: token in AsyncStorage, sign in/out, 401 handling
  components/    shared UI (buttons, inputs, empty/error states, rows)
  config/        base URL, timeout
  constants/     colors, strings, goal labels, weight limits
  hooks/         one data hook per screen (clients, profile, weight, girth)
  navigation/    root stack, tabs, clients stack, param types
  screens/       Login, Clients, ClientProgress (Weight/Girth/Add), Profile
  services/      API client, endpoints, response checks, one file per area
  types/         API response types
  utils/         units, formatting, dates, ranges, sorting/deltas, validation
```

Unit conversion and number formatting are only in `src/utils/units.ts`.
Sorting and change calculation are in `src/utils/measurements.ts`.

## Three decisions I'm least sure about

1. **An extra request to tell "no data" from "nothing in range".** When a range
   comes back empty I make one more call without `from` to check if the client
   has any data at all. It's one extra request, but only when the list is
   empty. If that check fails I show "Nothing in the last N days", which is
   still true. Another option was a separate count endpoint, but the API
   doesn't have one.
2. **The Add sheet stays open until the server answers.** The row is added to
   the list straight away (you can see it behind the sheet), but the sheet
   only closes on success. I did this so a 422 can be shown next to the right
   field without having to reopen the form. The downside is that it feels less
   "instant" than closing right away.
3. **No React Query, no shared fetch hook.** Each screen or hook keeps its own
   loading / error state with `useState`. The Weight and Girth hooks also keep
   a request counter so an old response can't overwrite a newer one when the
   range or site changes quickly. It's easy to follow at this size, but the
   load logic is repeated a little, and caching, refetch on focus and sharing
   data between screens would all be easier with React Query.

Smaller things: entries are saved at 12:00 local time on the picked day (or
"now" if that is still in the future) so the day doesn't shift when converted
to UTC. Rows the server sends in a broken shape are skipped instead of
crashing the list.

## With two more days

- Move to React Query (cache per client/range, background refresh).
- Let the Add form follow the kg/lb toggle.
- Retry with backoff for reads, and a small "couldn't refresh" banner instead
  of replacing the list with an error after a failed pull to refresh.
- Component tests for the screens (React Native Testing Library), plus a few
  more for the login error cases.
- Tab icons and some general UI polish.

## Time spent

About 4–5 hours.
