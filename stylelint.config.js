module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules', 'stylelint-config-sass-guidelines'],
  syntax: 'scss',
  rules: {
    'scss/dollar-variable-pattern': /[a-z][A-Za-z0-9]*/,
    'scss/at-mixin-pattern': /[a-z][A-Za-z0-9]*/,
    'selector-class-pattern': /[a-z][A-Za-z0-9]*/,
    'color-hex-length': 'short',
    'max-nesting-depth': 4,
    'selector-max-compound-selectors': 4,
    'value-list-comma-newline-after': null,
    'function-parentheses-space-inside': null,
    'block-closing-brace-newline-after': null,
    'at-rule-empty-line-before': null,
    'declaration-colon-newline-after': null,
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
  },
  ignoreFiles: ['!**/*.scss', '**/node_modules'],
};
