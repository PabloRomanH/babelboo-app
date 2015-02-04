(function() {
    var app = angular.module('landing', []);

    app.factory('submitEmail', function($http) {
        var service;

        service = function (email) {
            $http.post('/api/betaregistration', { "email": email });
        }

        return service;
    });

    app.controller('LandingController', function($location, $analytics, submitEmail, signup){
        var controller = this;
        controller.levelSelectorVisible = false;
        controller.playlists = [];

        signup.signupPlaylists().success(function(playlists) {
            controller.playlists = playlists;
        });

        controller.showLevelSelector = function() {
            controller.levelSelectorVisible = true;            
        }

        controller.startEasyPlaylist = function() {
            $location.path('/play/' + controller.playlists[0]._id);
            $analytics.eventTrack('startEasyPlaylist', {category: 'conversion'});
        }

        controller.startMediumPlaylist = function() {
            $location.path('/play/' + controller.playlists[1]._id);
            $analytics.eventTrack('startMediumPlaylist', {category: 'conversion'});
        }

        controller.startHardPlaylist = function() {
            $location.path('/play/' + controller.playlists[2]._id);
            $analytics.eventTrack('startHardPlaylist', {category: 'conversion'});
        }
    });
})();
