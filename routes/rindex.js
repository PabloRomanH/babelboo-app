var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if (!req.user) {
        req.user = {};
        req.user.username = "anonymous";
    }
    res.render('loggedin', { username: req.user.username});
});


module.exports = router;
