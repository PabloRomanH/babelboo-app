describe('PlotController', function() {
    beforeEach(module('plot'));

    var ctrl;
    var weekData = 'aeo79ua7o';
    var monthData = 'ayauy7y9a98';

    beforeEach(inject(function($controller) {
        var plotService = {
            getData: function (period, callback) {
                if (period == 'week') {
                    callback(weekData);
                } else if (period == 'month'){
                    callback(monthData);
                } 
            }
        };
        
        ctrl = $controller('PlotController', {plot: plotService});
    }));
    
    it ('loads week data by default', function() {
        expect(ctrl.data).to.equal(weekData);
    });
    
    it('changes data when setPeriod called', function() {
        ctrl.setPeriod('month');
        expect(ctrl.data).to.equal(monthData);
        ctrl.setPeriod('week');
        expect(ctrl.data).to.equal(weekData);
    });
});
