var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../../server');

var request = supertest(app);

describe('App static pages', function() {
    it('GET /login should return 200',function() {
        return request.get('/login/')
            .expect(200);
    });

    it('GET / should return 200',function() {
        return request.get('/')
            .expect(200);
    });

    it('GET /lcakrobrgbs should return 200',function() {
        return request.get('/lcakrobrgbs')
            .expect(200);
    });
});
