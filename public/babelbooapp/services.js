(function() {
    var app = angular.module('services', []);

    app.factory('user', function($http) {
        var service = {};
        service.data = 0;

        service.fillUser = function(callback) {
            $http.get('/api/user').success(function(data) {
                service.data = data;
                callback(service.data);
            });
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

        service.finished = function(playlistId) {
            return $http.post('/api/user/' + service.data.username + '/finished/' + playlistId);
        }

        return service;
    });

    app.factory('playlists', function($http) {
        var service = {};

        /**
         * Retrieves the videos of a playlist to play and notifies the API
         * to increase the play count.
         */
        service.getPlaylist = function(idOrSlug, callback) {
            $http.get('/api/playlist/' + idOrSlug).success(function (data) {
                $http.post('/api/playlist/' + data._id + '/increasevisitcount');
                callback(data);
            });
        };

        service.getRelated = function(playlistId) {
            return $http.get('/api/playlist?related=' + playlistId);
        }

        service.getWithTagLevel = function (tag, level) {
            var query = '/api/playlist/?tags=' + tag + '&level=' + level;
            return $http.get(query);
        }

        service.getPopular = function (numResults, level) {
            var query = '/api/playlist?popular=true&num_results=' + numResults;

            if (typeof level !== 'undefined') {
                query += '&level=' + level;
            }

            return $http.get(query);
        }

        return service;
    });

    app.factory('ranking', function($http, user) {
        var service = {};
        var username = null;

        service.getRanking = function(period) {
            return $http.get('/api/ranking/' + period);
        };

        service.getUserRank = function(callback) {
            if (username == null) {
                user.fillUser(function (user) {
                    username = user.username;
                    getRank(callback);
                });
            } else {
                getRank(callback);
            }
        }

        function getRank(callback) {
            $http.get('/api/ranking/alltime').success(function(data) {
                for(var i = 0; i < data.length; i++) {
                    if (data[i].username == username) {
                        callback(data[i]);
                        break;
                    }
                }
            });
        }

        return service;
    });

    app.factory('plot', function($http) {
        var service = {};

        service.getData = function(period) {
            return $http.get('/api/plot/' + period);
        };

        return service;
    });

    app.factory('videos', function($http) {
        var service = {};

        service.getByLevel = function(level) {
            return $http.get('/api/video/' + level);
        };

        service.addLoose = function (videos) {
            return $http.post('/api/video', videos);
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

    app.factory('now', function() {
        return function() { return new Date(); };
    });

    app.factory('login', function($http) {
        return function(username, password, callback) {
            var hashedPassword = hash(password);
            $http.post('/login/', { username: username, password: hashedPassword })
                .success(function(data, status) {
                    callback(true);
                })
                .error(function(data, status) {
                    callback(false);
                });
        };
    });

    app.factory('registration', function($http) {
        return function(email, nickname, password, callback) {
            var hashedPassword = hash(password);

            $http.post('/api/user/', { email: email, nickname: nickname, password: hashedPassword })
                .success(function() {
                    callback(true);
                })
                .error(function() {
                    callback(false);
                });
        };
    });

    app.factory('recover', function($http) {
        return function(email) {
            $http.post('/api/user/recover', { email: email});
        };
    });

    app.factory('resetpassword', function($http) {
        return function(token, password, callback) {
            $http
                .post('/api/user/reset', { token: token, password: hash(password) })
                .success(function() {callback(true)})
                .error(function() {callback(false)});
        };
    });

    app.factory('profile', function($http) {
        return function(username, email, password, newpassword, callback){
            var postOpts = {
                username: email,
                nickname: username,
                password: hash(password),
                newpassword: (typeof newpassword !== 'undefined')? hash(newpassword): undefined
            };

            $http
                .post('/api/user/update', postOpts)
                .success(function() {callback && callback(true)})
                .error(function() {callback && callback(false)});
        };
    })

    function hash(string) {
        return CryptoJS.SHA1(string).toString(CryptoJS.enc.Hex);
    }
})();
