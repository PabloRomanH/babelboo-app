
var express = require('express');

var router = express.Router();

router.post('/', function(req, res) {

    res.status(201);
    res.json();
});

module.exports = router;
