var async = require('async');
var google = require('googleapis');
var mailer = require('nodemailer');

var youtube = google.youtube('v3');

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

var message = [];

function processPlaylist(element, done) {
	var entries = element.entries;

	async.each(entries, processVideos, videosDone);

	function videosDone(err) {
		done();
	}
}

function processVideos(element, done) {
	youtube.videos.list({part:'id', id: element.id, key:API_KEY}, processYoutube.bind(null, element, done));
}

function processYoutube(data, done, err, resp) {
	if(err !== null) {
		message.push('Error requesting video list from Youtube:')
		message.push(err);
	}
	if(resp.items.length == 0) {
		message.push('This video has been deleted from Youtube:');
		message.push(JSON.stringify(data, ' ', 4));
	}
	done();
}

function process(db, allDone) {
	var playlists = db.get('playlists');
	message = [];

	playlists.find({}, function (err, result) {
		async.each(result, processPlaylist, emailMessage);
	});

	function emailMessage() {
		var transporterOptions = {
			service: 'Gmail',
			auth: {
				user: 'babelboodotcom@gmail.com',
				pass: 'kyqgfawqokbemjdz'
			}
		};

		var transporter = mailer.createTransport(transporterOptions);

		var mailOptions = {
			from: 'Babelboo <contact@babelboo.com>',
			to: 'Babelboo <contact@babelboo.com>',
			subject: '[mayhem] Missing video report',
			text: message.join('\n')
		};
		console.log('sending email with text:');
		console.log(message.join('\n'));

		transporter.sendMail(mailOptions);

		if (typeof allDone == 'function') {
			allDone();
		}
	}
}

module.exports = { process: process };
