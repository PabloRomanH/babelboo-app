var express = require('express');
var passport = require('passport');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    if (req.user) {
        res.render('loggedin', { title: 'Express', username: req.user.username});
    } else {
        res.redirect('/login');
    }
});


module.exports = router;
