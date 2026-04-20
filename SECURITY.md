# Platform Security & Privacy Compliance

Handling the exact geo-locational telemetry of thousands of fans intrinsically raises zero-trust security concerns, particularly regarding PII-leakage ("stalker-level tracking"). This platform architects specialized safeguards directly into the physical database pipelines to explicitly nullify tracking vulnerabilities.

## 1. PII-Stripping Protocol
We do not store personally identifiable location histories linked directly to active accounts indefinitely.
* **The Node `crypto` Sandbox**: Deep within our constructed Cloud Functions pipeline (`functions/index.js`), the exact moment geographical telemetry updates process outward, the user's localized UUID is subjected to a mandatory `sha256` hashing mechanism.
* The downstream tracking pipelines streaming into BigQuery *never observe who the user actually was*. They exclusively calculate overlapping mathematical vectors and grids to establish aggregated congestion. 

## 2. Frictionless (Yet Hardened) Authentication Layer
* **Anonymous Landing**: We invoke `signInAnonymously()` derived from Firebase Auth implicitly on map-load. We actively bypass asking the fan for passwords or invoking OAuth gates to radically preserve the true frictionless entry mechanic.
* **Rule Enforcement Hooks**: Even though users are essentially "Ephemeral Unknowns," the actual `database.rules.json` strictly disables all unauthenticated interactions (`"auth != null"` conditionally applied across the board). This completely shields the exposed Firebase Realtime Database ports from unauthorized third-party REST API scraping.

## 3. Environment Facade Segregation
* Absolutely zero API keys relating to Google Maps layouts, Firebase DB routing arrays, or Vertex AI endpoints are hardcoded statically into the raw React Native source. 
* Systems remain decoupled cleanly via `.env.example` configurations bound strictly to the `EXPO_PUBLIC_` mapping interface, assuring production builds are cleanly severed from development keys.
