var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

var items = [];

$(function() {
    if (playlistId) {
        $.get( 'api/playlist/' + playlistId, function( data ) {
            var entries = data.entries;

            $('input[name=title]').val(data.title);
            $('input[name=tags]').val(data.tags);

            for (var i = 0; i < entries.length; i++) {
                addPlaylistItem(entries[i].id, entries[i].title, entries[i].thumbnail);
            }
        }, "json" );
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
    if ($('input[name=title]').val() === "") {
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

    var videoIds = "";
    playlistItems.each(function (element) {
        videoIds = videoIds + $(this).attr('data-video-id') + ',';
    });

    var tags = $('input[name=tags]').val().replace(/\s+/g,',');
    $('input[name=tags]').val(tags);


    if (playlistId) {
        $('#hidden-playlistid').val(playlistId);
    }

    $('#hidden-videoids').val(videoIds);
}

function search() {
    var query = $('#input-search').val();

    var request = gapi.client.youtube.search.list({
        q: query,
        part: 'id,snippet',
        type: 'video'
    });

    request.execute(function(response) {
        items = response.result.items;

        $('#result').empty();
        for (var i = 0; i < items.length; i++) {
            var snippet = items[i].snippet;
            var clonedDiv = $('#searchresult-template').clone();
            clonedDiv.attr('data-search-idx', i);
            clonedDiv.find('#resultimg').attr('src', snippet.thumbnails.default.url);
            clonedDiv.find('#resultname').append(snippet.title);
            console.log(clonedDiv.children('#resultimg'));
            clonedDiv.show();

            $('#result').append(clonedDiv);
        }
        $('.searchresult').click(onResultClick);
    });
}

function onResultClick(event) {
    var video = items[$(event.currentTarget).attr('data-search-idx')];
    var videoId = video.id.videoId;
    if($('.playlist-item[data-video-id='+videoId+']').length > 0) {
        return;
    }

    addPlaylistItem(videoId, video.snippet.title, video.snippet.thumbnails.default.url);
}

function addPlaylistItem(videoId, title, thumbnailUrl) {
    var clonedDiv = $('#playlist-item-template').clone();
    clonedDiv.attr('data-video-id', videoId);
    clonedDiv.find('#itemimg').attr('src', thumbnailUrl);
    clonedDiv.find('#itemtitle').prepend(title);
    clonedDiv.find('#itembutton').attr('data-video-id', videoId).click(onRemoveClick);

    console.log(clonedDiv.children('#resultimg'));
    clonedDiv.show();
    $('#playlist-videos').append(clonedDiv);
}

function onRemoveClick(event) {
    var video_id = $(event.target).attr('data-video-id');
    $('.playlist-item[data-video-id='+video_id+']').remove();
}