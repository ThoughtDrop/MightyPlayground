module.exports = function(config){
  config.set({

    basePath : './',

    frameworks: ['mocha', 'chai', 'jasmine'],

    files : [
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-ui-router/src/*.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/ionic/js/ionic.js',
    'bower_components/ionic/js/ionic-angular.min.js',

      //app code
      'dev/js/*.js',
    // 'server/**/*.js',

      //spec files
      'test/**/*.js',
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
