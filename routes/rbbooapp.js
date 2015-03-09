var express = require('express');
var path = require('path');

var router = express.Router();

/* GET home page. */
router.get('*', function(req, res) {
    var types = ['website', 'video.other'];

    var variables = {
        title: 'Have fun, learn English',
        description: 'Aprende inglés viendo los vídeos que mas te gustan.',
        image: 'http://www.babelboo.com/img/boo-blue.png',
        type: types[0]
    };

    if(req.url == '/tv') {
        variables.title = 'Boo TV';
        variables.description = 'Aprende inglés sin preocupaciones';
        variables.image = 'http://www.babelboo.com/img/bootv.png';

        res.render('bbooapp', variables);
    } else if(/\/play\/.*/.test(req.url)) {
        var playlists = req.db.get('playlists');
        var playlistId = req.url.match(/\/play\/(.*)/)[1];

        playlists.find({ _id: playlistId }, function(err, result) {
            console.log(result);
            if(result.length > 0) {
                variables.title = result[0].title;
                variables.description = 'Aprende inglés viendo estos vídeos y respondiendo a las preguntas.';
                variables.image = result[0].entries[0].thumbnail;
            }

            res.render('bbooapp', variables);
        });
    } else {
        res.render('bbooapp', variables);
    }
});


module.exports = router;
