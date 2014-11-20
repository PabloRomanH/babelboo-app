var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;