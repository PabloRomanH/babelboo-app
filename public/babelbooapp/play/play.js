(function() {
    var app = angular.module('player', ['youtube-embed']);

    app.controller('PlayController', function($analytics, $rootScope, $scope,
                                              $location, renderTime, levelNames,
                                              userData, playlistData) {
        var controller = this;
        controller.userLogged = false;
        controller.correctAnswers = 0;
        controller.ready = false;
        controller.elapsed = 0;
        controller.ratio = 0;
        controller.show = 'player';
        controller.videos = [];
        controller.relatedplaylists = [];
        controller.levelNames = levelNames.names;
        controller.renderTime = function (time) {
            return renderTime(Math.max(0, time));
        };
        controller.idx = 0;
        controller.playerVars = { autoplay: 1, controls: 0, rel: 0, cc_load_policy: 0 };
        controller.player = null;

        controller.correct = {};

        controller.playlist = playlistData;
        controller.videos = playlistData.entries;
        playlistId = playlistData._id;
        resetVideo();

        if (userData) {
            if (userData.playlistprogress && userData.playlistprogress[playlistId]) {
                angular.copy(userData.playlistprogress[playlistId].correct, controller.correct);
            }

            for (var key in controller.correct) {
                controller.correctAnswers++;
            }

            controller.userLogged = true;
        }

        function resetVideo () {
            if (controller.idx >= controller.videos.length) {
                return;
            }

            controller.answeredcorrect = false;
            controller.answered = false;
            controller.answeredindex = -1;
            controller.elapsed = 0;
            controller.playerVars.start = controller.videos[controller.idx].starttime;
            controller.playerVars.end = controller.videos[controller.idx].endtime;
        }

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

        controller.getPlayerHeight = function(){
            return document.getElementById('player-container').offsetWidth * 9/16;
        }

        controller.playNext = function () {
            playNextAnalytics();

            controller.ready = false;
            clearInterval(controller.elapsedInterval);
            controller.idx = controller.idx + 1;

            resetVideo();

            if (controller.idx == controller.videos.length) {
                playlists.getRelated(playlistId).success(function (related) {
                    controller.relatedplaylists = related;
                });

                controller.ratio = controller.correctAnswers / controller.videos.length;
                controller.show = 'summary';
                $rootScope.$emit('ranking.refresh');
                controller.player.stopVideo();

                user.finished(playlistId);

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

        controller.seek = function(event) {
            var ratio = event.offsetX / event.toElement.parentElement.clientWidth;
            var start = controller.videos[controller.idx].starttime? controller.videos[controller.idx].starttime : 0;
            var end = controller.videos[controller.idx].endtime? controller.videos[controller.idx].endtime: controller.player.getDuration();
            controller.player.seekTo( start + (end - start) * ratio);
        }

        controller.showRelated = function() {
            controller.show = 'related';
        }

        $scope.$on('youtube.player.ready', function ($event, player) {
            controller.ready = true;
            controller.player.unMute();
            controller.player.setVolume(100);

            controller.elapsedInterval = setInterval(function(){
                $scope.$apply( function() {
                    if (controller.player) {
                        var start = controller.videos[controller.idx].starttime? controller.videos[controller.idx].starttime : 0;
                        controller.elapsed = Math.max(0, controller.player.getCurrentTime()-start);
                    }
                });
            }, 500); //polling frequency in miliseconds

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

    app.directive('relatedCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/play/related-card.html'
        };
    });

    app.directive('relatedplaylistCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/play/relatedplaylist-card.html'
        };
    });
})();
