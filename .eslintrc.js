// https://docs.expo.dev/guides/using-eslint/
module.exports = {
	extends: ['expo', 'prettier'],
	plugins: ['prettier'],
	rules: {
		// "prettier/prettier": "error",
		'no-console': 'warn',
		'import/order': [
			'error',
			{
				groups: [
					['builtin', 'external'],
					'internal',
					['parent', 'sibling', 'index'],
				],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		'no-trailing-spaces': 'error', // Sin espacios al final de línea
		'no-multiple-empty-lines': [
			'error',
			{
				max: 1,
			},
		],
	},
	ignorePatterns: ['/dist/*'],
}
