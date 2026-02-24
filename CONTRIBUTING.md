# Contributing to Raise Punch

Thank you for your interest in contributing to Raise Punch! Every contribution helps make this project better for the community.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Raise-Punch.git
   cd Raise-Punch
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and test locally
5. **Commit** with a descriptive message
6. **Push** and open a Pull Request

## Development Setup

This is a zero-dependency static site. To run locally:

```bash
npx serve .
# or
python -m http.server 8000
```

Open `http://localhost:3000` (or `8000`) in your browser.

## Project Structure

```
Raise-Punch/
├── index.html              # Main entry point (root copy for Vercel)
├── src/
│   └── index.html          # Source HTML with inline CSS + JS
├── scripts/
│   ├── lint.js             # Code validation
│   ├── test.js             # Game logic tests
│   └── validate.js         # HTML structure validation
├── docs/
│   ├── GAME_MECHANICS.md   # Detailed game mechanics documentation
│   └── ARCHITECTURE.md     # Technical architecture overview
├── package.json
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── CHANGELOG.md
```

## Code Style

- **HTML/CSS/JS** are kept in a single file (`src/index.html`) for deployment simplicity
- All pixel art is rendered via the Canvas API — no external image assets
- Use descriptive function names and section comments (`/* ===== SECTION ===== */`)
- Keep the retro pixel aesthetic consistent across all UI elements
- Test on both desktop and mobile viewports

## What We're Looking For

### High Priority
- **New mini-games** — Add games to the mini-game modal (follow the existing pattern in `launchMG()`)
- **New idle animations** — Add activities to the `IDLE_ACTIVITIES` array
- **Accessibility improvements** — Screen reader support, keyboard navigation
- **Mobile optimizations** — Touch interactions, responsive layout fixes

### Medium Priority
- **New cutscene animations** — Feeding, sleeping, playing scenes
- **Sound effects** — Optional audio with mute toggle
- **Localization** — i18n support for multiple languages
- **Achievement system** — Milestones for feeding, cuddling, playing

### Low Priority
- **Themes** — Alternative color schemes
- **Export/import save** — Backup and restore game state
- **Leaderboard** — Community stats comparison

## Pull Request Guidelines

1. **One feature per PR** — Keep changes focused
2. **Test your changes** — Run `npm test` and verify in browser
3. **Update documentation** if your change affects game mechanics
4. **Screenshots welcome** — Include before/after for visual changes
5. **No breaking changes** to save data format without migration code

## Reporting Bugs

Open an issue with:
- Browser and OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

Thank you for helping raise Punch! 🐵🍌
