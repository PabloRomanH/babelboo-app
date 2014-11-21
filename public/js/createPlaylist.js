var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';
  
var items = [];
  
$(function() {
    $('#btn-search').click(search);
    $('#btn-submit').click(submit);
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
    
    var videoIds = "";
    $('.playlist-item').each(function (element) {
        videoIds = videoIds + $(this).attr('data-video-id') + ',';
    });
    
    if (videoIds === "") {
        event.preventDefault();
        $('.alert').empty();
        $('.alert').append('Cannot create a playlist without videos.');
        $('.alert').show();
        return;
    }
    
    $('#hidden-videoids').val(videoIds);
}

function search() {
    var query = $( "input[name='query']" ).val();
    
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
            $('#result').append(
                '<div class="row searchresult" data-search-idx="' + i + '">' +
                    '<div class="col-xs-6 col-sm-2">' +
                        '<img src=' + snippet.thumbnails.default.url + ' class="img-responsive">' +
                    '</div>' +
                    '<div class="col-xs-6 col-sm-10">' +
                        snippet.title +
                    '</div>' +
                '</div>');
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
    
    $('#playlist-videos').append(
        '<div class="row playlist-item" data-video-id="' + videoId + '">' +
            '<div class="col-xs-6 col-sm-2">' +
                '<img src=' + video.snippet.thumbnails.default.url + ' class="img-responsive">' +
            '</div>' +
            '<div class="col-xs-6 col-sm-10">' +
                video.snippet.title + '<a class="btn btn-danger btn-remove" data-video-id="' + videoId + '">Remove</a></div>' +
            '</div>' +
        '</div>');
    
    $('.btn-remove').click(onRemoveClick);
}

function onRemoveClick(event) {
    var video_id = $(event.target).attr('data-video-id');
    $('.playlist-item[data-video-id='+video_id+']').remove();
}