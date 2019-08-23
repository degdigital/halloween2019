const {rollupConfig, copyConfig} = require('../common/js.config.js');
const outputDir = 'app/js';

module.exports = {
	name: 'js',
	plugins: [
		{
			name: '@deg-skeletor/plugin-rollup',
			config: rollupConfig(outputDir)
        },
		{
            name: '@deg-skeletor/plugin-copy',
            config: copyConfig(outputDir)
        }
	]
};