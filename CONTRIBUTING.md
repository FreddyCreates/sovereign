# Contributing to Sovereign

Thank you for your interest in the Sovereign Autonomous Intelligence Framework.

## Before You Contribute

Please note that Sovereign is protected under the **Sovereign AI Protection License (SAPL) v1.0**. Before contributing, ensure you understand the license terms, particularly regarding attribution and derivative works.

**Attribution**: Alfredo Medina Hernandez — immutable

## How to Contribute

### Reporting Issues

1. Check existing issues to avoid duplicates
2. Use the issue template (if available)
3. Provide clear reproduction steps
4. Include relevant system information

### Development Setup

```bash
# Clone the repository
git clone https://github.com/FreddyCreates/sovereign.git
cd sovereign

# Frontend setup
cd src/frontend && pnpm install --prefer-offline

# Backend setup
cd ../backend && mops install

# Generate bindings
cd ../.. && pnpm bindgen
```

### Code Style

- **Frontend**: Run `pnpm fix` for linting and formatting
- **Backend**: Run `mops check --fix` for type checking
- Follow existing patterns in the codebase
- Maintain φ-doctrine compliance where applicable

### Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with clear, descriptive commits
4. Ensure all checks pass:
   ```bash
   # Frontend
   cd src/frontend && pnpm typecheck && pnpm fix
   
   # Backend
   cd src/backend && mops check --fix
   ```
5. Submit a pull request with a clear description

### Commit Messages

Use clear, descriptive commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for test additions/changes

## Doctrine Compliance

All contributions must respect the Sovereign Doctrine:
- Sovereign bounds: S0_FLOOR (0.75) to S_CEIL (9.75)
- PHI mathematics: 1.6180339887498948482
- Coherence thresholds above 0.618 (φ⁻¹)
- 873ms heartbeat rhythm where applicable

## Questions?

Open an issue for any questions about contributing.

---

**Attribution**: Alfredo Medina Hernandez — immutable
