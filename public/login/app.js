var _gaq = _gaq || [];

(function() {
    var app = angular.module('login', ['ngRoute']);
    
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
                templateUrl: '/login/email/email.html'
            }).
            when('/thanks', {
                templateUrl: '/login/thanks/thanks.html'
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

function loadAnalytics() {
    _gaq.push(['_setAccount', 'UA-56348024-1'],
            ['_trackPageview']);
    (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}