var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../../server');

var request = supertest(app);

describe('API /api/betaregistration', function(done) {
    var db = app.db;
    var collection = db.get('betaregistration');

    beforeEach(function(done) {
        collection.drop(function () {
            done();
        });
    });

    it('POST /api/betaregistration should return 201 and add email to db',function(done) {
        var object = { email: 'a@a.com'};
        request.post('/api/betaregistration').send(object)
            .expect(201)
            .end(function(err, res){
                collection.find(object, function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.length(1);
                    expect(res[0].email).to.equal(object.email);
                    done();
                });
            });
    });

    it('POST /api/betaregistration should return 406 when called with wrong parameters',function() {
        var object = { another: 'thing'};
        return request.post('/api/betaregistration').send(object)
            .expect(406);
    });

    it('POST /api/betaregistration should return 406 when called without POST body',function() {
        return request.post('/api/betaregistration')
            .expect(406);
    });

    afterEach(function(done) {
        collection.drop(function () {
            done();
        });
    });
});


