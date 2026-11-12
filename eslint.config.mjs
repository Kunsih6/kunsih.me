import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  formatters: {
    astro: true,
  },
  stylistic: {
    indent: 2,
  },
})
