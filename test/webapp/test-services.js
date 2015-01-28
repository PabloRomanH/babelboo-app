
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
            $httpBackend.expectGET('/api/playlist?popular=true&num_results=' + NUM_POPULAR_RESULTS).respond(popularPlaylists);
            
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
        
        function testRankingPeriod(period, result) {
            $httpBackend.expectGET('/api/ranking/' + period).respond(result);
            
            ranking.getRanking(period).success(function(data) {
                expect(data).to.equal(result);
            });
            
            $httpBackend.flush();
        }
    });

    afterEach(function() {});
});
