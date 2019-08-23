module.exports = {
	tasks: [
		{
			name: 'build',
			subTasks: [
				require('./skeletor/build/css.config.js'),
				require('./skeletor/build/js.config.js'),
				require('./skeletor/build/html.config.js'),
				require('./skeletor/build/patterns.config.js'),
				require('./skeletor/build/static.config.js')
			]
		},
		{
			name: 'export',
			environment: 'production',
			subTasks: [
				require('./skeletor/export/css.config.js'),
				require('./skeletor/export/js.config.js'),
				require('./skeletor/export/html.config.js'),
				require('./skeletor/export/patterns.config.js'),
				require('./skeletor/export/static.config.js')
			]
		},
		{
			name: 'serve',
			subTasks: [
				require('./skeletor/serve.config.js')
			]
		},
		{
			name: 'watch',
			subTasks: [
				require('./skeletor/watch.config.js')
			]
		}
	]
}