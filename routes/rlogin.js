var express = require('express');
var passport = require('passport');
var path = require('path');

var router = express.Router();

router.post('/',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
    );

module.exports = router;