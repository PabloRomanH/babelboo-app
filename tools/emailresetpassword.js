var dbpath = 'localhost:27017/babelboo';

var db = require('monk')(dbpath);
var request = require('request');

var usercollection = db.get('usercollection');

usercollection.find({}, function(err, result) {
    for(var i = 0; i < result.length; i++) {
        var email = result[i].username;
        sendRecoverEmail(email);
    }
});

function sendRecoverEmail(email) {
    var request = require('request');

    request.post(
        'http://babelboo.com/api/user/recover',
        { json: {email: email} },
        function (error, response, body) {
            if (error || response.statusCode != 200) {
                console.log('Couldn\'t send recover email to: ' + email);
                console.log(error);
                console.log(response.statusCode);
            } else {
                console.log('Sent recover email to: ' + email);
            }
        }
    );
}