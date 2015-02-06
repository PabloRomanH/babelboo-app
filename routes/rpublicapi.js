
var express = require('express');
var mailer = require('nodemailer');

var router = express.Router();

router.post('/betaregistration', function(req, res) {
    var collection = req.db.get('betaregistration');

    if (req.body.email == undefined) {
        res.status(406);
        res.json({ error: { message: 'Invalid request', code: 406 }});
        return;
    }

    collection.insert({ email: req.body.email },
        function (err, doc) {
            if (err) throw err;
        });


    res.status(201); // CREATED
    res.json();
});

router.get('/playlist/popular', function(req, res) {
    var collection = req.db.get('playlists');

    var query = { visitcount: { $exists: true } };

    if (req.query.level && req.query.level != -1) {
        query.level = parseInt(req.query.level);
    }

    collection.find(query, {sort: {visitcount: -1}, limit: req.query.num_results}, function (err, result) {
        res.json( result );
    });
});

router.get('/playlist/:playlist_id', function(req, res) {
    var collection = req.db.get('playlists');

    try {
        collection.find({_id: req.params.playlist_id},{},function (err, result) {
            if (result.length < 1) {
                res.status(404);
                res.json({ error: { message: 'Not found', code: 404 }});
            } else {
                res.json( result[0] );
            }
        });
    } catch (err) {
        res.status(500);
        res.json({ error: { message: 'Internal server error', code: 500 }});
        return;
    }
});

router.post('/playlist/:playlist_id/increasevisitcount', function(req, res) {
    var playlistId = req.params.playlist_id;

    try {
        if (req.isAuthenticated() && !req.user.playlistprogress[playlistId].finished) {
            return;
        }
    } catch(err) {
        return;
    }

    var collection = req.db.get('playlists');
    var query = {
        _id: playlistId
    }

    collection.update(query, {$inc: {visitcount: 1}});
    res.json();
});

router.get('/video/:level?', function(req, res) {
    var level = req.params.level;
    var query = {};
    if (level) {
        query = { level: parseInt(level) };
    }

    var collection = req.db.get('videos');

    try {
        collection.find(query, {}, function (err, result) {
            res.json(result);
        });
    } catch (err2) {
        res.json();
    }
});

router.post('/user/', function(req, res) {
    var collection = req.db.get('usercollection');

    var passwordMatch = /^[abcdef\d]{40}$/.test(req.body.password);
    var nicknameMatch = /@/.test(req.body.nickname);

    if (req.body.nickname.length > 15
            || nicknameMatch
            || req.body.email.length > 60
            || !passwordMatch) {
        res.status(400);
        res.end();
        return;
    }

    var emailRe = new RegExp("^" + req.body.email + "$", "i")
    var nicknameRe = new RegExp("^" + req.body.nickname + "$", "i")

    collection.find({ $or: [{username: emailRe}, {nickname: nicknameRe}] }, function (err, result) {
        if (result.length > 0) {
            res.status(403);
            res.end();
            return;
        }

        var query = {
            username: req.body.email,
            nickname: req.body.nickname,
            password: req.body.password,
            daysvisited: 0
        };

        collection.insert(query, function (err, doc) {
            if (err) throw err;

            res.status(201); // CREATED
            res.end();

            sendEmail(req.body.nickname, req.body.email);
        });
    });

    function sendEmail(nickname, email) {
        var transporterOptions = {
            service: 'Gmail',
            auth: {
                user: 'babelboodotcom@gmail.com',
                pass: 'kyqgfawqokbemjdz'
            }
        };

        var transporter = mailer.createTransport(transporterOptions);

        var text =
            '*********************\n'
            +'Bienvenido a babelboo\n'
            +'*********************\n'
            +'\n'
            +'------------------------\n'
            +'Have fun, learn English!\n'
            +'------------------------\n'
            +'\n'
            +'Tu usuario #username# se ha creado correctamente.\n'
            +'Puedes hacer click en el botón de más abajo para entrar a\n'
            +'babelboo y empezar a ver vídeos.\n'
            +'Cuando entres verás diferentes playlists y puedes escoger\n'
            +'tema y dificultad. La idea es que puedas pasarte horas mirando\n'
            +'viídeos de cosas que te interesan y de tu nivel.\n'
            +'\n'
            +'Entra a babelboo ( http://www.babelboo.com )\n'
            +'\n'
            +'¿Andas muy liado? Aquí ( http://www.babelboo.com/play/54aab86ba5606f354096a9eb ) tienes\n'
            +'una playlist cortita que no te llevará más de cinco minutos.\n'
            +'\n'
            +'www.babelboo.com ( http://www.babelboo.com )\n'
            +'\n'
            +'babelboo.com ( http://www.babelboo.com )\n'
            +'\n'
            +'Copyright © 2015 Babelboo, All rights reserved.\n';

        var html = '<html>' +
            '<body style="background-color: #F2F2F2; height: 100% !important; width: 100% !important;">' +
            '<div style="padding: 10px">' +
                '<div style="width: 600px; background-color: #fff; color: #606060 !important; font-family: Helvetica !important; margin: 10px auto; padding: 20px;" bgcolor="#fff">' +
                    '<img src="http://www.babelboo.com/img/welcomeboo.png"/>' +
                    '<h1 style="font-size: 40px; line-height: 125%; letter-spacing: -1px; margin: 0;">Bienvenido a babelboo</h1>' +
                    '<h2 style="font-size: 18px; line-height: 125%; letter-spacing: -.5px; margin: 0;">Have fun, learn English!</h2>' +
                    '<p style="font-size: 15px; line-height: 150%;">Tu usuario #username# se ha creado correctamente. ' +
                    'Puedes hacer click en el botón de más abajo para entrar a babelboo y empezar a ver vídeos. ' +
                    'Cuando entres verás diferentes playlists y puedes escoger tema y dificultad. La idea es que puedas pasarte horas mirando vídeos de cosas que te interesan y de tu nivel.' +
                    '</p>' +
                    '<div style="text-align: center; padding: 30px;" align="center">' +
                        '<a href="http://www.babelboo.com" style="color: #fff !important; text-decoration: none; border-radius: 5px; font-family: Helvetica; font-weight: bold; background-color: #228b22; padding: 15px; border: 2px solid #176617;">Entra a babelboo</a>' +
                    '</div>' +
                    '<p style="font-size: 15px; line-height: 150%;">¿Andas muy liado? <a href="http://www.babelboo.com/play/54aab86ba5606f354096a9eb" style="color: #6DC6DD;">Aquí</a> tienes una playlist cortita que no te llevará más de cinco minutos.</p>' +
                    '<p style="font-size: 15px; line-height: 150%;"><a href="http://www.babelboo.com" style="color: #6DC6DD;">www.babelboo.com</a></p>' +
                    '<em style="font-size: 12px;">' +
                        '<a href="http://www.babelboo.com" style="color: #606060 !important;">babelboo.com</a>' +
                        '<br/>' +
                        'Copyright © 2015 Babelboo, All rights reserved.' +
                    '</em>' +
                '</div>' +
            '</div>' +
            '</body>' +
            '</html>';

        text = text.replace('#username#', nickname);
        html = html.replace('#username#', nickname);

        var mailOptions = {
            from: 'Babelboo <contact@babelboo.com>',
            to: email,
            subject: 'Bienvenido a babelboo',
            text: text,
            html: html
        };

        transporter.sendMail(mailOptions);
    }
});

module.exports = router;
