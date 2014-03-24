module.exports = function(config) {
    config.set({
        basePath: './',

        files: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-mocks/angular-mocks.js',
                    // Always load jquery before the other vendor libs
                    'vendor/assets/javascripts/**/jquery.js',
                    'vendor/assets/javascripts/*.js',
                    'app/assets/javascripts/*.js',
                    'test/**/*.spec.js'
                ],

        exclude: [
                ],


        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        reporters: ['spec'],

        plugins: [
                    'karma-spec-reporter',
                    'karma-chrome-launcher',
                    'karma-firefox-launcher',
                    'karma-jasmine'
                ],


        autoWatch: true,

        singleRun: false,

        colors: true,

        logLevel: config.LOG_INFO

    });
};
