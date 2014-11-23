var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

var results = {};

$(function() {
    if (playlistId) {
        $.get('api/playlist/' + playlistId, function(data) {
            var entries = data.entries;

            $('input[name=title]').val(data.title);
            $('input[name=tags]').val(data.tags);

            for (var i = 0; i < entries.length; i++) {
                addPlaylistItem(entries[i].id, entries[i].title, entries[i].description, entries[i].thumbnail);
            }
        }, "json");
    }

    $('#btn-search').click(search);
    $('#btn-submit').click(submit);
    $('#input-search').keypress(function( event ) {
        if ( event.which == 13 ) {
            search();
        }
    });
});

function handleClientLoad() {
    gapi.client.setApiKey(API_KEY);
    gapi.client.load('youtube', 'v3');
}

function submit(event) {
    var fail = false;
    var title = $('input[name=title]').val();

    if (title === "") {
        event.preventDefault();
        $('.alert').empty();
        $('.alert').append('Cannot create a playlist without a name.');
        $('.alert').show();
        return;
    }

    var playlistItems = $('#playlist-videos').children();
    if (playlistItems.length == 0) {
        event.preventDefault();
        $('.alert').empty();
        $('.alert').append('Cannot create a playlist without videos.');
        $('.alert').show();
        return;
    }

    //var videoIds = "";
    var videos = [];
    playlistItems.each(function () {
        //videoIds = videoIds + $(this).attr('data-video-id') + ',';

        var questiontext = $(this).find('#questiontext').val();

        if (questiontext) {
            var correctSelected = false;
            var answers = [];
            $(this).find('.answer').each(function () {
                answertext = $(this).find('#answertext').val();
                if(!answertext) {
                    return;
                }

                answercorrect = $(this).find("input[type='radio']").is(':checked');
                if (answercorrect) {
                    correctSelected = true;
                }

                answers.push({
                    text: $(this).find('#answertext').val(),
                    iscorrect: $(this).find("input[type='radio']").is(':checked')
                });

            });

            if (answers.length < 2) {
                $('.alert').empty();
                $('.alert').append('Question needs at least 2 answers: ' + questiontext);
                $('.alert').show();
                fail = true;
                return;
            }

            if (!correctSelected) {
                $('.alert').empty();
                $('.alert').append('Correct answer not chosen in question: ' + questiontext);
                $('.alert').show();
                fail = true;
                return;
            }

            videos.push({
                source: "youtube",
                id: $(this).attr('data-video-id'),
                question: questiontext,
                answers: answers
            });
        } else {
            videos.push({
                source: "youtube",
                id: $(this).attr('data-video-id')
            });
        }


    });

    if (fail) {
        return;
    }

    var tags = $('input[name=tags]').val().split(',').map(
        function(element) {
            return element.trim();
        }).filter(
        function(element) {
            return element != "";
        });
    //$('input[name=tags]').val(tags);


    //if (playlistId) {
    //    $('#hidden-playlistid').val(playlistId);
    //}

    //$('#hidden-videoids').val(videoIds);

    var putobject = {
        title: title,
        tags: tags,
        videos: videos
    }
    var jsonstring = JSON.stringify(putobject);

    if (playlistId) {
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "/api/playlists/" + playlistId,
            data: jsonstring,
            complete: function () { window.location.href = "/playlists"; }
        });
    } else {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/api/playlists",
            data: jsonstring,
            complete: function () { window.location.href = "/playlists"; }
        });
    }
}

function search() {
    var query = $('#input-search').val();

    var request = gapi.client.youtube.search.list({
        q: query,
        part: 'id,snippet',
        type: 'video'
    });

    request.execute(function(response) {
        var items = response.result.items;
        results = {};

        for (var i = 0; i < items.length; i++) {
            results[items[i].id.videoId] = items[i];
        }

        $('#result').empty();
        for (var key in results) {
            var snippet = results[key].snippet;
            var clonedDiv = $('#video-template').clone();
            clonedDiv.attr('data-video-id', key);
            clonedDiv.find('#videoimg').attr('src', snippet.thumbnails.medium.url);
            clonedDiv.find('#title').append(snippet.title);
            clonedDiv.find('#description').append(snippet.description);
            clonedDiv.show();

            $('#result').append(clonedDiv);
            clonedDiv.click(onResultClick);
        }
    });
}

function onResultClick(event) {
    var video = results[$(event.currentTarget).attr('data-video-id')];
    var videoId = video.id.videoId;
    if($('.playlist-item[data-video-id='+videoId+']').length > 0) {
        return;
    }

    addPlaylistItem(videoId, video.snippet.title, video.snippet.description, video.snippet.thumbnails.medium.url);
}

function onRemoveAnswer() {
    $(this).parents('.answer').remove();
}

function addPlaylistItem(videoId, title, description, thumbnailUrl) {
    var videoContainer = $('<div/>', {'data-video-id': videoId, 'class': 'playlist-item'});

    var clonedQa = $('#qa-template').clone();
    clonedQa.find('#itembutton').attr('data-video-id', videoId).click(onRemoveClick);
    clonedQa.find('.addanswer').click(
        function() {
            var answer = $('#qa-template').find('.answer').clone();
            answer.find('.removeanswer').click(onRemoveAnswer);
            $(this).parents('.answers').append(answer);
    });
    clonedQa.find('.removeanswer').click(onRemoveAnswer);
    clonedQa.show();

    var clonedDiv = $('#video-template').clone();
    clonedDiv.attr('data-video-id', videoId);
    clonedDiv.find('#videoimg').attr('src', thumbnailUrl);
    clonedDiv.find('#title').append(title);
    clonedDiv.find('#description').append(description);
    clonedDiv.find('#additional').append(clonedQa);
    clonedDiv.show();
    videoContainer.append(clonedDiv);





    $('#playlist-videos').append(videoContainer);
    // var videoContainer = $('<div/>', {'data-video-id': videoId, 'class': 'playlist-item'});

    // var clonedDiv = $('#video-template').clone();
    // clonedDiv.attr('data-video-id', videoId);
    // clonedDiv.find('#videoimg').attr('src', thumbnailUrl);
    // clonedDiv.find('#title').append(title);
    // clonedDiv.find('#description').append(description);
    // clonedDiv.show();
    // videoContainer.append(clonedDiv);

    // clonedDiv = $('#qa-template').clone();
    // clonedDiv.find('#itembutton').attr('data-video-id', videoId).click(onRemoveClick);
    // clonedDiv.find('.addanswer').click(
    //     function() {
    //         var answer = $('#qa-template').find('.answer').clone();
    //         answer.find('.removeanswer').click(onRemoveAnswer);
    //         $(this).parents('.answers').append(answer);
    // });
    // clonedDiv.find('.removeanswer').click(onRemoveAnswer);
    // clonedDiv.show();
    // videoContainer.append(clonedDiv);


    // $('#playlist-videos').append(videoContainer);
}

function onRemoveClick(event) {
    var video_id = $(event.target).attr('data-video-id');
    $('.playlist-item[data-video-id='+video_id+']').remove();
}