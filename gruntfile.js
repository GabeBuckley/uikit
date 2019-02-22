module.exports = function(grunt) {
    
    var gruntConfig = {
            pkg: grunt.file.readJSON('package.json'),
            
            // Configuration options for grunt-contrib-less
            less: 
            {
                development: 
                {
                    options: 
                    {
                        paths: ['dev/less']
                    },
                    files: 
                    {
                        'release/assets/css/uikit.css': 'dev/less/uikit.less'
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
            }
        
        }
    
    
    grunt.initConfig(gruntConfig);
    
    
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    
    
    grunt.registerTask('run_tests', "", function(){
        grunt.task.run('shell:runTests');
        grunt.task.run('open_test_results');
    });
    
    grunt.registerTask('open_test_results', "", function(){
        grunt.task.requires('run_tests');
        grunt.task.run('shell:openTestResults');
    });

    grunt.registerTask('test', "", function(){
        grunt.task.run('run_tests');
    });
    

};                    
