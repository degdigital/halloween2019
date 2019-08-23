const path = require('path');
const {files, plugins} = require('../common/css.config.js');

module.exports = {
	name: 'css',
	plugins: [
		{
			name: '@deg-skeletor/plugin-postcss',
			config: {
				files: [
					...files('patternlab/css/'),
					...files('app/css/'),
					{
						src: path.resolve('source/css/styleguide.css'),
						dest: path.resolve('patternlab/css/styleguide.css')
					}
				],
				plugins
			}
		}
	]
};