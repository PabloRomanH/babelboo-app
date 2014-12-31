// Karma configuration
// Generated on Wed Dec 31 2014 09:35:45 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../..',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'public/lib/angular.js',
      'public/lib/angular-route.js',
      'public/lib/angulartics.min.js',
      'public/lib/angulartics-ga.min.js',
      'public/babelbooapp/playlist/playlist.js',
      'public/babelbooapp/editPlaylists/playlists.js',
      'public/babelbooapp/playlists/playlists.js',
      'public/babelbooapp/play/angular-youtube-embed.js',
      'public/babelbooapp/play/play.js',
      'public/babelbooapp/navbar.js',
      'public/babelbooapp/app.js',
      'public/babelbooapp/services.js',
      'public/lib/angular-mocks.js',
      'test/karma/**/test*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
