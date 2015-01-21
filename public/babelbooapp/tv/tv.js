(function() {
    var app = angular.module('tv', ['youtube-embed']);

    app.controller('TvController', function($analytics, $scope, $location, user, videos, levelNames) {
        MAX_VIDEOS_UNREGISTERED = 3;
        var controller = this;
        var playlistRetrieved = false;

        controller.videos = [];

        controller.userLogged = false;

        controller.levelNames = levelNames.names;

        controller.isLevelSelected = false;

        controller.idx = 0;
        controller.videoId = null;
        controller.playerVars = { autoplay: 1, autohide: 3, iv_load_policy: 3, showinfo: false, controls: 0 };
        controller.player = null;
        controller.elapsed = 0;

        user.fillUser(function (userData) {
            controller.userLogged = true;
        });

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        controller.playLevel = function (level) {
            controller.isLevelSelected = true;
            videos.getByLevel(level).success(function (data) {
                controller.videos = shuffle(data);
                controller.videoId = controller.videos[controller.idx].videoId;
            });
        }

        controller.playPrevious = function () {
            if (controller.idx == 0) {
                controller.player.seekTo(0, true);
            } else {
                controller.idx = controller.idx - 1;
                var videoId = controller.videos[controller.idx].videoId;
                controller.player.loadVideoById(videoId);
            }
        }

        controller.playNext = function () {
            if (controller.idx >= MAX_VIDEOS_UNREGISTERED && !controller.userLogged) {
                $location.path('/register'); // FIXME: prevent controller from being loaded twice
                // $route.reload();
            }

            if (controller.idx == controller.videos.length - 1) {
                controller.player.seekTo(controller.player.getDuration(), true);
            } else {
                controller.idx = controller.idx + 1;
                var videoId = controller.videos[controller.idx].videoId;
                controller.player.loadVideoById(videoId);
            }
        }

        controller.seek = function(event) {
            var ratio = event.offsetX / event.toElement.parentElement.clientWidth;
            controller.player.seekTo( controller.player.getDuration() * ratio);
        }

        $scope.$on('youtube.player.ended', function ($event, player) {
            if (controller.idx < controller.videos.length - 1) {
                controller.playNext();
            }
        });

        $scope.$on('youtube.player.ready', function ($event, player) {
            controller.player.unMute();
            controller.player.setVolume(100);

            setInterval(function(){
                $scope.$apply( function() {
                    if (controller.player) {
                        controller.elapsed = controller.player.getCurrentTime();
                    }
                });
            }, 500); //polling frequency in miliseconds

        });
    });

    app.directive('levelCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/tv/level-card.html'
        }
    });

    app.directive('tvCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/tv/tv-card.html'
        }
    });
})();
