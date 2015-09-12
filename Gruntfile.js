// Ŭnicode please
module.exports = function (grunt) {
  "use strict";
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: {
      options: {
        clean: false
      },
      glob: {
        files: {
          'publish/libs/js': [
            'underscore/*.js',
            'underscore/*.map',
            'mocha/*.js',
          ],
          'publish/libs/css': [
            'fontawesome/css/*.css',
            'pure/*.css',
            'mocha/mocha.css'
          ],
          'publish/libs/fonts': [
            'fontawesome/fonts/*'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');

  // Default task(s).
  grunt.registerTask('default', ['bowercopy']);
};
