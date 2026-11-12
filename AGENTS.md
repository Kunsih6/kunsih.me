## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Components

Group components in `src/components/` by role:

- `views/`: one component per page (e.g. `HomePage.astro`). Files in `src/pages/` only render a view, so every locale route reuses the same view.
- `layouts/`: pieces of the page shell used by `src/layouts/BaseLayout.astro` (`SEO`, `Header`, `Footer`), and `SectionLayout`, the `<section>` every content section renders in. It sets the gutters, the vertical spacing (`spacing`: `both`, `bottom` or `none`) and an optional `divider`. Pass the section's `id`, `aria-labelledby`, data hooks and `class` to it; its own styles still apply.
- `common/`: reusable UI building blocks (`ButtonLink`, `Icon`, `SectionHeader`).
- `sections/`: the content sections a view is made of (`Hero`, `Experience`, ...).

## Import aliases

Defined in `tsconfig.json` (`compilerOptions.paths`):

- `@/` → `src/` (components, layouts, i18n, data, styles, assets). Use it instead of `../` imports; same-folder imports may stay `./`.
- `~/` → project root, for root-level config or data files (e.g. `~/package.json`).

Never import from `public/` (`~/public/...` or `../public/...`): ESLint rejects it. Files in `public/` are served as-is, so reference them by URL (`/favicon.svg`). Assets that Astro should process or optimize go in `src/assets/` and are imported with `@/assets/...`.

## Styles

- Global styles live in `src/styles/`, one file per purpose (`tokens`, `base`, `typography`, `accessibility`, `motion`, `print`). `main.css` imports them all, and `BaseLayout.astro` imports `main.css` once.
- Only styles shared by several components go there. A style that a single component uses lives in that component's `<style>`. Use `<style is:global>` only for elements it creates from a script or for `<html>` pseudo-elements (see the theme scan in `Header.astro`).

## i18n

- Interface strings live in `src/i18n/langs/<lang>.ts`, one file per language, and `src/i18n/ui.ts` combines them. Group them in nested objects by area (`seo: { title, description }`), not flat dotted keys (`'seo.title'`).
- `en.ts` defines the shape (`Messages`); other language files use `satisfies Messages`, so the type checker (editor or `tsc --noEmit`) flags a missing or extra key.
- Read strings with `t('seo.title')` from `useTranslations(lang)`. Its dotted keys (`UIKey`) are derived from `Messages`.
- Don't add plural variants of units (years, months, ...) to the message files. Format them with `Intl.NumberFormat` (`style: 'unit'`), which picks the plural form per locale (see `src/utils/date.ts`).

## Motion

- Content must be readable without motion or JavaScript: render every element in its final state and only hide it right before it animates.
- Animate on page load with CSS keyframes inside `@media (prefers-reduced-motion: no-preference)` (see the hero intro in `Hero.astro`).
- For scroll reveals, add `data-reveal="up"` (or `"words"` / `"chars"` around a `SplitText`) and an optional `data-reveal-delay` in ms. `src/scripts/motion.ts` handles them, along with the other scroll- and pointer-linked effects, and does nothing under reduced motion.
- A `clip-path` keyframe needs `inset()` at both ends: `none` cannot be interpolated, so the animation would jump.

## Share images

- `src/pages/og/[lang].png.ts` builds the Open Graph / Twitter card of each language at `/og/<lang>.png`, and `SEO.astro` uses it by default. `src/utils/share-card.ts` draws it like the hero in the dark theme, from `site.ts`, `cv.ts` and the i18n strings, so it follows content changes. Preview it in dev at `/og/en.png`.
- Satori lays it out and turns text into paths; sharp makes the PNG. Satori reads only static TTF/OTF fonts, so `src/assets/og/` holds Unbounded Medium (an instance of the variable font) and Share Tech Mono, each with its SIL OFL license, which must stay next to it.
- Its colors copy the dark tokens of `src/styles/tokens.css`; change both together.

## Deployment

The site is static and deploys to Cloudflare Workers as static assets, with no adapter ([Astro guide](https://docs.astro.build/en/guides/deploy/cloudflare/)).

- `wrangler.jsonc` serves `dist/`. With `not_found_handling: "404-page"`, a missing path gets the nearest `404.html` up its folders, so `/es/...` shows the Spanish page (see `localeNotFoundPages` in `astro.config.mjs`).
- `public/_headers` sets response headers: a one-year immutable cache for the fingerprinted files in `/_astro/`, and security headers (HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options`) for every response. Only fingerprinted files may get the immutable cache: rules match by path, so a file whose name stays the same when its content changes would stay stale for a year.
- `send_metrics: false` in `wrangler.jsonc` stops Wrangler from sending usage data to Cloudflare, locally and in CI.
- The `workers.dev` URL and the preview URLs are public. Preview URLs are served with `X-Robots-Tag: noindex`; the `workers.dev` copy of the site is not, and only its canonical links point search engines to `https://kunsih.me`. Once the custom domain serves the site, set `workers_dev: false`.
- `pnpm preview` builds the site and serves it with Wrangler at `http://localhost:8787`, the way Cloudflare does (404 pages, trailing-slash redirects, headers). `pnpm cf:deploy` builds and deploys from your machine; it needs `wrangler login` once. Don't name a script `deploy`: `pnpm deploy` is a built-in pnpm command.
- CI/CD is Cloudflare Workers Builds, connected to the GitHub repository. Every push to `main` runs the build command `pnpm check && pnpm build` and then the deploy command `npx wrangler deploy`. With "Enable Preview Builds" on (Settings > Build > Branch control), pushes to other branches of this repository get a preview build, and its URL is posted on the pull request. `pnpm check` runs `astro sync`, ESLint and `tsc`, so a lint or type error fails the build and nothing is deployed.
- The Worker in the Cloudflare dashboard must be named `kunsih-me`, like `name` in `wrangler.jsonc`, or the build fails. The build reads the Node version from `.nvmrc` and the pnpm version from `packageManager` in `package.json`; keep both in line with local development.
- `allowBuilds` in `pnpm-workspace.yaml` lets Wrangler's dependencies `esbuild` and `workerd` run their install scripts. A new dependency with install scripts needs an entry there, or `pnpm install` fails.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
