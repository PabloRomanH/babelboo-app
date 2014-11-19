var express = require('express');
var passport = require('passport');

var router = express.Router();

var youtube = require('googleapis').youtube('v3');

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

/* GET home page. */
router.get('/', function(req, res) {
    if (req.user) {
        res.render('loggedin', { title: 'Express', username: req.user.username});
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/login', function(req, res){
    res.render('login', { user: req.user, message: req.flash('error') });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
    );

router.get('/createPlaylist', function(req, res){
    if (!req.user) res.redirect('/login');

    res.render('createPlaylist', { message: req.flash('error') });
});

router.post('/createPlaylist', function(req, res){
    if (!req.user) return;

    var collection = req.db.get('playlists');

    var playlistTitle = req.body.title;
    var videoIds = req.body.idlist.replace(/\n/g,',');
    youtube.videos.list({part:'snippet,id,contentDetails', id:videoIds, key:API_KEY},
        function createPlaylist(err, resp) {
            videos = [];
            for (var i = 0; i < resp.items.length; i++) {
                var id = resp.items[i].id;
                var duration = resp.items[i].contentDetails.duration;
                var title = resp.items[i].snippet.title;
                var thumbnail = resp.items[i].snippet.thumbnails.medium.url; // default/medium/high
                videos.push({ source: "youtube", id: id, duration: duration, title: title, thumbnail: thumbnail });
            }

            collection.insert({title: playlistTitle, entries:videos}, function (err, doc) {
                if (err) throw err;
            });
        });

    req.flash('playlistCreated', 'New playlist created. Wait while it\'s added.');
    res.redirect('/allPlaylists');
});

router.get('/allPlaylists', function(req, res){
    if (!req.user) res.redirect('/login');
    
    var collection = req.db.get('playlists');
    collection.find({},{},function (err, result) {
        res.render('allPlaylists', { message: req.flash('playlistCreated'), playlists: result });
    });
});


module.exports = router;
