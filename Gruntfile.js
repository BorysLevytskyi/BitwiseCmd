module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/**/*.js',
        dest: 'build/js/bitwisecmd.min.js'
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