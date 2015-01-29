var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../../server');
var request = supertest(app);

describe('API /api/plot test it is private', function(done) {
    it('should return 401', function() {
        return request.get('/api/plot/week')
            .expect(401);
    });
});

describe('API /api/plot, logged in part', function() {
    describe('Testing /api/plot/', function() {
        var setCookie;

        var BRONZE = 1;
        var SILVER = 2;
        var GOLD = 3;

        var medalHistory = [
            {
                date: nDaysAgo(1),
                medal: GOLD
            },
            {
                date: nDaysAgo(1),
                medal: GOLD
            },
            {
                date: nDaysAgo(1),
                medal: SILVER
            },
            {
                date: nDaysAgo(0),
                medal: BRONZE
            },
            {
                date: nDaysAgo(6),
                medal: BRONZE
            },
            {
                date: nDaysAgo(7),
                medal: BRONZE
            },
            {
                date: nDaysAgo(29),
                medal: BRONZE
            },
            {
                date: nDaysAgo(30),
                medal: BRONZE
            }
        ];

        beforeEach(function(done) {
            var db = app.db;
            var userdb = db.get('usercollection');
            var db = app.db;
            var logindb = db.get('testlogin');
            logindb.drop(function () {
                app.onSessionConnected(function() {
                    logindb.insert({username: 'testuser1', password: 'apassword'},
                        function() {
                            request.post('/login')
                                .send({ username: 'testuser1', password: 'apassword' })
                                .end(function(err, res){
                                    setCookie = res.headers['set-cookie'];
                                    if (err) throw err;
                                    userdb.drop(function() {
                                        userdb.insert({username: 'testuser1', password: 'apassword', medalhistory: medalHistory}, done);
                                    });
                                });
                        }
                    );
                });
            });
        });

        it('correctly adds medals in the same day and returns only last week', function (done) {
            return testPlotData('week', [[0,0,0,0,0,2,0],
                                         [0,0,0,0,0,1,0],
                                         [1,0,0,0,0,0,1]], done);
        });

        it('correctly selects medals obtained last month (above and below limits)', function (done) {
            return testPlotData('month', [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
                                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                                          [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1]], done);
        });


        function testPlotData(period, result, done) {
            return request.get('/api/plot/' + period)
                .set('Cookie', setCookie)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    if (err) throw err;
                    expect(res.body).to.deep.equal(result);
                    done();
                });
        }

        function nDaysAgo(nDays) {
            var date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            date.setDate(date.getDate() - nDays);
            return date;
        }
    });

    after(function(done) {
    // runs after all tests in this block
        var users = app.db.get('usercollection');
        users.drop(function () {
            done();
        });
    });
});