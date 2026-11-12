## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Components

Group components in `src/components/` by role:

- `views/`: one component per page (e.g. `HomePage.astro`). Files in `src/pages/` only render a view, so every locale route reuses the same view.
- `layouts/`: pieces of the page shell used by `src/layouts/BaseLayout.astro` (`SEO`, `Header`, `Footer`).
- `common/`: reusable UI building blocks (`ButtonLink`, `Icon`, `SectionHeader`).
- `sections/`: the content sections a view is made of (`Hero`, `Experience`, ...).

## Import aliases

Defined in `tsconfig.json` (`compilerOptions.paths`):

- `@/` → `src/` (components, layouts, i18n, data, styles, assets). Use it instead of `../` imports; same-folder imports may stay `./`.
- `~/` → project root, for root-level config or data files (e.g. `~/package.json`).

Never import from `public/` (`~/public/...` or `../public/...`): ESLint rejects it. Files in `public/` are served as-is, so reference them by URL (`/og/default.png`). Assets that Astro should process or optimize go in `src/assets/` and are imported with `@/assets/...`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
