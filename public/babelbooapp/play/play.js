(function() {
    var app = angular.module('player', ['youtube-embed']);

    app.controller('PlayController', function($scope, $http, $routeParams, $location, $analytics, user, playlists, levelNames) {
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
        controller.answeredcorrect = false;
        controller.answeredincorrect = false;
        controller.answeredindex = -1;
        controller.answered = false;
        controller.showSummary = false;
        controller.videos = [];
        controller.relatedplaylists = [];
        controller.levelNames = levelNames.names;

        controller.videoId = null;
        controller.playerVars = { autoplay: 1 };
        controller.player = null;

        $http.get('/api/playlist/' + playlistId).success(function( data ) {
            controller.playlist = data;
            controller.videos = data.entries;
            controller.currentVideo = controller.videos[idx];
            playlistRetrieved = true;

            controller.videoId = controller.videos[idx].id;
        });

        controller.playNext = function () {
            var eventname;
            var eventvalue = 1;

            if (controller.answered) {
                if (controller.player.currentState == "ended") { // ended playing
                    eventname = 'watched_answered';
                } else {
                    eventname = 'skipped_answered';
                    eventvalue = controller.player.getCurrentTime() / controller.player.getDuration();
                }
            } else {
                if (controller.player.currentState == "ended") { // ended playing
                    eventname = 'watched_didntanswer';
                } else {
                    eventname = 'skipped_didntanswer';
                    eventvalue = controller.player.getCurrentTime() / controller.player.getDuration();
                }
            }

            $analytics.eventTrack(eventname, { category: 'video', label: controller.videos[idx].id, value: eventvalue });

            idx = idx + 1;
            controller.currentVideo = controller.videos[idx];
            controller.answeredcorrect = false;
            controller.answeredincorrect = false;
            controller.answered = false;
            controller.answeredindex = -1;

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
                controller.answeredcorrect = true;
                controller.correctAnswers += 1;
            } else {
                controller.incorrectAnswers += 1;
                controller.answeredincorrect = true;
            }
        }

        controller.throwRelatedEvent = function(id) {
            $analytics.eventTrack('relatedClicked', {
                category: 'navigation', label: id
            });
        }

        /*$scope.$on('youtube.player.ended', function ($event, player) {
            if (event.data == YT.PlayerState.ENDED) { // FIXME: not adapted to angular-youtube-embed
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
