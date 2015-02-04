
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

    afterEach(function() {});
});
