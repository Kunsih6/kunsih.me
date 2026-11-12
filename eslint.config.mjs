import antfu from '@antfu/eslint-config'

const GLOB_ASTRO_ALL = ['**/*.astro', '**/*.astro/*.ts', '**/*.astro/*.js']

export default antfu(
  {
    astro: true,
    // Explicit: without it, a missing `typescript` package makes antfu ignore every .ts file.
    typescript: true,
    formatters: {
      astro: true,
    },
    stylistic: {
      indent: 2,
    },
  },
  {
    rules: {
      // Files in `public/` are served as-is: reference them by URL (`/og/default.png`).
      // Importing them duplicates the file under `/_astro/`. Assets that need
      // processing belong in `src/assets/` (`@/assets/...`).
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?:~/|(?:\\.\\./)+)public(?:/|$)',
              message: 'Do not import from public/. Reference the file by its URL (e.g. "/favicon.svg") or move it to src/assets/ and import it with "@/assets/...".',
            },
          ],
        },
      ],
    },
  },
  {
    // Prettier formats whole .astro files (frontmatter, template and <script>).
    // These stylistic rules disagree with it there and cause circular fixes.
    files: GLOB_ASTRO_ALL,
    rules: {
      'antfu/reasonable-newline': 'off',
      'style/arrow-parens': 'off',
      'style/brace-style': 'off',
      'style/operator-linebreak': 'off',
      'style/quote-props': 'off',
    },
  },
)
  // antfu sets a plain parser on .astro when Prettier formats them, which skips
  // every JS rule in the frontmatter. Keep the Astro parser so imports,
  // unused variables and the `public/` restriction are checked there too.
  .override('antfu/formatter/astro', ({ languageOptions: _, ...config }) => config)
