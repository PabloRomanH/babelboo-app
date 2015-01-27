var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../../server');

var request = supertest(app);

describe('API /api/playlist public part', function(done) {
    var db;
    var playlistsdb;

    before(function() {
        db = app.db;
        playlistsdb = db.get('playlists');
    });

    beforeEach(function(done) {
        playlistsdb.drop(function () {
            done();
        });
    });

    it('should return a playlist by Id', function(done) {
        var playlistId = "396b3374783839356f786378";
        playlistsdb.insert({ _id: playlistId}, function() {
            request.get('/api/playlist/' + playlistId)
                .expect(200)
                .end(function(req, res) {
                    expect(res.body).to.deep.equal({ _id: playlistId});
                    done();
                });
        });
    });

    it('should return 404', function() {
        var playlistId = '2mfl94tobuti';

        return request.get('/api/playlist/' + playlistId)
            .expect(404);
    });

    afterEach(function(done) {
        playlistsdb.drop(function () {
            done();
        });
    });
});


describe('API /api/playlist, logged in part', function() {
    var setCookie;
    before(function(done) {
        app.onSessionConnected(function() {
            var db = app.db;
            var users = db.get('usercollection');
            users.insert({username: 'testuser1', password: 'apassword'},
                function(){
                    request.post('/login')
                        .send({ username: 'testuser1', password: 'apassword' })
                        .end(function(err, res){
                                setCookie = res.headers['set-cookie'];
                                if (err) throw err;
                                done();
                            });
                }
            );
        });
    });

    describe('Testing /api/playlist?popular', function() {
        var db;
        var playlistsdb;

        before(function() {
            db = app.db;
            playlistsdb = db.get('playlists');
        });

        beforeEach(function(done) {
            playlistsdb.drop(function () {
                done();
            });
        });

        it('Happy path', function(done) {
            testPopular([{visitcount: 2}, {visitcount: 0}, {visitcount: 4}, {visitcount: 1}], 2, done);
        });

        it('less playlists than requested', function(done) {
            testPopular([{visitcount: 2}], 2, done);
        });

        it('playlists without visitcount', function(done) {
            testPopular([{}, {}], 2, done);
        });

        it('less playlists with visitcount than requested', function(done) {
            testPopular([{visitcount: 2}, {}], 2, done);
        });

        it('no playlists in db', function(done) {
            testPopular([], 2, done);
        });

        function testPopular(playlists, numResultsRequested, done) {
            var visitcounts = [];
            for (var i = 0; i < playlists.length; i++) {
                if (playlists[i].visitcount != undefined) {
                    visitcounts.push(playlists[i].visitcount);
                }
            }
            visitcounts = visitcounts.sort().reverse();
            var numResultsExpected = Math.min(numResultsRequested, visitcounts.length);
            // console.log(visitcounts);

            playlistsdb.insert(playlists,
                function() {
                    request.get('/api/playlist?popular=true&num_results=' + numResultsRequested)
                        .set('Cookie', setCookie)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end(function(err, res){
                            if (err) throw err;
                            // console.log(res.body);
                            expect(res.body.length).to.equal(numResultsExpected);

                            for (var j = 0; j < numResultsExpected; j++){
                                // console.log(res.body[j].visitcount + " " + visitcounts[j]);
                                expect(res.body[j].visitcount).to.equal(visitcounts[j]);
                            }

                            done();
                        });
                });
        }

        after(function(done) {
            playlistsdb.drop(function () {
                done();
            });
        });
    });

    after(function(done) {
    // runs after all tests in this block
        var users = app.db.get('usercollection');
        users.drop(function() {
            app.db.close();
            done();
        });
    });
});
