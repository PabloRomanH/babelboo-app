var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../../server');

var request = supertest(app);

describe.only('API /api/playlist public part', function(done) {
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

    describe('testing /playlist/:id-or-slug', function() {
        var playlist = {_id: '396b3374783839356f786378', slug: 'a-slug'};

        it('should return a playlist by Id', function(done) {
            playlistsdb.insert(playlist, function() {
                playlistsdb.find({},{},function (err, res) {
                    console.log('In db:');
                    for(var i = 0; i < res.length; i++) {
                        console.log(res[i]);
                    }

                    request.get('/api/playlist/' + playlist._id)
                        .expect(200)
                        .end(function(req, res) {
                            console.log('expected', playlist);
                            console.log('got', res.body);
                            expect(res.body).to.equal(playlist);
                            done();
                        });
                })
            });
        });

        it('should return a playlist by slug', function(done) {
            playlistsdb.insert(playlist, function() {
                playlistsdb.find({},{},function (err, res) {
                    console.log('In db:');
                    for(var i = 0; i < res.length; i++) {
                        console.log(res[i]);
                    }
                request.get('/api/playlist/' + playlist.slug)
                    .expect(200)
                    .end(function(req, res) {
                            console.log('expected', playlist);
                            console.log('got', res.body);
                        expect(res.body).to.equal(playlist);
                        done();
                    });
                });
            });
        });

        it('should return 404', function() {
            var playlistId = '2mfl94tobuti';

            return request.get('/api/playlist/' + playlistId)
                .expect(404);
        });
    });


    describe('Testing /api/playlist/popular', function() {
        beforeEach(function(done) {
            playlistsdb.drop(function () {
                done();
            });
        });

        it('Happy path', function(done) {
            testPopular([{visitcount: 2}, {visitcount: 0}, {visitcount: 4}, {visitcount: 1}], 2, done);
        });

        it('Happy path different number of results', function(done) {
            testPopular([{visitcount: 2}, {visitcount: 0}, {visitcount: 4}, {visitcount: 1}], 3, done);
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

        it('returns only playlists with the same level', function(done) {
            testPopular([{visitcount: 2, level: 1}, {visitcount: 0, level: 2}, {visitcount: 4, level: 2}, {visitcount: 1, level: 3}], 2, done, 2);
        });

        function testPopular(playlists, numResultsRequested, done, level) {
            var visitcounts = [];
            var query = '/api/playlist/popular?num_results=' + numResultsRequested;
            if (typeof level !== 'undefined') {
                query += '&level=' + level;
            }

            for (var i = 0; i < playlists.length; i++) {
                if (typeof playlists[i].visitcount !== 'undefined'
                        && (typeof level === 'undefined' || playlists[i].level == level)) {
                    visitcounts.push(playlists[i].visitcount);
                }
            }

            visitcounts = visitcounts.sort().reverse();
            var numResultsExpected = Math.min(numResultsRequested, visitcounts.length);

            playlistsdb.insert(playlists,
                function() {
                    request.get(query)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end(function(err, res){
                            if (err) throw err;
                            expect(res.body.length).to.equal(numResultsExpected);

                            for (var j = 0; j < numResultsExpected; j++){
                                expect(res.body[j].visitcount).to.equal(visitcounts[j]);

                                if (typeof level !== "undefined") {
                                    expect(res.body[j].level).to.equal(level);
                                }
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


    afterEach(function(done) {
        playlistsdb.drop(function () {
            done();
        });
    });
});
