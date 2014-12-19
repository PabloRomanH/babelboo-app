var express = require('express');
var passport = require('passport');
var path = require('path');

var router = express.Router();

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/login/login.html'));
});

router.post('/',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
    );

router.get('/alpha',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
);

module.exports = router;