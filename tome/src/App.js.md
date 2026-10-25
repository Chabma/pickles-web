---
id: src/App.js
kind: file
refs:
  - src/App.js
  - src/App.js#authEndpoint
  - src/App.js#tokenEndpoint
  - src/App.js#clientId
  - src/App.js#clientSecret
  - src/App.js#redirectUri
  - src/App.js#debug
  - src/App.js#scopes
  - src/App.js#particlesJS
  - src/App.js#code
  - src/App.js#debounce
  - src/App.js#featureRanges
generated: 2114c1b
---
## What it is

`src/App.js` is the root React class component for the Pickles Spotify web player. It covers login, the Web Playback SDK, a track queue, search, recommendations, device recovery, and the page UI. Module constants hold OAuth endpoints, credentials, redirect URI, scopes, and a `debug` flag.

### Startup

`componentDidMount` loads particles, rewrites the URL, enables wheel scrolling, registers visibility handling, holds a Web Lock, and reads an OAuth code from the query string. With a code, it exchanges it for tokens, waits for the SDK, and starts a one-second `tick`. Without one, `render` redirects to Spotify and shows a login link.

`setUpPlayer` creates the `Spotify.Player`, attaches SDK listeners, connects, fetches `/me`, and stores the user, token, and player. `refreshToken` renews the access token.

### Playback and queue

`queue` inserts a track into `total_queue` and builds its row. `play` sends the track URI to Spotify, retries twice, then calls `recoverPlayback` on failure. `tick` advances `progress_ms`, polls SDK state, detects song end as a fallback, and refreshes tokens every 30 minutes.

`syncDevice`, `rebuildPlayer`, `recoverPlayback`, and the visibility handler recreate or adopt a player when the device disappears. `updateMediaSession` maintains lock-screen metadata and controls. `startKeepAlive` plays a generated near-silent WAV, and the Web Lock reduces background throttling.

### Recommendations and UI

`getRecs` caches audio features for recent tracks, computes recency-weighted means and spreads, and requests recommendations using target/min/max parameters. It filters duplicates and stores up to three next tracks. `getSearchResults` builds `SearchItem` rows.

`render` shows login or the player, recommendations, search, audio-feature selector, settings, playlist saving, dark mode, debug output, and device chooser. `removeFromQueue`, `clearQueue`, and playlist helpers edit the queue. A debug log records playback and recovery events.
