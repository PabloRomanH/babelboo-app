describe('password recovery controller', function() {
    beforeEach(module('recover'));
    var recoverService;
    var locationService;
    var ctrl;

    var EMAIL = 'example@example.com';

    beforeEach(inject(function($controller) {
        recoverService = sinon.spy();

        locationService = {
            path: sinon.spy()
        };

        ctrl = $controller('RecoverController', {
            recover: recoverService,
            $location: locationService,
        });
    }));

    it('calls service with submitted email', function() {
        ctrl.recover(EMAIL);
        expect(recoverService.calledWithExactly(EMAIL)).to.be.true;
    });

    it('shows form at the beginning', function() {
        expect(ctrl.submitted).to.be.false;
    })

    it('shows message after sending email', function() {
        ctrl.recover(EMAIL);
        expect(ctrl.submitted).to.be.true;
    });

    it('doesn\'t verify email format', function () {
        ctrl.recover('9xglrb=sm9lrhtb=0]xl8fdrhl');
        expect(ctrl.submitted).to.be.true;
    });
});
