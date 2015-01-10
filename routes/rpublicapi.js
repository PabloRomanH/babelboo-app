
var express = require('express');

var router = express.Router();

router.post('/betaregistration', function(req, res) {
    var collection = req.db.get('betaregistration');

    collection.insert(req.body,
        function (err, doc) {
            if (err) throw err;
        });


    res.status(201); // CREATED
    res.json();
});


router.get('/playlist/:playlist_id', function(req, res) {
    var collection = req.db.get('playlists');

    try {
        collection.find({_id: req.params.playlist_id},{},function (err, result) {
            res.json( result[0] );
        });
    } catch (err2) {
        res.json();
    }
});


module.exports = router;
