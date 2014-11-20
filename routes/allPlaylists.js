var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res){
    if (!req.user) res.redirect('/login');
    
    var collection = req.db.get('playlists');
    collection.find({},{},function (err, result) {
        res.render('allPlaylists', { message: req.flash('playlistCreated'), playlists: result });
    });
});


module.exports = router;