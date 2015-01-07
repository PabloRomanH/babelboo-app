(function() {
    var app = angular.module('player', ['youtube-embed']);

    app.controller('PlayController', function($routeParams, $analytics, $scope, user, playlists, renderTime, levelNames) {
        var controller = this;
        var playlistId = $routeParams.playlistId;
        var playlistRetrieved = false;

        controller.correctAnswers = 0;
        controller.ready = false;

        user.fillUser(function (userData) {
            controller.correct = {};

            if (userData.playlistprogress && userData.playlistprogress[playlistId]) {
                angular.copy(userData.playlistprogress[playlistId].correct, controller.correct);
            }

            for (var key in controller.correct) {
                controller.correctAnswers++;
            }
        });

        controller.ratio = 0;

        controller.showSummary = false;
        controller.videos = [];
        controller.relatedplaylists = [];

        controller.levelNames = levelNames.names;
        controller.renderTime = renderTime;

        controller.idx = 0;
        controller.playerVars = { autoplay: 1 };
        controller.player = null;

        function resetVideo () {
            controller.answeredcorrect = false;
            controller.answered = false;
            controller.answeredindex = -1;
        }

        playlists.getById(playlistId).success(function(data) {
            controller.playlist = data;
            controller.videos = data.entries;
            resetVideo();
            playlistRetrieved = true;
        });

        function playNextAnalytics () {
            var eventname;
            var eventvalue = 1;

            if (controller.answered) {
                if (controller.player.currentState == "ended") { // ended playing
                    eventname = 'watched_answered';
                } else {
                    eventname = 'skipped_answered';
                    eventvalue = controller.player.getCurrentTime() / controller.player.getDuration() * 100;
                }
            } else {
                if (controller.player.currentState == "ended") { // ended playing
                    eventname = 'watched_didntanswer';
                } else {
                    eventname = 'skipped_didntanswer';
                    eventvalue = controller.player.getCurrentTime() / controller.player.getDuration() * 100;
                }
            }

            $analytics.eventTrack(eventname, { category: 'video', label: controller.videos[controller.idx].id, value: eventvalue });
        }

        controller.playNext = function () {
            playNextAnalytics();

            controller.ready = false;

            controller.idx = controller.idx + 1;

            resetVideo();

            if (controller.idx == controller.videos.length) {
                playlists.getRelated(playlistId).success(function (related) {
                    controller.relatedplaylists = related;
                });

                controller.ratio = controller.correctAnswers / controller.videos.length;
                controller.showSummary = true;
                controller.player.stopVideo();

                $analytics.eventTrack('finished_playlist', { category: 'video', label: playlistId });
            }
        };

        controller.answer = function() {
            controller.answered = true;

            if (controller.answeredindex == controller.videos[controller.idx].correctanswer) {
                controller.correctAnswers += 1;
                controller.answeredcorrect = true;

                var ratio = controller.correctAnswers / controller.videos.length;

                user.correctAnswer(playlistId, controller.videos[controller.idx].id, ratio);
            }
        }

        controller.throwRelatedEvent = function(id) {
            $analytics.eventTrack('relatedClicked', {
                category: 'navigation', label: id
            });
        }

        $scope.$on('youtube.player.ready', function ($event, player) {
            controller.ready = true;
        });
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
