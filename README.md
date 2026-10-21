# VITVERSE ✳ — Campus, in a new dimension

VITVERSE is an interactive, animated **VIT Vellore-inspired campus concept**. It imagines what exploring a university campus could feel like with a playful miniature 3D world, polished micro-interactions, and a friendly interface.

> This is an **independent student design concept**, not an official VIT product. The campus layout and routes are fictional/illustrative, the activities are samples, and no location, availability, or actual navigation data is provided.

## Live features

- **Interactive 3D model** built programmatically using Three.js: orbit by dragging, zoom with the scroll wheel or controls, and reset the view.
- **Five stylized landmarks:** Knowledge Centre, Technology Tower, Campus Commons, Main Gate, and Innovation Hub. Select a building marker or card to focus on it.
- **Route visualization** draws a flowing dotted path between your selected places on the 3D scene (concept route only).
- **Quick find** searches destinations in a keyboard-friendly modal. Use `Ctrl + K`, `⌘ + K`, or `/`.
- **Sample happenings** with filters and locally saved inspiration cards.
- Responsive mobile layout, animated hover states, live IST clock, keyboard support, and reduced-motion preferences.

## How to run

This is a static frontend: **HTML + CSS + vanilla JavaScript + Three.js (ES modules)**. No API keys, backend, login, or npm installation required.

Three.js is loaded via a CDN import map, so **internet access is required for the full 3D scene**. The design and other interactive features remain usable if Three.js cannot load, with an abstract 3D CSS fallback.

**Recommended:** run a local web server (ES modules work best over HTTP, rather than `file://`). From this folder:

```bash
python -m http.server 5500
```

Then visit **http://localhost:5500** in Chrome, Edge, Firefox, or Safari.

If you have VS Code, you can also use the *Live Server* extension on `index.html`.

## Controls

| Action | Control |
| --- | --- |
| Orbit miniature | Drag on the scene |
| Zoom | Mouse wheel or `+ / −` controls |
| Reset camera / clear route | `↺` control |
| Explore a location | Click a map marker or location card |
| Find a destination | `Ctrl + K`, `⌘ + K`, or `/` |
| Plan a concept route | Select endpoints under **Routes**, then **Visualize route** |
| Save a demo activity | **Save idea** (saved only in your browser) |

## Technology & design decisions

- **Three.js** provides genuine WebGL 3D geometry, lighting, shadows, motion, and a navigable orthographic camera; buildings are created procedurally, so no large model downloads are needed.
- **Vanilla JavaScript** handles interactive state using semantic DOM controls and custom events, keeping the app lightweight and easy to understand.
- **CSS** handles a responsive editorial layout, low-cost transitions, layered lighting effects, and a fallback visual when WebGL modules are unavailable.
- **Reduced motion** is respected where supported. On mobile, particle count and pixel ratio are lower to improve performance.
- Sample activities and all map information are intentionally demo content rather than invented real campus facts.
- No trackers, personal-data collection, third-party account access, or server-side storage. Saved ideas use browser localStorage.

## Project structure

```text
vitverse/
├── index.html         # Semantic markup and import map
├── css/
│   └── style.css      # Responsive styles and animations
├── js/
│   ├── app.js         # UI, search, routing controls, filters
│   └── world.js       # Three.js model and route rendering
└── README.md          # This file
```

## Ideas for expansion

Hook up verified, permissioned campus map data; add an accessible list-first navigation experience; integrate an official events calendar if authorized; build turn-by-turn routes only after proper map surveying and routing verification.

---

**Concept:** A campus should be more than a place you get through. It should be a place you discover.
