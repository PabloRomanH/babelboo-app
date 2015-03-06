
describe('services', function() {
    // it('should fail', function() { expect(true).to.be.false; });
    beforeEach(module('services'));

    describe('renderTime', function() {
        var renderTime;

        beforeEach(inject(function(_renderTime_) {
            renderTime = _renderTime_;
        }));

        it('should match', function() {
            expect(renderTime(0)).to.equal('0:00');
            expect(renderTime(1)).to.equal('0:01');
            expect(renderTime(60)).to.equal('1:00');
            expect(renderTime(61)).to.equal('1:01');
            expect(renderTime(60 * 60)).to.equal('1:00:00');
            expect(renderTime(60 * 60 + 60)).to.equal('1:01:00');
            expect(renderTime(60 * 60 + 61)).to.equal('1:01:01');
            expect(renderTime(10 * 60 * 60 + 61)).to.equal('10:01:01');
            expect(renderTime(100 * 60 * 60 + 61)).to.equal('100:01:01');

            expect(renderTime(1.2)).to.equal('0:01');
            expect(renderTime(1.499)).to.equal('0:01');
            expect(renderTime(1.5)).to.equal('0:02');

            expect(renderTime(-1)).to.equal('');
            expect(renderTime()).to.equal('');
        });
    });

    describe('playlists', function() {
        var playlists;
        var $httpBackend;

        beforeEach(inject(function(_playlists_, _$httpBackend_) {
            playlists = _playlists_;
            $httpBackend = _$httpBackend_;
        }));

        var popularPlaylists = 'ntaeoduir8c7oefrucgadfoe7uyf'; // Random string to check equality

        it('popular playlists', function() {
            var NUM_POPULAR_RESULTS = 3;
            $httpBackend.expectGET('/api/playlist/popular?num_results=' + NUM_POPULAR_RESULTS).respond(popularPlaylists);

            playlists.getPopular(NUM_POPULAR_RESULTS).success(function(data) {
                expect(data).to.equal(popularPlaylists);
            });

            $httpBackend.flush();
        });

        it('popular playlists with level', function() {
            var NUM_POPULAR_RESULTS = 1;
            var popularEasy = 'babsr84xsr.';
            var popularMedium = 'alk9bsrghxs';
            var popularHard = 'antoehxusrg';

            $httpBackend.expectGET('/api/playlist/popular?num_results=' + NUM_POPULAR_RESULTS + '&level=1').respond(popularEasy);
            $httpBackend.expectGET('/api/playlist/popular?num_results=' + NUM_POPULAR_RESULTS + '&level=2').respond(popularMedium);
            $httpBackend.expectGET('/api/playlist/popular?num_results=' + NUM_POPULAR_RESULTS + '&level=3').respond(popularHard);

            playlists.getPopular(NUM_POPULAR_RESULTS, 1).success(function(data) {
                expect(data).to.equal(popularEasy);
            });

            playlists.getPopular(NUM_POPULAR_RESULTS, 2).success(function(data) {
                expect(data).to.equal(popularMedium);
            });

            playlists.getPopular(NUM_POPULAR_RESULTS, 3).success(function(data) {
                expect(data).to.equal(popularHard);
            });

            $httpBackend.flush();
        });

        describe('getPlaylist', function() {
            var playlist = {
                _id: 'lcg1ifirc51fc5in',
                slug: 'a-descriptive-slug'
            };

            it('returns requested playlist when called with id', function() {
                $httpBackend.expectGET('/api/playlist/' + playlist._id).respond(playlist);
                $httpBackend.expectPOST('/api/playlist/' + playlist._id + '/increasevisitcount').respond(200);
                playlists.getPlaylist(playlist._id, function (data) {
                    expect(data).to.deep.equal(playlist);
                });

                $httpBackend.flush();
            });

            it('returns requested playlist when called with slug', function() {
                $httpBackend.expectGET('/api/playlist/' + playlist.slug).respond(playlist);
                $httpBackend.expectPOST('/api/playlist/' + playlist._id + '/increasevisitcount').respond(200);
                playlists.getPlaylist(playlist.slug, function (data) {
                    expect(data).to.deep.equal(playlist);
                });

                $httpBackend.flush();
            });
        });
    });

    describe('ranking', function() {
        var ranking;
        var $httpBackend;

        var weekRanking = 'oeu0789efa'; // Random string to check equality
        var monthRanking = 'aoteud98a'; // Random string to check equality
        var alltimeRanking = 'a9oeiu9a'; // Random string to check equality


        beforeEach(module(function ($provide) {

            var fillUser = function(callback) {
                callback({ username: 'testuser1' });
            }

            var userService = { fillUser: fillUser };
            $provide.value('user', userService);
        }));

        beforeEach(inject(function(_ranking_, _$httpBackend_) {
            ranking = _ranking_;
            $httpBackend = _$httpBackend_;
        }));

        it('ranking week', function() {
            testRankingPeriod('week', weekRanking);
        });

        it('ranking month', function() {
            testRankingPeriod('month', monthRanking);
        });

        it('ranking alltime', function() {
            testRankingPeriod('alltime', alltimeRanking);
        });

        it('user rank', function(done) {
            var userrank = { username: 'testuser1', nickname: 't1', rank: 2, golds: 2, silvers: 0, bronzes: 0};
            var result = [
                    { username: 'u1', nickname: 'n1', rank: 1, golds: 3, silvers: 0, bronzes: 0},
                    userrank,
                    { username: 'u2', nickname: 'n2', rank: 3, golds: 0, silvers: 0, bronzes: 0}
                ];

            $httpBackend.expectGET('/api/ranking/alltime').respond(result);

            ranking.getUserRank(function (data) {
                expect(data).to.deep.equal(userrank);
                done();
            });

            $httpBackend.flush();
        });


        function testRankingPeriod(period, result) {
            $httpBackend.expectGET('/api/ranking/' + period).respond(result);

            ranking.getRanking(period).success(function(data) {
                expect(data).to.equal(result);
            });

            $httpBackend.flush();
        }
    });

    describe('plot', function() {
        var plot;
        var $httpBackend;

        var weekData = 'oeu0789efa'; // Random string to check equality
        var monthData = 'aoteud98a'; // Random string to check equality

        beforeEach(inject(function(_plot_, _$httpBackend_) {
            plot = _plot_;
            $httpBackend = _$httpBackend_;
        }));

        it('week plot', function() {
            testDataPeriod('week', weekData);
        });

        it('month plot', function() {
            testDataPeriod('month', monthData);
        });

        function testDataPeriod(period, result) {
            $httpBackend.expectGET('/api/plot/' + period).respond(result);

            plot.getData(period).success(function(data) {
                expect(data).to.equal(result);
            });

            $httpBackend.flush();
        }
    });

    describe('now', function() {
        var now;

        var weekData = 'oeu0789efa'; // Random string to check equality
        var monthData = 'aoteud98a'; // Random string to check equality

        beforeEach(inject(function(_now_) {
            now = _now_;
        }));

        it('returns current date', function() {
            var before = new Date();
            var output = now();
            var after = new Date();
            expect(output).to.be.within(before, after);

            before.setMilliseconds(before.getMilliseconds() - 1);
            expect(output).to.be.above(before);

            after.setMilliseconds(after.getMilliseconds() + 1);
            expect(output).to.be.below(after);
        });
    });

    afterEach(function() {});
});

describe('services', function() {
    // it('should fail', function() { expect(true).to.be.false; });
    beforeEach(module('services'));

    describe('renderTime', function() {
        var renderTime;

        beforeEach(inject(function(_renderTime_) {
            renderTime = _renderTime_;
        }));

        it('should match', function() {
            expect(renderTime(0)).to.equal('0:00');
            expect(renderTime(1)).to.equal('0:01');
            expect(renderTime(60)).to.equal('1:00');
            expect(renderTime(61)).to.equal('1:01');
            expect(renderTime(60 * 60)).to.equal('1:00:00');
            expect(renderTime(60 * 60 + 60)).to.equal('1:01:00');
            expect(renderTime(60 * 60 + 61)).to.equal('1:01:01');
            expect(renderTime(10 * 60 * 60 + 61)).to.equal('10:01:01');
            expect(renderTime(100 * 60 * 60 + 61)).to.equal('100:01:01');

            expect(renderTime(1.2)).to.equal('0:01');
            expect(renderTime(1.499)).to.equal('0:01');
            expect(renderTime(1.5)).to.equal('0:02');

            expect(renderTime(-1)).to.equal('');
            expect(renderTime()).to.equal('');
        });
    });

    describe('playlists', function() {
        var playlists;
        var $httpBackend;

        beforeEach(inject(function(_playlists_, _$httpBackend_) {
            playlists = _playlists_;
            $httpBackend = _$httpBackend_;
        }));

        var popularPlaylists = 'ntaeoduir8c7oefrucgadfoe7uyf'; // Random string to check equality

        it('popular playlists', function() {
            var NUM_POPULAR_RESULTS = 3;
            $httpBackend.expectGET('/api/playlist/popular?num_results=' + NUM_POPULAR_RESULTS).respond(popularPlaylists);

            playlists.getPopular(NUM_POPULAR_RESULTS).success(function(data) {
                expect(data).to.equal(popularPlaylists);
            });

            $httpBackend.flush();
        });
    });

    describe('ranking', function() {
        var ranking;
        var $httpBackend;

        var weekRanking = 'oeu0789efa'; // Random string to check equality
        var monthRanking = 'aoteud98a'; // Random string to check equality
        var alltimeRanking = 'a9oeiu9a'; // Random string to check equality


        beforeEach(module(function ($provide) {

            var fillUser = function(callback) {
                callback({ username: 'testuser1' });
            }

            var userService = { fillUser: fillUser };
            $provide.value('user', userService);
        }));

        beforeEach(inject(function(_ranking_, _$httpBackend_) {
            ranking = _ranking_;
            $httpBackend = _$httpBackend_;
        }));

        it('ranking week', function() {
            testRankingPeriod('week', weekRanking);
        });

        it('ranking month', function() {
            testRankingPeriod('month', monthRanking);
        });

        it('ranking alltime', function() {
            testRankingPeriod('alltime', alltimeRanking);
        });

        it('user rank', function(done) {
            var userrank = { username: 'testuser1', nickname: 't1', rank: 2, golds: 2, silvers: 0, bronzes: 0};
            var result = [
                    { username: 'u1', nickname: 'n1', rank: 1, golds: 3, silvers: 0, bronzes: 0},
                    userrank,
                    { username: 'u2', nickname: 'n2', rank: 3, golds: 0, silvers: 0, bronzes: 0}
                ];

            $httpBackend.expectGET('/api/ranking/alltime').respond(result);

            ranking.getUserRank(function (data) {
                expect(data).to.deep.equal(userrank);
                done();
            });

            $httpBackend.flush();
        });


        function testRankingPeriod(period, result) {
            $httpBackend.expectGET('/api/ranking/' + period).respond(result);

            ranking.getRanking(period).success(function(data) {
                expect(data).to.equal(result);
            });

            $httpBackend.flush();
        }
    });

    describe('plot', function() {
        var plot;
        var $httpBackend;

        var weekData = 'oeu0789efa'; // Random string to check equality
        var monthData = 'aoteud98a'; // Random string to check equality

        beforeEach(inject(function(_plot_, _$httpBackend_) {
            plot = _plot_;
            $httpBackend = _$httpBackend_;
        }));

        it('week plot', function() {
            testDataPeriod('week', weekData);
        });

        it('month plot', function() {
            testDataPeriod('month', monthData);
        });

        function testDataPeriod(period, result) {
            $httpBackend.expectGET('/api/plot/' + period).respond(result);

            plot.getData(period).success(function(data) {
                expect(data).to.equal(result);
            });

            $httpBackend.flush();
        }
    });

    describe('now', function() {
        var now;

        var weekData = 'oeu0789efa'; // Random string to check equality
        var monthData = 'aoteud98a'; // Random string to check equality

        beforeEach(inject(function(_now_) {
            now = _now_;
        }));

        it('returns current date', function() {
            var before = new Date();
            var output = now();
            var after = new Date();
            expect(output).to.be.within(before, after);

            before.setMilliseconds(before.getMilliseconds() - 1);
            expect(output).to.be.above(before);

            after.setMilliseconds(after.getMilliseconds() + 1);
            expect(output).to.be.below(after);
        });
    });

    describe('login', function() {
        var login;
        var $httpBackend;

        beforeEach(inject(function(_login_, _$httpBackend_) {
            login = _login_;
            $httpBackend = _$httpBackend_;
        }));

        it('Happy path', function() {
            var username = 'auser';
            var password = 'apass';
            var hashedPassword = hash(password);

            $httpBackend
                .expectPOST('/login/', {username: username, password: hashedPassword})
                .respond(200, '');

            var callbackSpy = sinon.spy(function(success) {
                    expect(success).to.be.true;
                });

            login(username, password, callbackSpy);

            $httpBackend.flush();

            expect(callbackSpy.calledOnce).to.be.true;
        });

        it('fails to login', function() {
            var failureSpy = sinon.spy();
            var username = 'auser';
            var password = 'apass';
            var hashedPassword = hash(password);

            $httpBackend
                .expectPOST('/login/', {username: username, password: hashedPassword})
                .respond(401, '');

            var callbackSpy = sinon.spy(function(success) {
                    expect(success).to.be.false;
                });

            login(username, password, callbackSpy);

            $httpBackend.flush();

            expect(callbackSpy.calledOnce).to.be.true;
        });

    });

    describe('registration service', function() {
        var email = 'example@example.com';
        var nickname = 'auser';
        var password = 'apass';
        var hashedPassword = hash(password);
        var registrationService;
        var $httpBackend;

        beforeEach(inject(function(_registration_, _$httpBackend_) {
            registrationService = _registration_;
            $httpBackend = _$httpBackend_;
        }));

        it('calls API with given email, nickname and hashed password', function() {
            $httpBackend
                .expectPOST('/api/user/', {email: email, nickname: nickname, password: hashedPassword})
                .respond(201, {});
            registrationService(email, nickname, password, function() {});

            $httpBackend.flush();
        });

        it('if user successfully registered calls callback with true', function() {
            $httpBackend
                .expectPOST('/api/user/', {email: email, nickname: nickname, password: hashedPassword})
                .respond(201, {});

            var callbackSpy = sinon.spy(function(success) {
                expect(success).to.be.true;
            });

            registrationService(email, nickname, password, callbackSpy);
            $httpBackend.flush();

            expect(callbackSpy.called).to.be.true;
        });

        it('if user can\'t be registered calls callback with false', function() {
            $httpBackend
                .expectPOST('/api/user/', {email: email, nickname: nickname, password: hashedPassword})
                .respond(403, {});

            var callbackSpy = sinon.spy(function(success) {
                expect(success).to.be.false;
            });

            registrationService(email, nickname, password, callbackSpy);
            $httpBackend.flush();

            expect(callbackSpy.called).to.be.true;
        });
    });

    describe('password recovery service', function() {
        var email = 'example@example.com';

        beforeEach(inject(function(_recover_, _$httpBackend_) {
            recoverService = _recover_;
            $httpBackend = _$httpBackend_;
        }));

        it('calls API with given email', function() {
            $httpBackend.expectPOST('/api/user/recover', { email: email }).respond(201, {});
            recoverService(email);

            $httpBackend.flush();
        });

    });

    describe('resetpassword service', function() {
        var password = 'l9aud80l890';
        var token = '29294d7f3778838fc1591844e1efdf1eed7f01eb';

        beforeEach(inject(function(_resetpassword_, _$httpBackend_) {
            resetService = _resetpassword_;
            $httpBackend = _$httpBackend_;
        }));

        it('calls API with call parameters', function() {
            $httpBackend.expectPOST('/api/user/reset', { token: token, password: hash(password) }).respond(200, {});
            resetService(token, password, function() {});

            $httpBackend.flush();
        });

        it('calls callback if success', function() {
            $httpBackend.whenPOST('/api/user/reset').respond(200, {});
            var callback = sinon.spy();
            resetService(token, password, callback);

            $httpBackend.flush();
            expect(callback.called).to.be.true;
        });

        it('calls callback if error', function() {
            $httpBackend.whenPOST('/api/user/reset').respond(401, {});
            var callback = sinon.spy();
            resetService(token, password, callback);

            $httpBackend.flush();
            expect(callback.called).to.be.true;
        });

        it('calls callback with true if successful', function() {
            $httpBackend.whenPOST('/api/user/reset').respond(200, {});
            resetService(token, password, function(success) {
                expect(success).to.be.true;
            });

            $httpBackend.flush();
        });

        it('calls callback with false if it fails', function() {
            $httpBackend.whenPOST('/api/user/reset').respond(401, {});
            resetService(token, password, function(success) {
                expect(success).to.be.false;
            });

            $httpBackend.flush();
        });
    });

    describe('profile', function() {
        var nickname = 'newnickname';
        var email = 'new@email.com';
        var newpassword = 'newpassword';
        var password = 'oldpassword';

        beforeEach(inject(function(_profile_, _$httpBackend_) {
            profileService = _profile_;
            $httpBackend = _$httpBackend_;
        }));

        it('calls api with given value', function() {
            $httpBackend.expectPOST('/api/user/update',
                {
                    username: email,
                    nickname: nickname,
                    password: hash(password),
                    newpassword: hash(newpassword)
                }).respond(200, {});

            profileService(nickname, email, password, newpassword);

            $httpBackend.flush();
        });

        it('doesn\'t send new password field when password not defined', function () {
            $httpBackend.expectPOST('/api/user/update',
                {
                    username: email,
                    nickname: nickname,
                    password: hash(password),
                    newpassword: undefined
                }).respond(200, {});

            profileService(nickname, email, password, undefined);

            $httpBackend.flush();
        });

        it('success when api call succeeds', function() {
            $httpBackend.whenPOST('/api/user/update').respond(200, {});

            var callback = sinon.spy(function(success) {
                expect(success).to.be.true;
            });

            profileService(nickname, email, password, newpassword, callback);

            $httpBackend.flush();
            expect(callback.called).to.be.true;
        });

        it('failure when api call fails', function() {
            $httpBackend.whenPOST('/api/user/update').respond(401, {});

            var callback = sinon.spy(function(success) {
                expect(success).to.be.false;
            });

            profileService(nickname, email, password, newpassword, callback);

            $httpBackend.flush();
            expect(callback.called).to.be.true;
        });
    });

    afterEach(function() {});
});

function hash(string) {
    return CryptoJS.SHA1(string).toString(CryptoJS.enc.Hex);
}
