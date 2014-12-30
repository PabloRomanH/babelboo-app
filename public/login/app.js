(function() {
    var app = angular.module('login', ['ngRoute', 'angulartics', 'angulartics.google.analytics']);

    app.config(function ($analyticsProvider) {
        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true);  /* Records full path */
    });

    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })

    app.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: '/login/call/call-fragment.html'
            }).
            when('/email', {
                templateUrl: '/login/email/email-fragment.html'
            }).
            when('/thanks', {
                templateUrl: '/login/thanks/thanks-fragment.html'
            });
            // .
            // otherwise({
            //     templateUrl: '/login/call/call-fragment.html'
            // });
      }]);

    app.factory('submitEmail', function($http) {
        var service;

        service = function (email) {
            $http.post('/api/betaregistration', { "email": email });
        }

        return service;
    });

    app.controller('LoginController', function($analytics, $http){
        var controller = this;
        controller.formVisible = false;
        controller.showPassword = false;

        this.toggleForm = function() {
            controller.formVisible = !controller.formVisible;
            $analytics.eventTrack('callToAction', {
                category: 'conversion'
            });
        }

        this.submit = function($event) {
            if (!controller.showPassword && (this.username == 'sepha' || this.username == 'toni' || this.username == 'fran')) {
                controller.showPassword = true;
                $event.preventDefault()
            }
        }
    });

    app.controller('EmailController', function($http, $location, $analytics, submitEmail){
        var controller = this;
        controller.formVisible = false;

        this.submitEmail = function (email) {
            submitEmail(email);
            $location.path('/thanks');
            $analytics.eventTrack('emailSubmited', {
                category: 'conversion'
            });
        }
    });
})();
