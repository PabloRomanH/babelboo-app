
var google = require('googleapis');
var console = require('console');

var youtube = google.youtube('v3');

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

if (process.argv.length < 3) {
	console.log('Missing parameter. Specify YouTube user name.');
	return;
}

var userName = process.argv[2];

function getVideoIds(err, resp) {
	if(err) {
		console.log(err);
		return;
	}
	var nitems = resp.items.length;
	var videos = [];
	for(var i = 0; i < nitems; i++) {
		var video = {
			title: resp.items[i].snippet.title,
			id: resp.items[i].snippet.resourceId.videoId
		};
		videos.push(video);
		console.log(video.id);
	}

	if(resp.nextPageToken) {
		youtube.playlistItems.list({part:'snippet, id', maxResults:'50', playlistId:playlistId,
			pageToken: resp.nextPageToken, key:API_KEY}, getVideoIds);
	} else {
 		//console.log(JSON.stringify(videos,null,'    '));
 	}
}

var err1;

function getPlaylistId2(err2, resp) {
	if(err2) {
		console.log(err1)
		console.log(err2);
		return;
	}
	if (resp.items.length > 0) {
		playlistId = resp.items[0].contentDetails.relatedPlaylists.uploads;
		youtube.playlistItems.list({part:'snippet, id', maxResults:'50', playlistId:playlistId, key:API_KEY}, getVideoIds);
	}
}

function getPlaylistId(err, resp) {
	err1 = err;
	if (resp.items.length > 0) {
		playlistId = resp.items[0].contentDetails.relatedPlaylists.uploads;
		youtube.playlistItems.list({part:'snippet, id', maxResults:'50', playlistId:playlistId, key:API_KEY}, getVideoIds);
	} else {
		youtube.channels.list({part:'contentDetails', maxResults:'50', id:userName, key:API_KEY}, getPlaylistId2);
	}	
}

youtube.channels.list({part:'contentDetails', maxResults:'50', forUsername:userName, key:API_KEY}, getPlaylistId);
		


