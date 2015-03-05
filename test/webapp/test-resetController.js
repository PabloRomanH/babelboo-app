describe('password recovery controller', function() {
    beforeEach(module('resetpassword'));
    var recoverService;
    var locationService;
    var ctrl;

    var NEW_PASSWORD = 'l9aud80l890';
    var TOKEN = '29294d7f3778838fc1591844e1efdf1eed7f01eb';

    var success;

    beforeEach(inject(function($controller) {
        resetService = sinon.spy(function(token, newPassword, callback) { callback(success); });
        success = true;

        locationService = {
            search: sinon.spy(function() {
                return { token: TOKEN };
            })
        };

        ctrl = $controller('ResetController', {
            resetpassword: resetService,
            $location: locationService
        });
    }));

    it('shows new password form at the beginning', function() {
        expect(ctrl.show).to.equal('form');
    });

    it('calls service with token specified in the url and password written in the form', function() {
        ctrl.setNewPassword(NEW_PASSWORD);

        expect(resetService.calledWith(TOKEN, NEW_PASSWORD)).to.be.true;
    });

    it('shows success message if password is changed successfully', function() {
        ctrl.setNewPassword(NEW_PASSWORD);

        expect(ctrl.show).to.equal('success');
    });

    it('hides new password form if the password can\'t be changed', function() {
        success = false;
        ctrl.setNewPassword(NEW_PASSWORD);

        expect(ctrl.show).to.not.equal('form');
    });

    it('hides new password form if password is changed successfully', function() {
        ctrl.setNewPassword(NEW_PASSWORD);

        expect(ctrl.show).to.not.equal('form');
    });
});
