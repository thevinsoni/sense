# Contributing to FivoSense

Thank you for your interest in contributing to FivoSense! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/sense.git`
3. Install dependencies: `npm install`
4. Run tests: `npm test`

## Development

```bash
# Watch mode for development
npm run dev

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
```

## Project Structure

```
src/
├── engine/       # Core analysis engine
├── features/     # User-facing features
├── rules/        # Detection rules
├── ai/           # AI integration
├── hooks/        # Agent hooks
├── editors/      # Editor adapters
└── cli/          # Command-line interface
```

## Adding a New Detection Pattern

1. Add source pattern to `src/engine/sources.ts`
2. Add sink pattern to `src/engine/sinks.ts`
3. Add tests to `test/engine.test.ts`
4. Update documentation

## Code Style

- TypeScript strict mode
- Descriptive variable names
- Comments for complex logic
- Tests for all new features

## Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Add tests
4. Run tests: `npm test`
5. Commit: `git commit -m "feat: your feature"`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

## Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `chore:` Maintenance

## Questions?

Open an issue or discussion on GitHub!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
