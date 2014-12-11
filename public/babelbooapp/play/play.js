(function() {
    var app = angular.module('player', []);

    app.controller('PlayController', function($scope, $http, $routeParams, $location, $analytics, user, playlists) {
        var player;
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
        
        $http.get('/api/playlist/' + playlistId).success(function( data ) {
            controller.playlist = data;
            controller.videos = data.entries;
            controller.currentVideo = controller.videos[idx];
            playlistRetrieved = true;
            loadPlayer();
        });
        
        controller.playNext = function () {
            if (controller.answered) {
                if (player.getPlayerState() == YT.PlayerState.ENDED) { // ended playing
                    $analytics.eventTrack('watched_answered', {
                        category: 'video', label: controller.videos[idx].id
                    });
                } else {
                    $analytics.eventTrack('skipped_answered', {
                        category: 'video', label: controller.videos[idx].id, value: player.getCurrentTime() / player.getDuration()
                    });
                }
            } else {
                if (player.getPlayerState() == YT.PlayerState.ENDED) { // ended playing
                    $analytics.eventTrack('watched_didntanswer', {
                        category: 'video', label: controller.videos[idx].id
                    });
                } else {
                    $analytics.eventTrack('skipped_didntanswer', {
                        category: 'video', label: controller.videos[idx].id, value: player.getCurrentTime() / player.getDuration()
                    });
                }
            }

            idx = idx + 1;
            controller.currentVideo = controller.videos[idx];
            controller.answeredindex = -1;
            controller.answered = false;
        
            if (idx == controller.videos.length) {
                player.stopVideo();
                controller.points = controller.videos.length * controller.POINT_PER_VIDEO;
                controller.points += controller.correctAnswers * controller.POINT_PER_CORRECT;
                
                playlists.getRelated(playlistId, function (related) {
                    controller.relatedplaylists = related;
                });
                
                controller.showSummary = true;
                
                user.answerPlaylist(playlistId, controller.points);
            } else {
                var video_id = controller.videos[idx].id;
                player.loadVideoById({videoId:video_id});
            }
        };
        
        controller.answer = function(index) {
            if (controller.answered)
                return;
            
            controller.answered = true;
            controller.answeredindex = index;
            
            if (index == controller.currentVideo.correctanswer)
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
            player = new YT.Player('ytplayer', {
                height: '480',
                width: '640',
                videoId: controller.videos[idx].id,
                playerVars: {
                    'autoplay': 1,
                    'controls': 1,
                    'iv_load_policy': 3,
                    'enablejsapi': 1,
                    'origin': 'http://englishvideoIds.us.to',
                    'rel': 0
                },
                events: {
                    'onStateChange': 'onPlayerStateChange'
                }
            });
        }

        onYouTubePlayerAPIReady = function() {
            youtubeApiIsReady = true;
            loadPlayer();
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