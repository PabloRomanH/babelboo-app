var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');

process.env.NODE_ENV = 'test';

var app = require('../../server');

var request = supertest(app);


describe('facebook metadata', function() {
    var SITE_NAME = "Babelboo";
    var page;

    describe('play', function() {
        var playlistsdb;
        var TITLE = 'a playlist';
        var THUMBNAIL = '/img/a_thumbnail.jpeg';

        before(function(done) {
            var db = app.db;
            playlistsdb = db.get('playlists');

            playlistsdb.drop(function () {
                playlistsdb.insert({title: TITLE, slug: 'a-playlist', entries: [{ thumbnail: THUMBNAIL}]}, function(err) {
                    request.get('/play/a-playlist').end(function(err, res) {
                        if (err) throw err;
                        page = res.text;
                        done();
                    });
                });
            });
        });

        it('title', function() {
            matchTag('title', TITLE);
        });

        it('description', function() {
            matchTag('description', 'Me ha gustado este playlist en Babelboo.');
        });

        it('site_name', function() {
            matchTag('site_name', SITE_NAME);
        });

        it('image', function() {
            matchTag('image', THUMBNAIL);
        });

        it('type', function() {
            matchTag('type', 'video.other');
        });

        after(function(done) {
            playlistsdb.drop(function () {
                done();
            })
        });
    });

    describe('boo tv', function() {
        before(function(done) {
            request.get('/tv').end(function(err, res) {
                if (err) throw err;
                page = res.text;
                done();
            });
        });

        it('title', function() {
            matchTag('title', 'Boo TV');
        });

        it('description', function() {
            matchTag('description', 'Aprende inglés sin preocupaciones.');
        });

        it('site_name', function() {
            matchTag('site_name', SITE_NAME);
        });

        it('image', function() {
            matchTag('image', 'http://www.babelboo.com/img/bootv.png');
        });

        it('type', function() {
            matchTag('type', 'website');
        });
    });

    describe('default', function() {
        before(function(done) {
            request.get('/').end(function(err, res) {
                if (err) throw err;
                page = res.text;
                done();
            });
        });

        it('/', function(done) {
            checkUrl('/', done);
        });

        it('/playlists', function(done) {
            checkUrl('/playlists', done);
        });

        it('/login', function(done) {
            checkUrl('/login', done);
        });

        it('/profile', function(done) {
            checkUrl('/profile', done);
        });

        it('/progress', function(done) {
            checkUrl('/progress', done);
        });

        it('/recover', function(done) {
            checkUrl('/recover', done);
        });

        it('/reset', function(done) {
            checkUrl('/reset', done);
        });

        function checkUrl(url, done) {
            request.get(url).end(function () {
                matchTag('title', 'Have fun, learn English');
                matchTag('description', 'Aprende inglés viendo los vídeos que mas te gustan.');
                matchTag('site_name', SITE_NAME);
                matchTag('image', 'http://www.babelboo.com/img/boo-blue.png');
                matchTag('type', 'website');
                done();
            });
        }
    });

    function matchTag(property, content) {
        var exp = new RegExp('<meta property="og:' + property + '" content="(.*?)" />');
        var matches = page.match(exp);
        expect(matches.length).to.not.be.null;
        expect(matches.length).to.equal(2);
        expect(matches[1]).to.equal(content);
    }
});
