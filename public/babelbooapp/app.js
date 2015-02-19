(function() {
    var app = angular.module('babelbooapp', [
        'ngRoute', 'navbar', 'betaregistration', 'recover', 'resetpassword',
        'services', 'landing', 'video', 'tv', 'player', 'playlist', 'playlists',
        'ranking', 'plot', 'profile', 'managePlaylists', 'angulartics',
        'angulartics.google.analytics']);

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){ // Initialize a new promise
        var deferred = $q.defer();

        // Make an AJAX call to check if the user is logged in
        $http.get('/loggedin').success(function(user){
            if (user !== '0') { // Authenticated
              $timeout(deferred.resolve, 0);
            } else { // Not Authenticated
                $rootScope.message = 'You need to log in.';
                $timeout(function(){deferred.reject();}, 0);
                $location.url('/login');
             }
         });
    };

    app.factory('submitFeedback', function($http) {
        var service;

        service = function (feedback) {
            $http.post('/api/feedback', { "message": feedback });
        }

        return service;
    });

    app.controller('FeedbackController', function($location, user, submitFeedback){
        this.user = {};
        var controller = this;
        controller.userLogged = false;
        controller.formVisible = false;

        user.fillUser(function (user) {
            controller.user = user;
            controller.userLogged = true;
        });

        controller.toggleForm = function() {
            controller.formVisible = !controller.formVisible;
        }

        controller.submit = function(feedback) {
            submitFeedback('Feedback submitted from route ' + $location.path() + ' : ' + feedback);
            controller.formVisible = false;
        }
    });

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
            when('/login', {
                templateUrl: '/babelbooapp/landing/landing-fragment.html'
            }).
            when('/register', {
                templateUrl: '/babelbooapp/betaregistration/betaregistration-fragment.html'
            }).
            when('/playlist', {
                templateUrl: '/babelbooapp/playlist/playlist-fragment.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/playlist/:playlistId', {
                templateUrl: '/babelbooapp/playlist/playlist-fragment.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/playlists', {
                templateUrl: '/babelbooapp/playlists/playlists-fragment.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/play/:playlistId', {
                templateUrl: '/babelbooapp/play/play-fragment.html'
            }).
            when('/tv', {
                templateUrl: '/babelbooapp/tv/tv-fragment.html'
            }).
            when('/manage', {
                templateUrl: '/babelbooapp/editPlaylists/playlists-fragment.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/video', {
                templateUrl: '/babelbooapp/video/video-fragment.html'
            }).
            when('/progress', {
                templateUrl: '/babelbooapp/progress/progress-fragment.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/recover', {
                templateUrl: '/babelbooapp/recover/recover-fragment.html',
            }).
            when('/resetpassword', {
                templateUrl: '/babelbooapp/resetpassword/resetpassword-fragment.html',
            }).
            when('/profile', {
                templateUrl: '/babelbooapp/profile/profile-fragment.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            otherwise({
                templateUrl: '/babelbooapp/error-fragment.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    });

    app.directive('navbar', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/navbar-fragment.html'
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
