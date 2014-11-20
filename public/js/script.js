var player;
var _gaq = _gaq || [];
var current_video_idx = 0; 

var videoIds = [];

$(function() {
    $.get( 'api/playlist/' + playlistId, function( data ) {
        for (var i = 0; i < data.entries.length; i++) {
            videoIds.push(data.entries[i].id);
        }
        
        loadVideo();
        
        $('#btn_hard').click(function() {
            _gaq.push(['_trackEvent', 'video', 'skip - hard', videoIds[current_video_idx]]);
            playNext();
        });
    
        $('#btn_boring').click(function() {
            _gaq.push(['_trackEvent', 'video', 'skip - boring', videoIds[current_video_idx]]);
            playNext();
        });
    }, "json" );

    loadAnalytics();
});

function loadAnalytics() {
    _gaq.push(['_setAccount', 'UA-56348024-1'],
            ['_trackPageview']);
    (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}

function loadVideo() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function playNext() {
    current_video_idx = (current_video_idx + 1)%videoIds.length;
    video_id = videoIds[current_video_idx];
    player.loadVideoById({videoId:video_id});
}

function onPlayerStateChange (event) {
    if (event.data == YT.PlayerState.ENDED) {
        _gaq.push(['_trackEvent', 'video', 'finished', videoIds[current_video_idx]]);
        playNext();
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '480',
        width: '640',
        videoId: videoIds[current_video_idx],
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

