module.exports = function(grunt) {



// Project configuration.
grunt.initConfig({
  concat: {
   
    dist: {
      src: ['public/app/app.js', 'public/app/app.routes.js',
      "public/app/controllers/mainCtrl.js", "public/app/controllers/userCtrl.js", "public/app/controllers/fixtureCtrl.js", "public/app/services/authService.js", 
      "public/app/services/fixtureAttendService.js", "public/app/services/fixtureService.js", "public/app/services/goalService.js", "public/app/services/userService.js"
      ],
      dest: 'public/build/js/angular.js',
    },
  },

	
	uglify: {
	    my_target: {
	      files: {
	        'public/build/js/angular.min.js': 'public/build/js/angular.js'
	      }
	    }
  	},

  	watch: {
	  js: {
	    files: ['public/app/**/**/*.js'],
	    tasks: ['concat', 'uglify'],
	    
	  },
	},
});

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');


};