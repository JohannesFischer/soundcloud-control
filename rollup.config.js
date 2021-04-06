import copy from 'rollup-plugin-copy'
import cleaner from 'rollup-plugin-cleaner'

const outputDir = 'build/extension'
const output = {
  format: 'iife',
  dir: outputDir
}

const plugins = [
  cleaner({
    targets: [outputDir]
  }),
  copy({
    targets: [
      { src: ['src/*', '!**/*.js'], dest: 'build/extension' }
    ]
  })
]

export default [
  {
    input: 'src/background.js',
    output,
    plugins
  },
  {
    input: 'src/content.js',
    output
  },
  {
    input: 'src/popup/popup.js',
    output: {
      ...output,
      dir: `${outputDir}/popup`
    }
  }
]
