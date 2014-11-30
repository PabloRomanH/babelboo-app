
var _gaq = _gaq || [];
var onYouTubeIframeAPIReady;
var onPlayerStateChange;

(function() {
    var app = angular.module('player', []);
    
    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    
    app.controller('PlayController', function($scope, $http, $location) {
        var player;
        var controller = this;
        var idx = 0;
        
        playlistId = $location.search().id;
        controller.correctAnswers = 0;
        controller.incorrectAnswers = 0;
        
        controller.questionsAtTheEnd = false;
        controller.showQuestions = !controller.questionsAtTheEnd;
        controller.answeredindex = -1;
        controller.answered = false;
        controller.showSummary = false;
        
        $http.get('api/playlist/' + playlistId).success(function( data ) {
            controller.playlist = data;
            controller.videos = data.entries;
            controller.currentVideo = controller.videos[idx];
    
            loadVideo();
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
            $scope.$apply();
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

        
        onYouTubeIframeAPIReady = function() {
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
                    $scope.$apply();
                } else {
                    controller.playNext();
                }
            }
        }
        
    });
})();

function loadVideo() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function loadAnalytics() {
    _gaq.push(['_setAccount', 'UA-56348024-1'],
            ['_trackPageview']);
    (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}


