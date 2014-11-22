$(function() {
    $('.btn-delete').click(removePlaylist);

    // $.delete('api/playlist/' + playlistId, function(data) {
    //     var entries = data.entries;

    //     $('input[name=title]').val(data.title);
    //     $('input[name=tags]').val(data.tags);

    //     for (var i = 0; i < entries.length; i++) {
    //         addPlaylistItem(entries[i].id, entries[i].title, entries[i].thumbnail);
    //     }
    // }, "json");

});

function removePlaylist(event) {
    var playlistId = $(event.target).attr('data-playlist-id');
    $.ajax({url:'api/playlist/' + playlistId, type: 'DELETE'});
    $('.playlist[data-playlist-id=' + playlistId + ']').remove();
}