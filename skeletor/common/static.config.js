const path = require('path');

module.exports = {
	directories: function({imagesDestPath, fontsDestPath}, isExport = false) {
		return [
            {
                src: isExport ? 'source/images/{,!(sample)/**/}*' : 'source/images',
                dest: path.resolve(imagesDestPath)
            },
            {
                src: 'source/fonts',
                dest: path.resolve(fontsDestPath)
            }
        ];
	}
}