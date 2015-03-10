var express = require('express');
var passport = require('passport');
var path = require('path');

var router = express.Router();

router.post('/',
    passport.authenticate('local'), function(req, res) {
        res.status(200).end();
    });

app.get('/facebook', passport.authenticate('facebook'));

app.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' }));

module.exports = router;
