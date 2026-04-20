# Architecture Decoupling & Offloading Strategy

To solve for the **"Frictionless Fan"** persona, the platform requires fluid rendering (60 FPS minimum frames on the mobile device) absolutely regardless of venue congestion levels. We achieve this by aggressively **decoupling** the heavy processing mathematics away from the React Native Client (Frontend).

## 1. Intelligence & Pathfinding Offloading
Instead of running standard geometric algorithms locally to navigate dense crowds:
* The React Native client focuses purely on drawing graphical boundaries via simple Map `<Polyline>` elements.
* All AI logic for wait-time predictions (The Agentic Concierge) is deliberately isolated behind a Node.js firewall inside `functions/index.js` making native API calls to **Vertex AI / Gemini 1.5 Pro**. The frontend application offloads prompt engineering and merely interprets raw string responses.

## 2. Telemetry Batching Strategy 
The active mobile client remains oblivious to exactly *who* or *where* every individual congestion point is. 
Instead of the phone downloading 55,000 active tracking coordinates to map crowd presence:
* Everything is autonomously processed remotely. The 50,000 points securely pipeline automatically into **Google BigQuery** (Task 6). 
* BigQuery executes complex `ST_SNAPTOGRID` matrix equations asynchronously securely inside GCP, exporting mathematically reduced Heatmap matrices outward to simplified mapping nodes, replacing millions of coordinates with roughly ~10 discrete cluster densities.

This system guarantees that your stadium operations can seamlessly map multi-floor congestion without accidentally choking up the attendee's personal hardware or draining consumer batteries!
