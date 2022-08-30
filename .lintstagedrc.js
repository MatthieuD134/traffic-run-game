const path = require('path');

const buildEslintCommand = (filenames) =>
	`./node_modules/.bin/eslint --fix ${filenames
		.map((f) => path.relative(process.cwd(), f))
		.join(' ')}`;

module.exports = {
	'!(public/static/bundle/**/*)*.{js,jsx,ts,tsx}': [buildEslintCommand],
	'!(public/static/bundle/**/*)*.{md,json,html,js,jsx,ts,tsx}':
		'./node_modules/.bin/prettier --write',
};
