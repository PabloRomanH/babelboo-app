(function() {
    var app = angular.module('landing', []);

    app.factory('submitEmail', function($http) {
        var service;

        service = function (email) {
            $http.post('/api/betaregistration', { "email": email });
        }

        return service;
    });

    app.controller('LandingController', function($location, $analytics, submitEmail, playlists){
        var controller = this;
        controller.levelSelectorVisible = false;

        playlists.getPopular(1, 1).success(function(playlists) {
            controller.easyPlaylist = playlists[0];
        });

        playlists.getPopular(1, 2).success(function(playlists) {
            controller.mediumPlaylist = playlists[0];
        });

        playlists.getPopular(1, 3).success(function(playlists) {
            controller.hardPlaylist = playlists[0];
        });

        controller.showLevelSelector = function() {
            controller.levelSelectorVisible = true;            
        }

        controller.startEasyPlaylist = function() {
            $location.path('/play/' + controller.easyPlaylist._id);
            $analytics.eventTrack('startEasyPlaylist', {category: 'conversion'});
        }

        controller.startMediumPlaylist = function() {
            $location.path('/play/' + controller.mediumPlaylist._id);
            $analytics.eventTrack('startMediumPlaylist', {category: 'conversion'});
        }

        controller.startHardPlaylist = function() {
            $location.path('/play/' + controller.hardPlaylist._id);
            $analytics.eventTrack('startHardPlaylist', {category: 'conversion'});
        }
    });
})();
