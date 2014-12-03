var onPlayerStateChange;

(function() {
    var app = angular.module('player', []);
    
    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    
    app.controller('PlayController', function($scope, $http, $location, $routeParams) {
        var player;
        var controller = this;
        var idx = 0;
        var loaded = false;
        
        var playlistId = $routeParams.playlistId;
        controller.correctAnswers = 0;
        controller.incorrectAnswers = 0;
        
        controller.questionsAtTheEnd = false;
        controller.showQuestions = !controller.questionsAtTheEnd;
        controller.answeredindex = -1;
        controller.answered = false;
        controller.showSummary = false;
        controller.videos = [];
        
        $http.get('/api/playlist/' + playlistId).success(function( data ) {
            controller.playlist = data;
            controller.videos = data.entries;
            controller.currentVideo = controller.videos[idx];
            loadPlayer();
        });
        
        loadAnalytics();
        
        controller.playNext = function () {
            idx = idx + 1;
            controller.currentVideo = controller.videos[idx];
            controller.answeredindex = -1;
            controller.answered = false;
        
            if (idx == controller.videos.length) {
                player.stopVideo();
                controller.showSummary = true;
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
            
            if (controller.questionsAtTheEnd) {
                setTimeout(function() {
                    controller.playNext();
                }, 2000);
            }
        }

        var loadPlayer = function() {
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

        onPlayerStateChange = function(event) {
            if (event.data == YT.PlayerState.ENDED) {
                _gaq.push(['_trackEvent', 'video', 'finished', controller.videos[idx].id]);
                if (controller.questionsAtTheEnd) {
                    controller.showQuestions = true;
                } else {
                    controller.playNext();
                }
                
                $scope.$apply();
            }
        }
        
    });
})();
