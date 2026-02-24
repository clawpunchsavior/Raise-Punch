<p align="center">
  <img src="https://www.raisepunch.fun" width="0" height="0" />
  <strong>🐵 RAISE PUNCH 🍌</strong>
</p>

<h1 align="center">Raise Punch</h1>
<p align="center"><em>A Tamagotchi-style virtual pet game inspired by Punch — the real baby Japanese macaque who captured the world's heart.</em></p>

<p align="center">
  <a href="https://www.raisepunch.fun">🌐 Play Now</a> &nbsp;·&nbsp;
  <a href="https://twitter.com/RaisePunch">🐦 Twitter</a>
</p>

---

## About

**Raise Punch** is a browser-based Tamagotchi game where you raise a baby Japanese macaque named Punch. Feed him bananas, cuddle him with his beloved Oran-Mama (IKEA bear), play mini-games, manage his sleep schedule, and keep him happy and healthy.

Built as a single self-contained HTML file with pixel art rendered on `<canvas>` — no frameworks, no dependencies, no build step.

**Ticker:** `$RAISE`

---

## Features

- **Pixel Art Engine** — All sprites (Punch, Oran-Mama, environments) are hand-crafted pixel art drawn directly on canvas
- **4 Core Stats** — Hunger 🍌, Happiness 💖, Energy ⚡, Love ❤️ — all decay in real-time
- **5 Actions** — Feed, Cuddle, Play, Sleep, Clean
- **Animated Cutscenes** — Unique pixel art animations for feeding, cuddling, sleeping, waking, pooping, and showering
- **Idle Play System** — Punch and Oran-Mama play together autonomously (chase, peekaboo, ball, tickle, dance, roll)
- **Poop System** — Punch poops randomly; clean him up to restore happiness
- **Persistent Save** — Game state saved to `localStorage`; stats decay even while offline
- **Activity Log** — Tracks every action with timestamps
- **Social Sharing** — Share your Punch's stats on X/Twitter, Facebook, or Instagram
- **Jungle Theme** — Parallax canvas backgrounds with fireflies, vines, and foliage
- **Fully Responsive** — Works on desktop and mobile

---

## How to Play

1. **Visit** [raisepunch.fun](https://www.raisepunch.fun)
2. **Name your Punch** — Enter a name or keep the default
3. **Keep all 4 stat bars high** by performing actions:

| Action | Button | Effect |
|--------|--------|--------|
| **Feed** | 🍌 Feed | Hunger +20, Weight +0.05 kg |
| **Cuddle** | 🧸 Cuddle | Love +20, Happiness +10 |
| **Play** | 🎮 Play | Happiness +20, Energy −10 |
| **Sleep** | 💤 Sleep | Energy recovers over time, other stats decay slowly |
| **Clean** | 🧹 Clean | Happiness +10 (only when poop is on screen) |

---

## Guidelines for Best Score

### Stat Management

All four stats (Hunger, Happiness, Energy, Love) decay continuously. Your **mood score** is the average of all four stats. Keep them balanced for the best results.

| Mood | Average Range | How It Looks |
|------|--------------|--------------|
| 🥰 **Ecstatic** | 85–100 | Best possible state |
| 😊 **Happy** | 70–84 | Great shape |
| 🙂 **Content** | 50–69 | Doing fine |
| 😐 **Okay** | 35–49 | Needs attention |
| 😟 **Sad** | 20–34 | Neglected |
| 😢 **Miserable** | 1–19 | Critical |
| 😭 **Crying** | Any stat at 0 | Emergency |

### Optimal Care Routine

1. **Feed regularly** — Hunger decays the fastest (−0.5 per tick). Feed before it drops below 50. Each feed gives +20 Hunger and adds 0.05 kg (max 6 kg).

2. **Cuddle often** — Love decays at −0.25/tick. Cuddling gives +20 Love and +10 Happiness. It's the only way to raise Love.

3. **Play for happiness** — Happiness decays at −0.35/tick. Playing gives +20 Happiness but costs −10 Energy. Don't play when Energy is low.

4. **Sleep strategically** — Energy decays at −0.2/tick while awake. Put Punch to sleep when Energy drops below 30. During sleep:
   - Energy recovers at +0.3/tick
   - Hunger decays very slowly (−0.075/tick)
   - Happiness barely decays (−0.05/tick)
   - Love barely decays (−0.04/tick)

5. **Clean immediately** — When poop appears, Happiness decays 50% faster. Clean it ASAP to stop the penalty and get +10 Happiness.

### Pro Tips

- **Never let any stat hit 0** — Punch will cry and all stats spiral faster
- **Keep all stats above 70** for the "Happy" animation and status
- **Keep all stats above 85** for "Ecstatic" — the highest mood
- **Balance feeding and playing** — Feed → Play → Cuddle is a solid rotation
- **Don't over-sleep** — Hunger still decays during sleep; wake Punch before Hunger gets too low
- **Weight matters** — Feed consistently to grow Punch from 0.3 kg toward 6 kg. Weight slowly decreases over time if not fed
- **Check back often** — Stats decay while you're away (offline decay is calculated on return)
- **Poop is random** — 35% chance every 45 seconds. Stay alert

### Decay Rates (per 3-second tick)

| Stat | Awake Decay | Sleeping Decay |
|------|------------|----------------|
| Hunger | −0.5 | −0.075 |
| Happiness | −0.35 | −0.05 |
| Energy | −0.2 | **+0.3** (recovers) |
| Love | −0.25 | −0.04 |
| Weight | −0.003 kg | −0.001 kg |

---

## Tech Stack

- **Pure HTML/CSS/JS** — Zero dependencies
- **Canvas API** — Pixel art rendering and animated cutscenes
- **localStorage** — Persistent game state
- **Google Fonts** — Press Start 2P (pixel) + Nunito (UI)
- **Vercel** — Static hosting

---

## Development

```bash
# Clone the repo
git clone https://github.com/clawpunchsavior/Raise-Punch.git
cd Raise-Punch

# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8000
```

Open `http://localhost:3000` (or `8000`) in your browser.

---

## Deployment

Hosted on [Vercel](https://vercel.com) as a static site. To deploy:

```bash
vercel --prod
```

---

## The Story of Punch

Punch is a real baby Japanese macaque born in July 2025 at a wildlife park in Japan. Rejected by his mother at birth, he was adopted by zookeepers who gave him an IKEA teddy bear named **Oran-Mama** as a surrogate. The image of tiny Punch clinging to his orange plush bear went viral worldwide, becoming a symbol of resilience and the power of love.

This game is a tribute to Punch and a reminder that every creature deserves care.

---

## Community

- **Website:** [raisepunch.fun](https://www.raisepunch.fun)
- **Pump.fun:** [Buy $RAISE](https://pump.fun/coin/DCDGy1hm4u48mC1CzrnmUCUR3dfwRnmHpnKM5wb8pump)
- **Twitter/X:** [@RaisePunch](https://twitter.com/RaisePunch)
- **Ticker:** `$RAISE`

A portion of all `$RAISE` proceeds will be donated to primate conservation and wildlife rehabilitation programs.

---

## License

MIT

---

<p align="center"><em>Made with ❤️ for Punch — the bravest baby macaque in the world.</em></p>
