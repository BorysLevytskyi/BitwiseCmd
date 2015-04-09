module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
          files: {
              'build/js/bitwisecmd.js': [
                  'src/js/core/core.js',
                  'src/js/core/is.js',
                  'src/js/core/should.js',
                  'src/js/core/di.js',
                  'src/js/core/appShell.js',
                  'src/js/core/htmlBuilder.js',
                  'src/js/core/observable.js',

                  'src/js/app.js',

                  // TODO: Make components to put their extensions to AppShell instead of app
                  'src/js/components/*.*',
                  'src/js/app/**/*.*'
              ]
          }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'build/css/styles.css': ['src/css/styles.css']
        }
      }
    },
      copy: {
          files: {
              src: 'src/*.*',
              dest: 'build/',
              flatten: true,
              expand: true
          }
      },
      processhtml: {
          build: {
              files: {
                  'build/index.html' : ['build/index.html']
              }
          }
      }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');



    // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin','copy', 'processhtml']);

};