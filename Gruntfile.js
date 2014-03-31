module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'app.js', 'config/*.js', 'models/*.js', 'routes/*.js', 'utilities/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true
        }
      }
    },
      watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};