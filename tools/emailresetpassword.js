#!/usr/bin/env node

var dbpath = 'localhost:27017/babelboo';

var db = require('monk')(dbpath);
var request = require('request');

var usercollection = db.get('usercollection');

var alreadySent = [
    'daniachun@gmail.com',
    'yohei.tsujinaka@gmail.com',
    'xavi.capa@gmail.com',
    'menalahoz@gmail.com',
    'saray.sbd89@hotmail.com',
    'calderonlau9@gmail.com',
    'massotcr@gmail.com',
    'blueshark_00@hotmail.com',
    'marc.salat.v@gmail.com',
    'carlosambros@gmail.com',
    'xavieru02@gmail.com',
    'enitne@gmail.com',
    'nelenia@hotmail.com',
    'anaoh13@gmail.com',
    'gallardo.dani@gmail.com'];

usercollection.find({}, function(err, result) {
    sendNext(result, 0);
});

function sendNext(result, i) {
    if (i >= result.length) {
        db.close();
        return;
    }

    var email = result[i].username;

    if (alreadySent.indexOf(email) != -1) {
        console.log('---- ' + email);
        setTimeout(sendNext.bind(null, result, i + 1), 0);
    } else {
        console.log(email);
        sendRecoverEmail(email);
        setTimeout(sendNext.bind(null, result, i + 1), 5000);
    }
}

function sendRecoverEmail(email) {
    request.post(
        'http://localhost:3000/api/user/recover',
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
