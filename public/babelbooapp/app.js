var _gaq = _gaq || [];

(function() {
    var app = angular.module('babelbooapp', ['ngRoute', 'player', 'playlist', 'playlists']);
    
    app.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/babelbooapp/home-fragment.html'
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
/*            when('/error', {
                controller: function(){
                    window.location.replace('/');
                }
            }).*/
            otherwise({
                templateUrl: '/babelbooapp/error-fragment.html'
            });
      }]);
    
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