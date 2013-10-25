module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochacli: {
          options: {
              reporter: 'progress',
              bail: true
          },
          all: ['tests/*.js']
    },
    watch: {
      files: ['**/*'],
      tasks: ['test']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('test', ['mochacli']);

};