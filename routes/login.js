var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res){
    res.render('login', { user: req.user, message: req.flash('error') });
});

router.post('/',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
    );
    
module.exports = router;