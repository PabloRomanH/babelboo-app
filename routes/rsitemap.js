var express = require('express');

var router = express.Router();

router.get('/sitemap.xml', function(req, res) {
    var playlistsCollection = req.db.get('playlists');
    var xml = '';

    playlistsCollection.find({}, function (err, result) {
        xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        writeUrl('http://www.babelboo.com/', 1);
        writeUrl('http://www.babelboo.com/register', 0.8);
        writeUrl('http://www.babelboo.com/tv');
        writeUrl('http://www.babelboo.com/recover', 0.3);
        for (var i in result) {
            writeUrl('http://www.babelboo.com/play/' + result[i].slug);
        }

        xml += '</urlset>\n';
        res.set('Content-Type', 'text/xml');
        res.send(xml);
    });

    function writeUrl(url, priority) {
        xml += '<url>\n';
        xml += '\t<loc>'+ url + '</loc>\n';
        if (typeof priority !== 'undefined') {
            xml += '\t<priority>'+ priority + '</priority>\n';
        }
        xml += '</url>\n';
    }
});

module.exports = router;
