const { parse } = require('@vue/compiler-sfc')
const glob = require('glob')
const eslint = require('eslint')
const path = require('path')
const fs = require('fs')

// 配置 ESLint
const cli = new eslint.ESLint({
  useEslintrc: false,
  overrideConfigFile: path.resolve(__dirname, './.eslintrc.json')
});

// 解析 Vue 文件
function analyzeComponent(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const { descriptor } = parse(source, { filename: filePath })
  return descriptor
}

// 获取所有的 Vue 文件
glob('src/**/*.vue', (err, files) => {
  // 逐个文件分析
  for (const file of files) {
    const { template, script } = analyzeComponent(file)
    if (template) {
      // 使用 ESLint 分析组件
      cli.lintFiles([file])
        .then(results => {
          const unusedComponents = []
          results.forEach(result => {
            const messages = result.messages.filter(msg => msg.ruleId === 'vue/no-unused-components')
            unusedComponents.push(...messages.map(msg => components[msg.line - 1]))
          })
          if (unusedComponents.length > 0) {
            console.log(`\n未使用的组件：${unusedComponents.join(', ')}，文件：${file}`)
          } else {
            console.log(`\n没有未使用的组件，文件：${file}`)
          }
        })
    }
  }
})
