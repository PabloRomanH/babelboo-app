(function() {
    var app = angular.module('player', []);

    app.controller('PlayController', function($scope, $http, $routeParams, $location, $window, $timeout, $analytics, user, playlists, levelNames) {
        var controller = this;
        var idx = 0;
        var playlistId = $routeParams.playlistId;
        var playlistRetrieved = false;

        controller.POINT_PER_VIDEO = 10;
        controller.POINT_PER_CORRECT = 100;

        controller.correctAnswers = 0;
        controller.incorrectAnswers = 0;
        controller.points = 0;

        controller.questionsAtTheEnd = false;
        controller.showQuestions = !controller.questionsAtTheEnd;
        controller.answeredindex = -1;
        controller.answered = false;
        controller.showSummary = false;
        controller.videos = [];
        controller.relatedplaylists = [];
        controller.levelNames = levelNames.names;

        $window.onYouTubePlayerAPIReady = function() {
            youtubeApiIsReady = true;
            $timeout(loadPlayer);
        }

        $http.get('/api/playlist/' + playlistId).success(function( data ) {
            controller.playlist = data;
            controller.videos = data.entries;
            controller.currentVideo = controller.videos[idx];
            playlistRetrieved = true;
            $timeout(loadPlayer);
        });

        controller.playNext = function () {
            var eventname;
            var eventvalue = 1;

            if (controller.answered) {
                if (controller.player.getPlayerState() == YT.PlayerState.ENDED) { // ended playing
                    eventname = 'watched_answered';
                } else {
                    eventname = 'skipped_answered';
                    eventvalue = controller.player.getCurrentTime() / controller.player.getDuration();
                }
            } else {
                if (controller.player.getPlayerState() == YT.PlayerState.ENDED) { // ended playing
                    eventname = 'watched_didntanswer';
                } else {
                    eventname = 'skipped_didntanswer';
                    eventvalue = controller.player.getCurrentTime() / controller.player.getDuration();
                }
            }

            $analytics.eventTrack(eventname, { category: 'video', label: controller.videos[idx].id, value: eventvalue });

            idx = idx + 1;
            controller.currentVideo = controller.videos[idx];
            controller.answeredindex = -1;
            controller.answered = false;

            if (idx == controller.videos.length) {
                controller.player.stopVideo();
                controller.points = controller.videos.length * controller.POINT_PER_VIDEO;
                controller.points += controller.correctAnswers * controller.POINT_PER_CORRECT;

                playlists.getRelated(playlistId, function (related) {
                    controller.relatedplaylists = related;
                });

                controller.showSummary = true;

                user.answerPlaylist(playlistId, controller.points);
            } else {
                var video_id = controller.videos[idx].id;
                controller.player.loadVideoById({videoId:video_id});
            }
        };

        controller.answer = function() {
            controller.answered = true;

            if (controller.answeredindex == controller.currentVideo.correctanswer)
            {
                controller.correctAnswers += 1;
            } else {
                controller.incorrectAnswers += 1;
            }

            /*if (controller.questionsAtTheEnd) {
                setTimeout(function() {
                    controller.playNext();
                }, 2000);
            }*/
        }

        controller.playPlaylist = function(id) {
            $analytics.eventTrack('relatedClicked', {
                category: 'navigation', label: id
            });
            $location.path('/play/' + id);
        }

        var loadPlayer = function() {
            if(!playlistRetrieved || !youtubeApiIsReady) {
                return;
            }
            controller.player = new YT.Player('ytplayer', {
                videoId: controller.videos[idx].id,
                playerVars: {
                    'autoplay': 1,
                    'controls': 1,
                    'iv_load_policy': 3,
                    'enablejsapi': 1,
                    'origin': 'http://babelboo.com',
                    'rel': 0
                },
                events: {
                    'onStateChange': 'onPlayerStateChange'
                }
            });
        }


        /*onPlayerStateChange = function(event) {
            if (event.data == YT.PlayerState.ENDED) {
                if (controller.questionsAtTheEnd) {
                    controller.showQuestions = true;
                } else {
                    controller.playNext();
                }

                $scope.$apply();
            }
        }*/
    });

    app.directive('playerCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/play/player-card.html'
        }
    });

    app.directive('summaryCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/play/summary-card.html'
        }
    });

    app.directive('relatedplaylistCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/play/relatedplaylist-card.html'
        };
    });
})();

var onPlayerStateChange;
var youtubeApiIsReady = false;
var onYouTubePlayerAPIReady = function () {
    youtubeApiIsReady = true;
}