// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-tabs':'off',
    // 要求使用分号
    'semi': 'off',
    'padded-blocks': 'off',
    'comma-dangle': 'off',
    //双引号
    'quotes':'off',
    // 禁止函数圆括号之前空格
    'space-before-function-paren': 'off',
    // 使用类型安全的 === 和 !==
    'eqeqeq': 'off',
    // 要求使用驼峰命名
    'camelcase': 'off',
    // 禁用 caller 或 callee
    // 'no-caller': 'off',
    //多行空格
    'no-multiple-empty-lines':'off',
    // 关闭默认缩进，使用vue缩进
    'indent': 'off',
    'vue/script-indent': ['error', 2, {'baseIndent': 1, 'switchCase': 1}],
    'no-useless-constructor': 'off',
    'spaced-comment': 'off'
  }
}
