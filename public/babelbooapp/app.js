(function() {
    var app = angular.module('babelbooapp', ['ngRoute', 'player', 'playlist', 'playlists', 'managePlaylists', 'angulartics', 'angulartics.google.analytics']);

    app.config(function ($analyticsProvider) {
        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true);  /* Records full path */
    });

    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })

    app.config(function($routeProvider) {
        $routeProvider.
            when('/', {
                redirectTo: '/playlists'

            }).
            when('/playlist', {
                templateUrl: '/babelbooapp/playlist/playlist-fragment.html'
            }).
            when('/playlist/:playlistId', {
                templateUrl: '/babelbooapp/playlist/playlist-fragment.html'
            }).
            when('/playlists', {
                templateUrl: '/babelbooapp/playlists/playlists-fragment.html'
            }).
            when('/play/:playlistId', {
                templateUrl: '/babelbooapp/play/play-fragment.html'
            }).
            when('/manage', {
                templateUrl: '/babelbooapp/editPlaylists/playlists-fragment.html'
            }).
            when('/points', {
                templateUrl: '/babelbooapp/points/under-construction.html'
            }).
            otherwise({
                templateUrl: '/babelbooapp/error-fragment.html'
            });
    });

    app.factory('user', function($http) {
        var service = {};
        service.user = 0;

        service.fillUser = function(callback) {
            if (!service.user) {
                $http.get('/api/user').success(function(data) {
                    service.user = data;
                    callback(service.user);
                });
            } else {
                callback(service.user);
            }
        }

        service.answerPlaylist = function (playlistId, points) {
            service.user.points += points;
            return $http.post('/api/user/' + service.user.username + '/answer/' + playlistId, { points: points });
        }
        return service;
    });

    app.factory('playlists', function($http) {
        var service = {};
        service.user = 0;

        service.getRelated = function(playlistId, callback) {
            $http.get('/api/playlist?related=' + playlistId).success(function(data) {
                callback(data);
            });
        }

        service.answerPlaylist = function (playlistId, points) {
            service.user.points += points;
            return $http.post('/api/user/' + service.user.username + '/answer/' + playlistId, { points: points });
        }
        return service;
    });

    app.factory('levelNames', function() {
        return {
            names: ['zero', 'easy', 'medium', 'hard']
        };
    });

    app.controller('NavbarController', function($http, $scope, $analytics, $window, user, $route, $location) {
        this.user = {};
        var controller = this;

        user.fillUser(function (user) {
            controller.user = user;
        });

        controller.pointsClicked = function() {
            $analytics.eventTrack('pointsClicked', {
                    category: 'navigation', label: controller.user._id
                });
        };

        controller.goToPlaylists = function() {
            $location.path('/playlists'); // FIXME: prevent controller from being loaded twice
            $route.reload();
        };
    });

})();

// compatibility definition of indexOf for IE8
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex, j = this.length; i < j; i++) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
}