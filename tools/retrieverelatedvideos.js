
var google = require('googleapis');
var console = require('console');

youtube = google.youtube('v3');

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

if (process.argv.length < 3) {
	console.log('Missing parameter. Specify video id.');
	return;
}

videoId = process.argv[2];

youtube.search.list({part:'snippet, id', maxResults:'50', relatedToVideoId:videoId, type:'video', key:API_KEY},
		function (err, resp) {
			if(err) {
				console.log(err);
				return;
			}
			var nitems = resp.items.length;
			var videos = [];
			for(var i = 0; i < nitems; i++) {
				var video = {
					title: resp.items[i].snippet.title,
					id: resp.items[i].id.videoId
				};
				videos.push(video);
				console.log(video.id);
			}
//			console.log(JSON.stringify(videos,null,'    '));
		});


