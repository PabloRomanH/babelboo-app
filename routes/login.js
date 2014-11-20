var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/', function(req, res){
    res.render('login', { user: req.user, message: req.flash('error') });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
    );
    
module.exports = router;