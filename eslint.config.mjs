import antfu from '@antfu/eslint-config'

const GLOB_ASTRO_ALL = ['**/*.astro', '**/*.astro/*.ts', '**/*.astro/*.js']

export default antfu(
  {
    astro: true,
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
    // These stylistic rules fight Prettier, which formats whole .astro files.
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
  // Keep the Astro parser: the formatter's plain parser skips every JS rule in the frontmatter.
  .override('antfu/formatter/astro', ({ languageOptions: _, ...config }) => config)
