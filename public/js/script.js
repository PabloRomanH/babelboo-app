var player;
var _gaq = _gaq || [];
var current_video_idx = 0; 

var playlist;

$(function() {
    $.get( 'api/playlist/' + playlistId, function( data ) {
        playlist = data;
        
        loadVideo();
        
        $('#btn_next').click(function() {
        //     _gaq.push(['_trackEvent', 'video', 'skip - boring', videoIds[current_video_idx]]);
            playNext();
            populateQA();
        });
        
        populateQA();
    }, "json" );

    loadAnalytics();
});

function populateQA() {
    $('#question').empty();
    $('#answers').empty();
    
    $('#question').append(playlist.entries[current_video_idx].question);
    var answers = playlist.entries[current_video_idx].answers;
    
    for (var i = 0; i < answers.length; i++) {
        $('#answers').append('<li>' + answers[i] + '</li>');
        
        if (i == playlist.entries[current_video_idx].correctAnswer) {
            $('#answers').children().last().click(
                function() {
                    $(this).addClass('correctAnswer');
                }
            );
        } else {
             $('#answers').children().last().click(
                function() {
                    $(this).addClass('incorrectAnswer');
                }
            );  
        }
    }
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

function loadVideo() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function playNext() {
    current_video_idx = (current_video_idx + 1)%playlist.entries.length;
    video_id = playlist.entries[current_video_idx].id;
    player.loadVideoById({videoId:video_id});
}

function onPlayerStateChange (event) {
    if (event.data == YT.PlayerState.ENDED) {
        _gaq.push(['_trackEvent', 'video', 'finished', playlist.entries[current_video_idx].id]);
        playNext();
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '480',
        width: '640',
        videoId: playlist.entries[current_video_idx].id,
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

