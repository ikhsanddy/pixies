# Contributing to Pixies

Thanks for helping improve Pixies, a self-hosted speed-test analytics application.

## Prerequisites

- [Bun](https://bun.sh) 1.4 or newer (runtime, package manager and build tool)
- Git
- Docker, only if you want to test the container image

## Development setup

```sh
git clone https://github.com/ikhsanddy/pixies.git
cd pixies
bun install
cd client && bun install && cd ..
bun run dev
```

`bun run dev` generates the migration and integration indexes, starts the API on port `5216` and
the dashboard dev server on Vite's default port. Generated indexes
(`server/migrations/index.js`, `server/integrations/index.js`) are build artifacts; edit the
individual migration or integration files instead.

For the additional apps:

```sh
cd web && bun install && bun run dev    # landing page
cd docs && bun install && bun run dev   # documentation site
```

## Project layout

```
client/   React 19 dashboard (Vite, PWA)
server/   Bun + Express 5 API, Sequelize models, migrations, integrations
web/      Landing page (React + Vite)
docs/     VitePress documentation
scripts/  Installer, uninstaller and code generators
```

## Code style

- Plain JavaScript and JSX. Do not add TypeScript files or types.
- Follow the existing indentation, naming and import conventions of the directory you edit.
- Styles are written in SCSS/Sass next to the components that use them.
- Keep changes focused; do not reformat unrelated code or commit build output.
- Only `client/public/assets/locales/en.json` is edited here. Other locale files are managed
  outside this repository.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Gotify notification template
fix: handle missing certificates on startup
docs: clarify reverse proxy setup
chore: bump client dependencies
```

Allowed types include `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore` and `revert`. Keep the subject in the imperative mood and under 72 characters. Reference
issues in the footer, for example `Fixes #123`.

## Pull requests

1. Open an issue first for larger changes so the approach can be discussed.
2. Fork the repository and create a branch from `master`.
3. Make the change and verify it locally:
   - `bun run generate-migrations && bun run generate-integrations`
   - `cd client && bun run build`
   - `cd web && bun run build`
   - `cd docs && bun run build`
4. Fill in the pull request template, including what changed and how you tested it.
5. Keep one logical change per pull request. Do not include translations, generated indexes or
   build output.

CI runs the same build steps on pushes and pull requests to `master`. A pull request is merged
once CI passes and a maintainer has reviewed it.

## Reporting bugs

Open an issue using the bug report template (English or German) and include:

- Pixies version and installation method (binary, Docker, source)
- Operating system and browser
- Steps to reproduce, expected behavior and actual behavior
- Relevant logs or screenshots with secrets removed

Use the feature request template for ideas. Never report security vulnerabilities in a public
issue; follow [SECURITY.md](SECURITY.md) instead.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
