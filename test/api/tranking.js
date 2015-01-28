var port = process.env.PORT;

var express = require('express');
var bodyParser = require('body-parser');
var supertest = require('supertest-as-promised');
// var request = supertest('http://localhost:' + port);

process.env.NODE_ENV = 'test';

var app = require('../../server');
var request = supertest(app);

describe('API /api/ranking test it is private', function(done) {
    it('should return 401', function() {
        return request.get('/api/ranking/week')
            .expect(401);
    });
})


describe('API /api/ranking, logged in part', function() {
    describe('Testing /api/ranking/', function() {
        var setCookie;
        var db;
        var userdb;

        before(function() {
            db = app.db;
            userdb = db.get('usercollection');
        });

        beforeEach(function(done) {
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
                                        done();
                                    });
                                });
                        }
                    );
                });
            });
        });

        var BRONZE = 1;
        var SILVER = 2;
        var GOLD = 3;

        var medalData = [
            [ // 0
                { medal: GOLD, date: nDaysAgo(1000) },
                { medal: SILVER, date: nDaysAgo(1000) }
            ],
            [ // 1
                { medal: GOLD, date: nDaysAgo(1000) },
                { medal: GOLD, date: nDaysAgo(1000) },
                { medal: GOLD, date: nDaysAgo(1000) }
            ],
            [ // 2
                { medal: BRONZE, date: nDaysAgo(1000) }
            ],
            [ // 3
                { medal: SILVER, date: nDaysAgo(1000) },
                { medal: SILVER, date: nDaysAgo(1000) },
                { medal: SILVER, date: nDaysAgo(1000) },
                { medal: SILVER, date: nDaysAgo(1000) }
            ],
            [ // 4
                { medal: GOLD, date: nDaysAgo(1000) },
                { medal: SILVER, date: nDaysAgo(1000) },
                { medal: SILVER, date: nDaysAgo(1000) }
            ],
            [ // 5
                { medal: GOLD, date: nDaysAgo(1000) },
                { medal: SILVER, date: nDaysAgo(1000) },
                { medal: BRONZE, date: nDaysAgo(1000) }
            ],
            [ // 6
                { medal: BRONZE, date: nDaysAgo(1000) },
                { medal: BRONZE, date: nDaysAgo(1000) }
            ],
            [], // 7 <----- Don't miss this guy when counting indexes
            [ // 8
                { medal: GOLD, date: nDaysAgo(1000) },
                { medal: BRONZE, date: nDaysAgo(1000) }
            ],
            [ // 9
                { medal: GOLD, date: nDaysAgo(1000), playlistid: '97ui' },
                { medal: SILVER, date: nDaysAgo(1000), playlistid: '97ui' }
            ],
            [ // 10
                { medal: BRONZE, date: nDaysAgo(0)},
                { medal: GOLD, date: nDaysAgo(0)}
            ],
            [ // 11
                { medal: GOLD, date: nDaysAgo(10)},
                { medal: SILVER, date: nDaysAgo(0)}
            ],
            [ // 12
                { medal: GOLD, date: nDaysAgo(1000)},
                { medal: GOLD, date: nDaysAgo(1000)}
            ],
            [ // 13
                { medal: GOLD, date: nDaysAgo(6)}
            ],
            [ // 14
                { medal: BRONZE, date: nDaysAgo(0)},
                { medal: GOLD, date: nDaysAgo(7)}
            ],
            [ // 15
                { medal: GOLD, date: nDaysAgo(29)}
            ],
            [ // 16
                { medal: BRONZE, date: nDaysAgo(0)},
                { medal: GOLD, date: nDaysAgo(30)}
            ],
            [ // 17
                { medal: SILVER, date: nDaysAgo(1000), playlistid: '97ui' },
                { medal: GOLD, date: nDaysAgo(1000), playlistid: '97ui' }
            ],

        ];

        it('Happy path', function(done) {
            var indices = [0,1,2];
            var order = [1,0,2];
            var medals = [[0,1,1],[0,0,3],[1,0,0]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('More silvers than golds', function(done) {
            var indices = [0,3];
            var order = [0,1];
            var medals = [[0,1,1],[0,4,0]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('Same golds different silvers', function(done) {
            var indices = [0,4];
            var order = [1,0];
            var medals = [[0,1,1],[0,2,1]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('Same golds and silvers different bronzes', function(done) {
            var indices = [0,5];
            var order = [1,0];
            var medals = [[0,1,1],[1,1,1]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('No golds', function(done) {
            var indices = [2,3];
            var order = [1,0];
            var medals = [[1,0,0],[0,4,0]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('No golds no silvers', function(done) {
            var indices = [2,6];
            var order = [1,0];
            var medals = [[1,0,0],[2,0,0]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('No medals', function(done) {
            var indices = [0,7];
            var order = [0,1];
            var medals = [[0,1,1],[0,0,0]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('More than one medal for a playlist', function(done) {
            var indices = [8,9];
            var order = [0,1];
            var medals = [[1,0,1],[0,0,1]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('More than one medal for a playlist reverse order', function(done) {
            var indices = [8,17];
            var order = [0,1];
            var medals = [[1,0,1],[0,0,1]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('Weekly only', function(done) {
            var indices = [10,11,12];
            var order = [0,1,2];
            var medals = [[1,0,1],[0,1,0],[0,0,0]];
            testUserOrder(indices, order, medals, 'week', done);
        });

        it('Monthly only', function(done) {
            var indices = [10,11,12];
            var order = [1,0,2];
            var medals = [[1,0,1],[0,1,1],[0,0,0]];
            testUserOrder(indices, order, medals, 'month', done);
        });

        it('Alltime', function(done) {
            var indices = [10,11,12];
            var order = [2,1,0];
            var medals = [[1,0,1],[0,1,1],[0,0,2]];
            testUserOrder(indices, order, medals, 'alltime', done);
        });

        it('Weekly limits', function(done) {
            var indices = [13,14];
            var order = [0,1];
            var medals = [[0,0,1],[1,0,0]];
            testUserOrder(indices, order, medals, 'week', done);
        });

        it('Monthly limits', function(done) {
            var indices = [15,16];
            var order = [0,1];
            var medals = [[0,0,1],[1,0,0]];
            testUserOrder(indices, order, medals, 'month', done);
        });
        
        it('404 if wrong period', function() {
            var period = '7adi7ak09';
            return request.get('/api/ranking/' + period)
                .set('Cookie', setCookie)
                .expect(404);
        });
        
        // it('404 if no period', function() {
        //     return request.get('/api/ranking/')
        //         .set('Cookie', setCookie)
        //         .expect(404);
        // });

        function testUserOrder(indices, order, medals, period, done) {
            var users = getUsers(indices);
            userdb.insert(users, function() {
                request.get('/api/ranking/' + period)
                    .set('Cookie', setCookie)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res){
                        if (err) throw err;

                        for (var i = 0; i < order.length; i++) {
                            var user = users[order[i]];
                            var expected = {
                                username: user.username,
                                nickname: user.nickname,
                                rank: i+1,
                                golds: medals[order[i]][2],
                                silvers: medals[order[i]][1],
                                bronzes: medals[order[i]][0]
                            };

                            expect(res.body[i]).to.deep.equal(expected);
                        }

                        done();
                    });
            });
        }

        function getUsers(indices) {
            var usersArr = [];
            for (var i = 0; i < indices.length; i++) {
                var newUser = {
                        username: 'u' + i,
                        nickname: 'n' + i,
                        medalhistory: []
                    };

                var thisUserMedals = medalData[indices[i]];

                for (var j = 0; j < thisUserMedals.length; j++) {
                    newUser.medalhistory.push({
                        playlistid: thisUserMedals[j].playlistid? thisUserMedals[j].playlistId: 'p' + j,
                        medal: thisUserMedals[j].medal,
                        date: thisUserMedals[j].date
                    });
                }

                usersArr.push(newUser);
            }

            return usersArr;
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

        afterEach(function(done) {
            userdb.drop(function () {
                done();
            });
        });

    });

    after(function(done) {
    // runs after all tests in this block
        var users = app.db.get('usercollection');
        users.drop(function () {
            done();
        });
    });
});
