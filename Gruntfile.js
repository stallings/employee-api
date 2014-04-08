module.exports = function(grunt) {

    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsbeautifier: {
            files: ['Gruntfile.js', 'app.js', 'config/*.js', 'models/*.js', 'routes/*.js', 'utilities/*.js'],
            options: {}
        },
        jshint: {
            files: ['<%= jsbeautifier.files %>'],
            options: {
                strict: true,
                globals: {
                    console: true
                }
            }
        },
        watch: {
            files: ['<%= jsbeautifier.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('default', ['jsbeautifier', 'jshint']);
};
