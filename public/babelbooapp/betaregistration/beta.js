(function() {
    var app = angular.module('betaregistration', []);

    app.factory('submitEmail', function($http) {
        var service;

        service = function (email) {
            $http.post('/api/betaregistration', { "email": email });
        }

        return service;
    });

    app.controller('BetaregistrationController', function($http, $location, $scope, $analytics, submitEmail){
        var controller = this;
        controller.submitted = false;

        controller.submitEmail = function (email) {
            controller.submitted = true;
            submitEmail(email);
            $analytics.eventTrack('emailSubmited', {
                category: 'conversion'
            });
        }
    });
})();
