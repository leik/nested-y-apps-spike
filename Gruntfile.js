/* jshint node: true */

var path = require('path'),
	shifter = require('shifter');

module.exports = function(grunt) {
	var srcDir = 'src/',
		webDir = 'web/';

	grunt.initConfig({
		clean: [ webDir ],

		copy: {
			html: {
				files: [{ expand: true, src: [ '**/*.html' ], cwd: srcDir, dest: webDir}]
			}
		},

		watch: {
			options: {
				nospawn: true
			},
			scripts: {
				files: srcDir + '**/*.*',
				tasks: ['build']
			}
		},

		yuiConfig: {
			spike: {
				options: {
					dest: 'web/yui_config.js',
					groups: {
						spike: {
							base: '/static/',
							modules: [ webDir + '**/*-debug.js'],
							processPath: function (p) {
								return p.replace(webDir, '');
							}
						}
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-yui-config');

	grunt.registerTask(
		'run-shifter',
		'Performs a full build with Shifter.',
		function() {
			var done = this.async();
			shifter.init({
				cwd: path.join(process.cwd(), srcDir),
				'build-dir': path.join(process.cwd(), webDir),
				walk: true
			}, done);
		}
	);

	grunt.registerTask('build', ['run-shifter', 'copy:html', 'yuiConfig']);
	grunt.registerTask('default', ['build', 'watch']);
};
