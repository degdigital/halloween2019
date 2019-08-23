const {files, plugins} = require('../common/css.config.js');
const outputDir = 'export';

module.exports = {
    name: 'css',
    plugins: [
        {
            name: '@deg-skeletor/plugin-postcss',
            config: {
                files: files(`${outputDir}/css/`),
                plugins
            }
        }
    ]
};