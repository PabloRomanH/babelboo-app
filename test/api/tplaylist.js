var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
var slug = require('slug');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../../server');

var request = supertest(app);
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

describe('API /api/playlist public part', function(done) {
    describe('testing /playlist/:id-or-slug', function() {
        var playlistId = '396b3374783839356f786378';
        var slug = 'a-slug';

        it('should return a playlist by Id', function(done) {
            playlistsdb.insert({_id: playlistId, slug: slug}, function() {
                request.get('/api/playlist/' + playlistId)
                    .expect(200)
                    .end(function(req, res) {
                        expect(res.body).to.deep.equal({_id: playlistId, slug: slug});
                        done();
                    });
            });
        });

        it('should return a playlist by slug', function(done) {
            playlistsdb.insert({_id: playlistId, slug: slug}, function() {
                request.get('/api/playlist/' + slug)
                    .expect(200)
                    .end(function(req, res) {
                        expect(res.body).to.deep.equal({_id: playlistId, slug: slug});
                        done();
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

describe('API /api/playlist private part', function() {
    var setCookie;

    var db = app.db;
    var userdb = db.get('usercollection');
    var logindb = db.get('testlogin');

    var USERNAME = 'auser@test.com';
    var NICKNAME = 'tonipenya';
    var HASHED_PASSWORD = 'a7oeiua7iaa9euaeo7i';

    beforeEach(function(done) {
        userdb.drop(function() {
            userdb.insert({username: USERNAME, nickname: NICKNAME, password: HASHED_PASSWORD}, done);
        });
    });

    beforeEach(function(done) {
        logindb.drop(function() {
            logindb.insert({username: USERNAME, nickname: NICKNAME, password: HASHED_PASSWORD},
                function () {
                    app.onSessionConnected(function() {
                        request.post('/login')
                            .send({ username: USERNAME, password: HASHED_PASSWORD })
                            .end(function(err, res){
                                setCookie = res.headers['set-cookie'];
                                if (err) throw err;
                                done();
                            });
                    }
                );
            });
        });
    });

    it('Creating a new playlists generates the slug', function(done) {
        var N_PLAYLISTS = 10;

        var TITLE = 'a playlist title';
        var TITLE_SLUG = slug(TITLE);
        var playlist = {title: TITLE};

        addPlaylist(0);

        function addPlaylist(index) {
            if (index < N_PLAYLISTS) {
                request.post('/api/playlist')
                    .set('Cookie', setCookie)
                    .send(playlist)
                    .expect(201)
                    .end(function(err, res) {
                        if (err) throw err;
                        setTimeout(addPlaylist.bind(null, index+1), 0);
                    });
            } else {
                noRepeatedSlugs();
            }
        }

        function noRepeatedSlugs() {
            checkSlug(0);

            function checkSlug(index) {
                if (index == N_PLAYLISTS) {
                    done();
                    return;
                }

                var titleSlug = TITLE_SLUG;

                if (index > 0) {
                    titleSlug += index+1;
                }

                playlistsdb.find({slug: titleSlug}, function (err, result) {
                    expect(result.length).to.equal(1);
                    setTimeout(checkSlug.bind(null, index+1), 0);
                });
            }
        }
    });

    it('Updating an existing playlist preserves the slug', function(done) {
        var TITLE = 'a unique title';
        var SLUG = 'a-unique-title'
        var playlist = {title: TITLE, slug: SLUG};

        playlistsdb.insert(playlist, function (err, result) {
            playlistsdb.find({slug: playlist.slug}, function (err, result) {
                playlist.title = 'a changed title';

                request.put('/api/playlist/' + result[0]._id)
                    .set('Cookie', setCookie)
                    .send(playlist)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) throw err;
                        playlistsdb.find({_id: result[0]._id}, function (err, result) {
                            expect(result[0].slug).to.equal(SLUG);
                            done();
                        });
                    });
            });
        });
    });
});
