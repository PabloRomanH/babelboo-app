(function() {
    var app = angular.module('player', ['youtube-embed']);

    app.controller('PlayController', function($routeParams, $analytics, $window, $rootScope, user, playlists, renderTime, levelNames)     {
        var controller = this;
        var playlistId = $routeParams.playlistId;
        var playlistRetrieved = false;
        
        user.fillUser(function (userData) {
            if (userData.playlistAnswered && userData.playlistAnswered[playlistId]) {
                controller.correct = userData.playlistAnswered[playlistId].correct;
            } else {
                controller.correct = {};
            }
        });

        controller.POINT_PER_CORRECT = 100;

        controller.correctAnswers = 0;
        controller.incorrectAnswers = 0;
        controller.points = 0;

        controller.showSummary = false;
        controller.videos = [];
        controller.relatedplaylists = [];

        controller.levelNames = levelNames.names;
        controller.renderTime = renderTime;

        controller.idx = 0;
        controller.videoId = null;
        controller.playerVars = { autoplay: 1 };
        controller.player = null;

        function resetVideo () {
            controller.answeredcorrect = false;
            controller.answeredincorrect = false;
            controller.answered = false;
            controller.answeredindex = -1;
        }

        playlists.getById(playlistId).success(function(data) {
            controller.playlist = data;
            controller.videos = data.entries;
            resetVideo();
            playlistRetrieved = true;

            controller.videoId = controller.videos[controller.idx].id;
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

            controller.idx = controller.idx + 1;

            resetVideo();

            if (controller.idx == controller.videos.length) {
                controller.player.stopVideo();
                controller.points = controller.correctAnswers * controller.POINT_PER_CORRECT;

                playlists.getRelated(playlistId).success(function (related) {
                    controller.relatedplaylists = related;
                });

                controller.showSummary = true;

                allowExit();

                user.playlistPoints(playlistId, controller.points);

                $analytics.eventTrack('finished_playlist', { category: 'video', label: playlistId });
            } else {
                var video_id = controller.videos[controller.idx].id;
                controller.player.loadVideoById({videoId:video_id});
            }
        };

        controller.answer = function() {
            controller.answered = true;

            if (controller.answeredindex == controller.videos[controller.idx].correctanswer) {
                controller.correctAnswers += 1;
                controller.answeredcorrect = true;
                user.correctAnswer(playlistId, controller.videos[controller.idx].id);
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

        var deregister;

        preventExit();

        function preventExit () {
            $window.onbeforeunload = function(){
                return "Are you sure you want to lose your progress in the current playlist?";
            };

            deregister = $rootScope.$on('$locationChangeStart', function(event) {
                var answer = confirm("Are you sure you want to lose your progress in the current playlist?");
                if (!answer) {
                    event.preventDefault();
                } else {
                    allowExit();
                }
            });
        }

        function allowExit () {
            window.onbeforeunload = function () {};
            deregister();
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
