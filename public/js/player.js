var player;
var _gaq = _gaq || [];
var current_video_idx = 0; 

var playlist;

var questionsAtTheEnd = true;
var correctAnswers = 0;
var incorrectAnswers = 0;

$(function() {
    if (!questionsAtTheEnd) {
        $('#qa').show();
    }
        
    $.get( 'api/playlist/' + playlistId, function( data ) {
        playlist = data;
        
        loadVideo();
        
        $('#btn-next').click(function() {
        //     _gaq.push(['_trackEvent', 'video', 'skip - boring', videoIds[current_video_idx]]);
            playNext();
        });

        populateQA();
    }, "json" );

    loadAnalytics();
});

function answerClicked(event) {
    if (event.data == "correct") {
        $(this).addClass('correctAnswer');
        correctAnswers = correctAnswers + 1;
    } else {
        $(this).addClass('incorrectAnswer');
        incorrectAnswers = incorrectAnswers + 1;
    }
    
    if (questionsAtTheEnd) {
        $('#btn-next').attr('disabled','disabled');
        
        setTimeout(function() {
            $('#btn-next').removeAttr('disabled');
            playNext();
        }, 2000);
    }
    
    $('#answers').children().unbind('click');
}

function populateQA() {
    if (!playlist.entries[current_video_idx].question) {
            return;
    }
    
    $('#question').append(playlist.entries[current_video_idx].question);
    var answers = playlist.entries[current_video_idx].answers;
    
    for (var i = 0; i < answers.length; i++) {
        $('#answers').append('<li>' + answers[i].text + '</li>');
        
        if (answers[i].iscorrect) {
            $('#answers').children().last().click('correct', answerClicked);
        } else {
            $('#answers').children().last().click('incorrect', answerClicked);
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
    $('#question').empty();
    $('#answers').empty();
    
    current_video_idx = current_video_idx + 1;
    
    if (current_video_idx == playlist.entries.length) {
        showSummary();        
    } else {
        video_id = playlist.entries[current_video_idx].id;
        player.loadVideoById({videoId:video_id});
        
        if (questionsAtTheEnd)
            $('#qa').hide();
        populateQA();
    }
}

function showSummary() {
    player.stopVideo();
    $('#video').hide();
    $('#summary').show();
    
    $('#number-of-videos').append(playlist.entries.length);
    $('#number-correct').append(correctAnswers);
    $('#number-incorrect').append(incorrectAnswers);
}

function onPlayerStateChange (event) {
    if (event.data == YT.PlayerState.ENDED) {
        _gaq.push(['_trackEvent', 'video', 'finished', playlist.entries[current_video_idx].id]);
        if (questionsAtTheEnd) {
            $('#qa').show();
        } else {
            playNext();
        }
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

