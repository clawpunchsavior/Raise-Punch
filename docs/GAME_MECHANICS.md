# Game Mechanics

Detailed documentation of Raise Punch's core game systems.

## Stat System

### Four Core Stats

| Stat | Icon | Range | Description |
|------|------|-------|-------------|
| Hunger | 🍌 | 0–100 | How well-fed Punch is |
| Happiness | 😊 | 0–100 | Punch's emotional state |
| Energy | ⚡ | 0–100 | How rested Punch is |
| Love | ❤️ | 0–100 | Bond strength with caretaker |

### Decay Rates

Stats decay continuously on a 3-second tick cycle (`DECAY_INTERVAL = 3000ms`). The base decay amount is `0.5` per tick (`DECAY_AMOUNT = 0.5`).

#### Awake Decay (per tick)

| Stat | Multiplier | Actual Decay |
|------|-----------|--------------|
| Hunger | 1.0x | -0.500 |
| Happiness | 0.7x | -0.350 |
| Energy | 0.4x | -0.200 |
| Love | 0.5x | -0.250 |
| Weight | — | -0.003 kg |

#### Sleeping Rates (per tick)

| Stat | Multiplier | Actual Rate |
|------|-----------|-------------|
| Hunger | -0.15x | -0.075 (slow decay) |
| Happiness | -0.1x | -0.050 (very slow decay) |
| Energy | +0.6x | +0.300 (recovery) |
| Love | -0.08x | -0.040 (very slow decay) |
| Weight | — | -0.001 kg |

### Poop Penalty

When `poopOnScreen` is true, Happiness receives an additional `-0.25` per tick on top of normal decay, totaling `-0.60` per tick.

## Actions

### Feed (🍌)

- **Hunger:** +20
- **Weight:** +0.05 kg (caps at 6.0 kg)
- **Triggers:** Feeding cutscene animation
- **Log:** Records feed count

### Cuddle (🧸)

- **Love:** +20
- **Happiness:** +10
- **Triggers:** Cuddling cutscene with Oran-Mama
- **Log:** Records cuddle count

### Play (🎮)

- **Happiness:** +20
- **Energy:** -10
- **Opens:** Mini-game selection modal
- **Log:** Records play count

### Sleep (💤)

- **Toggles sleep state**
- **During sleep:** Energy recovers, other stats decay slowly
- **UI:** LCD screen dims, sleep timer shows duration
- **Button changes to "Wake" mode**

### Clean (🧹)

- **Happiness:** +10
- **Only available when poop is on screen**
- **Triggers:** Shower cutscene animation
- **Clears poop state**

## Mood System

Mood is calculated from the average of all four stats. Special conditions override the tier system.

### Mood Tiers

| Priority | Condition | Mood | Icon |
|----------|-----------|------|------|
| 1 | Sleeping | Sleeping | 😴 |
| 2 | Any stat = 0 | Crying | 😭 |
| 3 | Average < 20 | Miserable | 😢 |
| 4 | Average < 35 | Sad | 😟 |
| 5 | Average < 50 | Okay | 😐 |
| 6 | Average < 70 | Content | 🙂 |
| 7 | Average < 85 | Happy | 😊 |
| 8 | Average ≥ 85 | Ecstatic! | 🥰 |

### Animation States

Each mood maps to a CSS animation class on the sprite container:

- `punch-idle` — Default bobbing
- `punch-happy` — Bouncy jumping
- `punch-sad` — Slow swaying
- `punch-crying` — Shaking with tears
- `punch-eating` — Rotation and scaling
- `punch-sleeping` — Slow breathing fade
- `punch-cuddling` — Side-to-side with Oran-Mama

## Poop System

### Spawn Mechanics

- **Check interval:** Every 45 seconds (`POOP_INTERVAL = 45000`)
- **Spawn chance:** 35% per check (`POOP_CHANCE = 0.35`)
- **Blocked during:** Sleep, existing poop on screen
- **Process:** Triggers bathroom cutscene → poop appears on LCD

### Cleanup

- Player must press Clean button
- Triggers shower cutscene
- Restores +10 Happiness
- Removes poop penalty

## Weight System

- **Initial weight:** 0.3 kg
- **Maximum weight:** 6.0 kg
- **Minimum weight:** 0.2 kg
- **Gain:** +0.05 kg per feed
- **Loss (awake):** -0.003 kg per tick
- **Loss (sleeping):** -0.001 kg per tick

## Mini-Games

### Banana Catch

- **Stat boost:** Hunger
- **Duration:** 20 seconds
- **Mechanic:** Move Punch left/right to catch falling bananas
- **Scoring:** +1 per banana caught

### Memory Match

- **Stat boost:** Happiness
- **Grid:** 4x3 (6 pairs)
- **Mechanic:** Flip cards to find matching emoji pairs
- **Scoring:** Based on pairs found and speed

### Dodge Bully

- **Stat boost:** Love
- **Duration:** 20 seconds
- **Mechanic:** Avoid incoming obstacles
- **Scoring:** Based on survival time and dodges

### Grooming

- **Stat boost:** Energy
- **Spots:** 8 spots to clean
- **Mechanic:** Click/tap spots on Punch to groom
- **Scoring:** Based on spots cleaned and speed

## Idle Play System

When no action is being performed and Punch is awake, the idle play system randomly selects activities for Punch and Oran-Mama:

| Activity | Description |
|----------|-------------|
| Chase | Punch chases Oran-Mama in circles |
| Peekaboo | Punch plays peekaboo |
| Ball | Punch and Oran-Mama play with a ball |
| Tickle | Punch tickles Oran-Mama |
| Dance | Punch dances around |
| Roll | Punch rolls on the grass |

Each activity runs for 180 frames before switching to a new random activity.

## Persistence

### Save Format

Game state is stored in `localStorage` under the key `raisePunchSave` as a JSON string containing all stat values, timestamps, and counters.

### Offline Decay

When the game loads, it calculates elapsed time since `lastUpdate` and applies proportional decay:

- **Awake offline:** Stats decay at 30% of normal rate, capped at -40 total
- **Sleeping offline:** Energy recovers at 80% rate (capped at +50), others decay at 10% rate (capped at -15)

This prevents stats from hitting zero during short absences while still penalizing long neglect.
