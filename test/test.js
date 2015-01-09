var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../server');

var request = supertest(app);

describe('App HTTP interface', function() {
    before(function(done) {
        app.onSessionConnected(done);
        // var db = app.db;
        // var users = db.get('usercollection');
        // users.insert({username: 'testuser1', password: 'apassword'}, done);
    });

    it('GET /login should return 200',function() {
        return request.get('/login/')
            .expect(200);
    });

    it('GET /playlists should return 302',function() {
        return request.get('/')
            .expect(302);
    });

    // after(function() {
    // // runs after all tests in this block
    //     var users = db.get('usercollection');
    //     users.drop(function() {
    //         db.close();
    //     });
    // });
});
