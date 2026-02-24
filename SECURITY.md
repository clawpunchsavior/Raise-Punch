# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within Raise Punch, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. **Email** the maintainers directly or use GitHub's private vulnerability reporting feature
3. Include a detailed description of the vulnerability and steps to reproduce

## Security Considerations

### Client-Side Storage

Raise Punch uses `localStorage` to persist game state. This data is:
- Stored locally in the user's browser only
- Never transmitted to any server
- Not encrypted (it contains only game state, no sensitive data)

### No Server-Side Components

This is a fully static, client-side application. There are no:
- API endpoints
- Database connections
- User authentication systems
- Server-side data processing

### Third-Party Resources

The only external resources loaded are:
- **Google Fonts** (`fonts.googleapis.com`) — Press Start 2P and Nunito typefaces

### Content Security

- No user-generated content is rendered as HTML
- No `eval()` or dynamic code execution
- No external JavaScript dependencies

## Response Timeline

We aim to acknowledge security reports within 48 hours and provide a fix within 7 days for confirmed vulnerabilities.
