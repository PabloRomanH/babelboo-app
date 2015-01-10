(function() {
    var app = angular.module('babelbooapp');

    app.factory('user', function($http) {
        var service = {};
        service.data = 0;

        service.fillUser = function(callback) {
            if (!service.data) {
                $http.get('/api/user').success(function(data) {
                    service.data = data;
                    callback(service.data);
                });
            } else {
                callback(service.data);
            }
        }

        service.correctAnswer = function (playlistId, videoId, ratio) {
            if (!service.data) {
                return;
            }

            if (!service.data.playlistprogress) {
                service.data.playlistprogress = {};
            }

            if (!service.data.playlistprogress[playlistId]) {
                service.data.playlistprogress[playlistId] = {};
            }

            if (!service.data.playlistprogress[playlistId].correct) {
                service.data.playlistprogress[playlistId].correct = {};
            }
            
            service.data.playlistprogress[playlistId].ratio = ratio;
            service.data.playlistprogress[playlistId].correct[videoId] = true;

            return $http.post('/api/user/' + service.data.username + '/correctanswer/' + playlistId, { id: videoId, ratio: ratio });
        }

        return service;
    });

    app.factory('playlists', function($http) {
        var service = {};

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
            if (typeof seconds === "undefined") return '';
            if (seconds < 0) return '';

            seconds = Math.round(seconds);

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