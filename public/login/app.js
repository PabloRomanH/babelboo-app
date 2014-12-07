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

    app.controller('LoginController', function(){
        var controller = this;
        controller.formVisible = false;

        this.toggleForm = function() {
            controller.formVisible = !controller.formVisible;
        }
    });

    app.controller('EmailController', function($http, $location){
        var controller = this;
        controller.formVisible = false;

        this.submitEmail = function (email) {
            $http.post('/api/betaregistration', { "email": email });
            $location.path('/thanks');
        }
    });
})();
