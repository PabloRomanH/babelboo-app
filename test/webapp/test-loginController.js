describe("Login controller", function() {
    beforeEach(module('navbar'));

    var success = true;
    var loginService;
    var locationService;
    var analytics;
    var ctrl;

    beforeEach(inject(function($controller) {
        analytics = { eventTrack: sinon.spy() };

        loginService = sinon.spy(function (username, password, callback) {
                callback(success);
            });

        locationService = { path: sinon.spy() };

        ctrl = $controller('LoginController', {
            login: loginService,
            $location: locationService,
            $analytics: analytics
        });
    }));

    it('analytics event generated when showing the login form', function() {
        ctrl.toggleForm();
        expect(analytics.eventTrack.calledWithExactly('callToAction', {category: 'conversion'})).to.be.true;
    });

    it('analytics event not generated when HIDING the login form', function() {
        ctrl.toggleForm();
        analytics.eventTrack.reset();
        ctrl.toggleForm();
        expect(analytics.eventTrack.called).to.be.false;
    });

    it('calls service with username and plain password', function() {
        ctrl.submit('user1', 'apass7869');
        expect(loginService.calledWith('user1', 'apass7869')).to.be.true;
    });

    it('no error shown on load', function() {
        expect(ctrl.showError).to.be.false;
    });

    it('redirects to /playlists after login success', function() {
        success = true;
        ctrl.submit('user1', 'apass7869');
        expect(locationService.path.calledWith('/')).to.be.true;
        expect(ctrl.showError).to.be.false;
    });

    it('shows error message after login failure', function() {
        success = false;
        ctrl.submit('user1', 'apass7869');
        expect(ctrl.showError).to.be.true;
        expect(locationService.path.called).to.be.false;
    });
});
