describe('PlotController', function() {
    beforeEach(module('plot'));
    beforeEach(module('services'));

    var ctrl;
    var weekData = [[12,0,0,0,0,0,1],
                    [0,8,0,2,0,4,0],
                    [5,0,0,0,0,0,1]];
    var monthData = [[8,11,     0,1,0,0,0,84,0,     0,0,3,0,0,2,0,      15,0,0,8,0,0,0,      12,0,0,0,0,0,1], // gold
                     [3,7,      0,0,0,5,0,0,0,      0,0,0,0,0,0,0,      0,0,1,0,0,54,0,      0,0,0,0,0,0,0], // silver
                     [5341,36,  0,0,0,0,1,1,1,      1,0,0,0,0,0,0,      2,0,0,0,0,0,3,       5,0,0,0,0,0,1]]; // bronze

    var nowDate = new Date();

    beforeEach(inject(function($controller) {
        var plotService = {
            getData: function (period) {
                return {
                    success: function (callback) {
                        if (period == 'week') {
                            callback(weekData);
                        } else if (period == 'month'){
                            callback(monthData);
                        }
                    }
                };
            }
        };

        var nowService = function() {
            return new Date(nowDate);
        };

        var rankingService = {
            getUserRank: function(callback) {
                callback({golds: 150, silvers: 70, bronzes: 5392});
            }
        };

        ctrl = $controller('PlotController', {plot: plotService, now: nowService, ranking: rankingService});
    }));

    var aggregatedMonthData = [
        [5504,5510,5593,5612],
        [5395,5396,5456,5462],
        [5380,5381,5386,5392]
    ];
    
    var expectedWeekData = [[5596, 5604, 5604, 5606, 5606, 5610, 5612],
                            [5447, 5455, 5455, 5457, 5457, 5461, 5462],
                            [5391, 5391, 5391, 5391, 5391, 5391, 5392]];

    it('loads month by default and aggregates month data by weeks (discards first two days)', function() {
        expect(ctrl.data).to.deep.equal(aggregatedMonthData);
    });

    it ('loads week data', function() {
        ctrl.setPeriod('week');
        expect(ctrl.data).to.deep.equal(expectedWeekData);
    });

    it('changes data when setPeriod called', function() {
        ctrl.setPeriod('week');
        expect(ctrl.data).to.deep.equal(expectedWeekData);
        ctrl.setPeriod('month');
        expect(ctrl.data).to.deep.equal(aggregatedMonthData);
    });

    it('week labels', function() {
        nowDate = new Date('2015-01-30');
        ctrl.setPeriod('week');
        expect(ctrl.labels).to.deep.equal(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Today']);

        nowDate = new Date('2015-01-31');
        ctrl.setPeriod('week');
        expect(ctrl.labels).to.deep.equal(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Today']);

        nowDate = new Date('2015-02-01');
        ctrl.setPeriod('week');
        expect(ctrl.labels).to.deep.equal(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Today']);

        nowDate = new Date('2015-02-02');
        ctrl.setPeriod('week');
        expect(ctrl.labels).to.deep.equal(['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Today']);

        nowDate = new Date('2015-02-03');
        ctrl.setPeriod('week');
        expect(ctrl.labels).to.deep.equal(['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Today']);

        nowDate = new Date('2015-02-04');
        ctrl.setPeriod('week');
        expect(ctrl.labels).to.deep.equal(['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Today']);

        nowDate = new Date('2015-02-05');
        ctrl.setPeriod('week');
        expect(ctrl.labels).to.deep.equal(['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Today']);
    });

    it('month labels', function() {
        ctrl.setPeriod('month');
        expect(ctrl.labels).to.deep.equal(['3 weeks ago', '2 weeks ago', 'last week', 'this week']);
    })
});
