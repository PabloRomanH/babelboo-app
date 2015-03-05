describe('Beta registration controller', function() {
    beforeEach(module('betaregistration'));
    var registrationService;
    var loginService;
    var locationService;
    var ctrl;

    var EMAIL = 'example@example.com';
    var NICKNAME = 'aNickname';
    var PASSWORD = 'aPassword';
    var success;

    beforeEach(inject(function($controller) {
        success = true;

        registrationService = sinon.spy(function(email, nickname, password, callback) {
            callback(success);
        });

        loginService = sinon.spy(function(nickname, password, callback) {callback()});

        locationService = {
            path: sinon.spy()
        };

        ctrl = $controller('BetaregistrationController', {
            registration: registrationService,
            $location: locationService,
            login: loginService
        });
    }));

    it('calls service with appropriate fields', function() {
        ctrl.register(EMAIL, NICKNAME, PASSWORD);

        expect(registrationService.calledWith(EMAIL, NICKNAME, PASSWORD)).to.be.true;
    });

    it('error message not shown on load', function() {
        expect(ctrl.showError).to.be.false;
    });

    describe('user does not exist', function() {
        it('logs newly created user after registration', function() {
            ctrl.register(EMAIL, NICKNAME, PASSWORD);

            expect(loginService.calledWith(NICKNAME, PASSWORD)).to.be.true;
        });

        it('redirects to tutorial after registration', function() {
            ctrl.register(EMAIL, NICKNAME, PASSWORD);

            expect(locationService.path.calledWithExactly('/tutorial')).to.be.true;
        });
    });

    describe('user already exists', function() {
        it('shows error if user exists', function() {
            success = false;
            ctrl.register(EMAIL, NICKNAME, PASSWORD);

            expect(ctrl.showError).to.be.true;
        });

        it('does not log user after registration', function() {
            success = false;
            ctrl.register(EMAIL, NICKNAME, PASSWORD);

            expect(loginService.called).to.be.false;
        });

        it('does not redirect to playlists after registration', function() {
            success = false;
            ctrl.register(EMAIL, NICKNAME, PASSWORD);

            expect(locationService.path.called).to.be.false;
        });
    });


});
