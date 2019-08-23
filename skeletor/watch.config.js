module.exports = {
	name: 'watch',
	plugins: [
		{
			name: '@deg-skeletor/plugin-watch',
			config: {
				targets: [
					{
						name: 'css',
						paths: 'source/css/**/*.css',
						events: ['add', 'change', 'delete'],
						tasks: [
							{
								name: 'build',
								subTasks: ['css']
							}
						]
					},
					{
						name: 'js',
						paths: 'source/js/**/*.js',
						events: ['add', 'change', 'delete'],
						tasks: [
							{
								name: 'build',
								subTasks: ['js']
							}
						]
					},
					{
						name: 'html',
						paths: 'source/html/**/*.html',
						events: ['add', 'change', 'delete'],
						tasks: [
							{
								name: 'build',
								subTasks: ['html']
							}
						]
					},
					{
						name: 'patterns',
						paths: ['source/_patterns/**/*','source/_data/**/*','source/_meta/**/*','source/_annotations/**/*'],
						events: ['add', 'change', 'delete'],
						tasks: [
							{
								name: 'build',
								subTasks: ['patterns']
							}
						]
					},
					{
						name: 'static',
						paths: ['source/fonts/**/*', 'source/images/**/*'],
						events: ['add', 'change', 'delete'],
						tasks: [
							{
								name: 'build',
								subTasks: ['static']
							}
						]
					}
				]
			}
		}
	]
};