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
  // every JS rule in the frontmatter. Keep the Astro parser so imports and
  // unused variables are checked there too.
  .override('antfu/formatter/astro', ({ languageOptions: _, ...config }) => config)
