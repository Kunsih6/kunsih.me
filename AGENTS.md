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

## Styles

- Global styles live in `src/styles/`, one file per purpose (`tokens`, `base`, `typography`, `layout`, `accessibility`, `motion`, `print`). `main.css` imports them all, and `BaseLayout.astro` imports `main.css` once.
- Only styles shared by several components go there. A style that a single component uses lives in that component's `<style>`.

## i18n

- Interface strings live in `src/i18n/langs/<lang>.ts`, one file per language, and `src/i18n/ui.ts` combines them. Group them in nested objects by area (`seo: { title, description }`), not flat dotted keys (`'seo.title'`).
- `en.ts` defines the shape (`Messages`); other language files use `satisfies Messages`, so the type checker (editor or `tsc --noEmit`) flags a missing or extra key.
- Read strings with `t('seo.title')` from `useTranslations(lang)`. Its dotted keys (`UIKey`) are derived from `Messages`.
- Don't add plural variants of units (years, months, ...) to the message files. Format them with `Intl.NumberFormat` (`style: 'unit'`), which picks the plural form per locale (see `src/utils/date.ts`).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
