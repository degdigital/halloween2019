const {directories} = require('../common/static.config.js');

module.exports = {
	name: 'static',
	plugins: [
		{
			name: '@deg-skeletor/plugin-copy',
			config: {
				directories: [
					...directories({
						imagesDestPath: 'patternlab/images',
						fontsDestPath: 'patternlab/fonts'
					}),
					...directories({
						imagesDestPath: 'app/images',
						fontsDestPath: 'app/fonts'
					})
				]
			}
		}
	]
};