module.exports = {
    root: true,
    env: {
        node: true
    },
    // extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended', '@vue/prettier', '@vue/prettier/@typescript-eslint'],
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended'],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/no-this-alias': 0,
        quotes: [1, 'single'],
        curly: [2, 'multi-line'],
        'no-undef': 'off',
        'no-sparse-arrays': 0,
        'vue/comment-directive': 'off',
        semi: [2, 'never'],
        "vue/multi-word-component-names": [0]
    }
}
