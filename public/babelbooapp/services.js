(function() {
    var app = angular.module('babelbooapp');

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

        service.getById = function(playlistId) {
            return $http.get('/api/playlist/' + playlistId);
        };

        service.getRelated = function(playlistId) {
            return $http.get('/api/playlist?related=' + playlistId);
        }

        service.getWithTagLevel = function (tag, level) {
            var query = '/api/playlist/?tags=' + tag + '&level=' + level;
            return $http.get(query);
        }

        return service;
    });

    app.factory('tags', function($http) {
        var service = {};

        service.getTags = function (callback) {
            $http.get('/api/tag').success(callback);
        };

        return service;
    });

    app.factory('levelNames', function() {
        return {
            names: ['zero', 'easy', 'medium', 'hard']
        };
    });

    app.factory('renderTime', function() {
        function pad (number) {
            var str = '00' + String(number);

            return str.substr(str.length - 2);
        }

        return function (seconds) {
            if (!seconds) return;

            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            seconds = (seconds % 3600) % 60;

            seconds = pad(seconds);

            if (hours !== 0) {
                minutes = pad(minutes);
                return hours + ':' + minutes + ':' + seconds;
            }
            return minutes + ':' + seconds;
        };
    });

})();