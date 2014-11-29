var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    var collection = req.db.get('playlists');

    var nplaylists = 4 + req.user.daysvisited * 2;

    collection.find({},{ limit : nplaylists, sort : { _id : 1 } },
        function (err, result) {
            res.render('playlists', { playlists: result });
        });
});


module.exports = router;