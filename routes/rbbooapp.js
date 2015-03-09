var express = require('express');
var path = require('path');

var router = express.Router();

/* GET home page. */
router.get('*', function(req, res) {
    var variables = {
        title: 'Have fun, learn English',
        description: 'Aprende inglés viendo los vídeos que mas te gustan.',
        image: 'http://www.babelboo.com/img/boo-blue.png',
        type: 'website'
    };

    if(req.url == '/tv') {
        variables.title = 'Boo TV';
        variables.description = 'Aprende inglés sin preocupaciones.';
        variables.image = 'http://www.babelboo.com/img/bootv.png';

        res.render('bbooapp', variables);
    } else if(/\/play\/.*/.test(req.url)) {
        var playlists = req.db.get('playlists');
        var slug = req.url.match(/\/play\/(.*)/)[1];

        playlists.find({ slug: slug }, function(err, result) {
            if(result.length > 0) {
                variables.title = result[0].title;
                variables.description = 'Me ha gustado este playlist en Babelboo.';
                variables.image = result[0].entries[0].thumbnail;
                variables.type = 'video.other';
            }

            res.render('bbooapp', variables);
        });
    } else {
        res.render('bbooapp', variables);
    }
});


module.exports = router;
