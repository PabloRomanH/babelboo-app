(function() {
    var app = angular.module('babelbooapp', ['ngRoute', 'navbar', 'player', 'tv', 'playlist', 'video', 'playlists', 'managePlaylists', 'angulartics', 'angulartics.google.analytics']);

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
            when('/tv', {
                templateUrl: '/babelbooapp/tv/tv-fragment.html'
            }).
            when('/manage', {
                templateUrl: '/babelbooapp/editPlaylists/playlists-fragment.html'
            }).
            when('/video', {
                templateUrl: '/babelbooapp/video/video-fragment.html'
            }).
            when('/points', {
                templateUrl: '/babelbooapp/points/under-construction.html'
            }).
            otherwise({
                templateUrl: '/babelbooapp/error-fragment.html'
            });
    });

    app.directive('navbar', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/navbar-fragment.html'
        };
    });

    app.controller('NavbarController', function($http, $scope, $analytics, $window, user, $route, $location) {
        this.user = {};
        var controller = this;
        controller.showLogout = false;

        user.fillUser(function (user) {
            controller.user = user;
        });

        controller.toggleLogout = function () {
            controller.showLogout = !controller.showLogout;
        }

        controller.pointsClicked = function () {
            $analytics.eventTrack('pointsClicked', {
                    category: 'navigation', label: controller.user._id
                });
        };

        controller.goToPlaylists = function () {
            if($location.path() == '/playlists') {
                $route.reload();
            } else {
                $location.path('/playlists'); // FIXME: prevent controller from being loaded twice
            }
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