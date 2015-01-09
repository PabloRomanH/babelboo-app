var express = require('express');

var router = express.Router();

router.get('*', function(req, res) {
    res.status(404);
    res.json();
});

module.exports = router;

