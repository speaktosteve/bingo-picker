# Bingo picker

A static, browser-only app for drawing numbers and names without replacement. Each page load starts a new in-memory session; refreshing or closing the page loses its history. Prize tracking is not included.

## Entrants

Replace the example entries in `src/lib/entrants.csv` with the real list. Keep the `number,name` header and use a unique positive whole number and a non-empty name on each row. Standard CSV quoting is supported, for example `1,"Doe, Jane"`. Commit the file to `main` to publish changes. The CSV and names are public as part of the site; do not include private information.

## Development

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
npm test
npm run check
npm run build
```

The static site is written to `build/`. For a project site, set `BASE_PATH` when building, for example `BASE_PATH=/bingo-picker npm run build`.

## Deployment

In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Pushes to `main` run the checks, build the site with the repository name as its base path, and deploy to GitHub Pages. The workflow can also be started manually. This configuration is for a project site such as `https://speaktosteve.github.io/bingo-picker/`.
