module.exports = function (grunt) {

    const fs = require('fs');
    
    const iconFolder = './dev/svg/';
    const lessFolder = './dev/less/';
        
	var stuff = {
		buildDate: new Date().toUTCString()
	}
	console.log(stuff);

	function banner(strFile, strVersion) {
		return ['/******************************************',
				' * ',
			    ' * File:      ' + strFile,
				' * Version:   ' + strVersion,
				' * Buid Date: ' + stuff.buildDate,
				' * Author:    Gabe Buckley <gb@gabrielbuckley.com>',
				' * ',
				' */',
				''
			   ].join('\n');
	}

	var gruntConfig = {
		pkg: grunt.file.readJSON('package.json'),

		// Configuration options for grunt-contrib-less
		less: {
			development: {
				options: {
					paths: ['dev/less']
				},
				files: {
					'dist/uikit.css': 'dev/less/uikit.less'
				}
			}
		},

		// Configuration options for grunt-shell
		shell: {
			runTests: {
				command: 'test\\bin\\run_tests.cmd'
			},
			openTestResults: {
				command: 'test\\bin\\open_test_results.cmd'
			}
		},

		clean: {
			dist: "dist/"
		},

		// Configuration options for grunt-replace
		replace: {
			clean_css: {
				options: {
					patterns: [
						{
							match: /\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//gi,
							replacement: ''
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: ['dist/**/*'],
						dest: 'dist/'
					}
				]
			},
		},

		file_append: {
			banner: {
				files: [
					{
						prepend: banner('uikit.css', '1.0.0'),
						input: 'dist/uikit.css',
						output: 'release/assets/css/uikit.css'
					}
				]
			}
		}
	}


	grunt.initConfig(gruntConfig);


	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-file-append');

	grunt.registerTask('run_tests', "", function () {
		grunt.task.run('shell:runTests');
		grunt.task.run('open_test_results');
	});

	grunt.registerTask('open_test_results', "", function () {
		grunt.task.requires('run_tests');
		grunt.task.run('shell:openTestResults');
	});

	grunt.registerTask('test', "", function () {
		grunt.task.run('run_tests');
	});

	grunt.registerTask('clean_css', "", function () {
		grunt.task.run('replace:clean_css');
	});




	/*******************************************
	 * Build and release
	 */
	grunt.registerTask('release', "", function () {
		grunt.task.run('less');
		grunt.task.run('clean_css');
		grunt.task.run('file_append:banner');
		grunt.task.run('clean:dist');
	});
    
    grunt.registerTask('compile_icons', "", function(){
        var lessText = "/** DATE STAMP: " + new Date( ).toUTCString() + " **/ \n\n";
        
        fs.readdirSync(iconFolder).forEach(file => {
            var svgFile = fs.readFileSync(iconFolder + file);
            var svgBuff = Buffer.from(svgFile);
            var svgB64 = svgBuff.toString('base64');
            var lessSVG = [
                 ".icon-" + file.replace('.svg','') + " {"
                ,"  background-image: url('data:image/svg+xml;utf8,"
                ,svgB64 + "');"
                ,"}\n"
            ].join('\n');
            
            lessText = [lessText, lessSVG].join('\n');
        });
        
        fs.writeFileSync(iconFolder + 'icons.less', lessText);
        
        console.log('compile_icons ended');
    });
};
