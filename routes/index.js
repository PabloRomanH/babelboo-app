var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('loggedin', { title: 'English Videos', username: req.user.username});
});


module.exports = router;
