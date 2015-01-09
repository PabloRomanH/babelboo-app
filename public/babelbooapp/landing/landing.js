(function() {
    var app = angular.module('landing', []);

    app.factory('submitEmail', function($http) {
        var service;

        service = function (email) {
            $http.post('/api/betaregistration', { "email": email });
        }

        return service;
    });

    app.controller('LandingController', function($http, $location, $scope, $analytics, submitEmail){
        var controller = this;
        controller.betaregistrationStep = 0;

        controller.showForm = function() {
            controller.betaregistrationStep = 1;
        }

        controller.submitEmail = function (email) {
            controller.betaregistrationStep = 2;
            submitEmail(email);
            $analytics.eventTrack('emailSubmited', {
                category: 'conversion'
            });
        }
    });
})();
