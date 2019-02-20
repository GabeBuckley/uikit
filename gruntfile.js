module.exports = function(grunt) {

    grunt.initConfig(
        {
            pkg: grunt.file.readJSON('package.json'),
            less: {
                development: {
                    options: {
                        paths: ['dev/less']
                    },
                    files: {
                        'test/assets/css/uikit.css': 'dev/less/uikit.less'
                    }
                }
            }
        }
    );

    // Compile the CSS from LESS files
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);

};