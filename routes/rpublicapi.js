
var express = require('express');

var router = express.Router();

router.post('/betaregistration', function(req, res) {
    var collection = req.db.get('betaregistration');

    collection.insert(req.body,
        function (err, doc) {
            if (err) throw err;
        });


    res.status = 201; // CREATED
    res.json();
});


module.exports = router;
