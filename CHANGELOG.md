# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-23

### Added
- Core Tamagotchi game loop with 4 stats: Hunger, Happiness, Energy, Love
- Real-time stat decay system with configurable tick rates
- Persistent game state via localStorage with offline decay calculation
- Pixel art rendering engine using Canvas API
- Punch sprite with 7 animation states: idle, happy, sad, crying, eating, sleeping, cuddling
- Oran-Mama companion sprite (IKEA bear)
- 5 core actions: Feed, Cuddle, Sleep, Play (mini-games), Clean
- 4 mini-games: Banana Catch, Memory Match, Dodge Bully, Grooming
- Animated cutscenes for feeding, cuddling, sleeping, waking, bathroom, and shower
- Idle play system with 6 autonomous activities: chase, peekaboo, ball, tickle, dance, roll
- Poop system with random spawn (35% chance every 45s) and cleanup mechanic
- Dynamic mood system based on average stat values (8 mood tiers)
- Weight tracking system (0.3 kg to 6 kg)
- Activity log with timestamps (max 50 entries)
- Social sharing to X/Twitter, Facebook, and Instagram
- Parallax jungle background with canvas-rendered foliage
- Firefly particle system
- Tabbed content sections: Guide, Story, Tamagotchi History, Macaques, Oran-Mama, Community
- Token section with $RAISE ticker
- Responsive design for desktop and mobile
- Pixelated monkey favicon (inline SVG)
- Sleep timer UI with real-time countdown
- Action burst particle effects (bananas, hearts, stars, confetti)
- Pet info panel with age, weight, mood, and lifetime stats

### Technical
- Zero external dependencies — pure HTML/CSS/JS
- Single-file architecture for deployment simplicity
- Canvas-based pixel art renderer with 4x scaling
- CSS custom properties for theming
- Google Fonts integration (Press Start 2P, Nunito)
- Deployed on Vercel as static site
