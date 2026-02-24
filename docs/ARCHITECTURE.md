# Technical Architecture

Overview of Raise Punch's technical design and implementation.

## System Overview

```
┌─────────────────────────────────────────────────┐
│                  index.html                      │
│  ┌───────────┐  ┌────────────┐  ┌────────────┐ │
│  │   CSS      │  │   HTML     │  │ JavaScript │ │
│  │  (~290     │  │  (~320     │  │  (~2500    │ │
│  │   lines)   │  │   lines)   │  │   lines)   │ │
│  └───────────┘  └────────────┘  └────────────┘ │
└─────────────────────────────────────────────────┘
         │                │               │
         ▼                ▼               ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  Theming  │    │  Canvas  │    │  Game    │
   │  System   │    │  Render  │    │  Engine  │
   └──────────┘    └──────────┘    └──────────┘
```

## Single-File Architecture

The entire application lives in one HTML file (`src/index.html`). This design choice was intentional:

- **Zero build step** — No bundler, transpiler, or package manager needed
- **Instant deployment** — Upload one file to any static host
- **No CORS issues** — All resources are inline (except Google Fonts)
- **Offline-capable** — Once loaded, the game works without network

## Rendering Pipeline

### Canvas Layers

The visual system uses multiple canvas elements layered with CSS z-index:

| Layer | Element | Z-Index | Purpose |
|-------|---------|---------|---------|
| Background | `#jungleBg` | 0 | Parallax jungle background |
| Content | `.content-wrap` | 10 | HTML UI elements |
| Fireflies | `#firefliesCanvas` | 99 | Floating particle effects |
| Foreground | `#jungleFg` | 100 | Foreground foliage overlay |
| Modals | `.modal-overlay` | 3000 | Mini-game modal |

### Pixel Art Renderer

All sprites are rendered programmatically using the Canvas 2D API:

```javascript
function drawPA(ctx, pixels, scale) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  pixels.forEach(([x, y, color]) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, y * scale, scale, scale);
  });
}
```

Sprites are defined as arrays of `[x, y, color]` tuples. The `getPunch(state)` and `getOran()` functions return these arrays based on the current animation state.

### Cutscene System

Animated cutscenes (feeding, sleeping, bathroom, etc.) use the `#feedScene` canvas overlay:

1. Scene function receives a callback (`onDone`)
2. Sets canvas opacity to 1 (visible)
3. Runs a `requestAnimationFrame` loop drawing pixel art frames
4. On completion, fades canvas and calls `onDone()`

Each scene has its own drawing functions for environments and character poses.

## Game Loop

### Tick System

The game runs on two intervals:

| Timer | Interval | Purpose |
|-------|----------|---------|
| `decayT` | 3000ms | Stat decay, poop checks, save |
| `renderT` | 500ms | Sprite re-render |

### State Machine

```
                    ┌──────────┐
                    │  NAMING  │ (Initial overlay)
                    └────┬─────┘
                         │ startGame()
                         ▼
              ┌──────────────────┐
              │      IDLE        │◄──────────────┐
              │  (Normal play)   │               │
              └──┬───┬───┬───┬──┘               │
                 │   │   │   │                   │
    feed()  cuddle() │  sleep()          action complete
         │   │       │   │                       │
         ▼   ▼       ▼   ▼                       │
    ┌─────────┐ ┌────────┐ ┌──────────┐         │
    │CUTSCENE │ │ MINI   │ │ SLEEPING │         │
    │(locked) │ │ GAME   │ │ (energy  │         │
    └────┬────┘ └───┬────┘ │ recovery)│         │
         │          │      └────┬─────┘         │
         └──────────┴───────────┴───────────────┘
```

### Action Lock

The `actLock` flag prevents overlapping actions. When an action starts:
1. `actLock = true`
2. Idle play stops
3. Action buttons are disabled
4. Cutscene plays
5. On completion: `actLock = false`, idle play resumes

## Data Persistence

### localStorage Schema

Key: `raisePunchSave`

```json
{
  "name": "Punch",
  "hunger": 80,
  "happiness": 80,
  "energy": 80,
  "love": 80,
  "sleeping": false,
  "sleepStart": 0,
  "weight": 0.3,
  "feedCount": 0,
  "cuddleCount": 0,
  "playCount": 0,
  "cleanCount": 0,
  "poopOnScreen": false,
  "lastPoopTime": 0,
  "lastUpdate": 1708700000000,
  "created": 1708700000000,
  "activityLog": [
    { "type": "feed", "text": "Punch ate a banana!", "time": 1708700100000 }
  ]
}
```

### Save Migration

The `init()` function includes migration checks for older save formats:

```javascript
if (gs.weight === undefined) gs.weight = 0.3;
if (gs.feedCount === undefined) gs.feedCount = 0;
// ... etc
```

This ensures backward compatibility as new features are added.

## CSS Architecture

### Custom Properties

All colors are defined as CSS custom properties on `:root`:

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#061006` | Page background |
| `--primary` | `#4CAF50` | Primary green |
| `--screen` | `#7ecf7e` | LCD screen green |
| `--accent` | `#ff4444` | Alert/accent red |
| `--gold` | `#FFD700` | Stats and highlights |
| `--cream` | `#fdf6ee` | Text on dark backgrounds |
| `--text` | `#e8f5e8` | Default text color |
| `--glow` | `rgba(126,207,126,0.4)` | Glow effects |

### Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| 600px | Content padding reduces |
| 480px | Stats grid becomes single column, reduced padding |

## Performance Considerations

- **No external JS libraries** — Minimal parse/execute time
- **Canvas rendering** — Hardware-accelerated pixel drawing
- **requestAnimationFrame** — Smooth cutscene animations synced to display refresh
- **CSS animations** — GPU-composited sprite animations
- **Minimal DOM manipulation** — Most visual updates are canvas-based
- **Efficient save** — Only writes to localStorage on state changes
