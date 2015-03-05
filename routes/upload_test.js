
var express = require('express');
var multiparty = require('multiparty');

var router = express.Router();

router.post('/', function(req, res) {
    var form = new multiparty.Form();

    form.on('file', function(name, file) {
        console.log('received file of size ' + file.size);
        console.log('saved in ' + file.path);
    });

    form.on('close', function() {
        console.log('Upload completed!');
        res.status(200);
        res.json();
    });

    form.parse(req);
});

module.exports = router;
