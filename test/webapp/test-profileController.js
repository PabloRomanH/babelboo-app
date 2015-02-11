describe('Profile controller', function() {
    beforeEach(module('profile'));
    var ctrl;
    var loginService;
    var loginSuccess;
    var profileService;
    var USERNAME = 'auser';
    var EMAIL = 'asuer@test.com';
    var OLD_PASS = 'anoldpass';
    var NEW_USERNAME = 'anewuser';
    var NEW_EMAIL = 'anewuser@test.com';
    var NEW_PASS = 'anewpass';

    beforeEach(inject(function($controller) {
        loginSuccess = true;

        profileService = sinon.spy();

        loginService = function (username, password, callback) {
            callback(loginSuccess);
        };

        var userService = {
            fillUser: function (callback) {
                callback({username: EMAIL, nickname: USERNAME});
            }
        };

        ctrl = $controller('ProfileController', {
            login: loginService,
            profile: profileService,
            user: userService
        })
    }));

    it('do not show errors on load', function() {
        expect(ctrl.showWrongPassword).to.be.false;
        expect(ctrl.showPasswordMismatch).to.be.false;
    });

    describe('fill user', function(){
        it('loads user name', function() {
            expect(ctrl.username).to.equal(USERNAME);
        });

        it('loads user email', function() {
            expect(ctrl.email).to.equal(EMAIL);
        });

    });

    describe('default values', function() {
        it('no changes in username', function () {
            ctrl.update(undefined, NEW_EMAIL);
            expect(profileService.calledWithExactly(USERNAME, NEW_EMAIL)).to.be.true;
        });

        it('no changes in email', function () {
            ctrl.update(NEW_USERNAME, undefined);
            expect(profileService.calledWithExactly(NEW_USERNAME, EMAIL)).to.be.true;
        });
    });

    describe('NO new password', function () {
        it('does not check the old password', function() {
            loginSuccess = false;
            ctrl.update(NEW_USERNAME, NEW_EMAIL);
            expect(profileService.called).to.be.true;
        });


        it('calls service with appropriate fields', function () {
            ctrl.update(NEW_USERNAME, NEW_EMAIL);
            expect(profileService.calledWithExactly(NEW_USERNAME, NEW_EMAIL)).to.be.true;
        });
    });

    describe('new password', function () {
        it('calls service with appropriate fields', function () {
            ctrl.update(NEW_USERNAME, NEW_EMAIL, NEW_PASS, NEW_PASS, OLD_PASS);
            expect(profileService.calledWithExactly(NEW_USERNAME, NEW_EMAIL, NEW_PASS)).to.be.true;
        });

        it('calls the service if the password matches', function () {
            ctrl.update(NEW_USERNAME, NEW_EMAIL, NEW_PASS, NEW_PASS, OLD_PASS);
            expect(profileService.called).to.be.true;
        });

        it('does not call the service if the CURRENT password does not match', function() {
            loginSuccess = false;
            ctrl.update(NEW_USERNAME, NEW_EMAIL, NEW_PASS, NEW_PASS, 'abadoldpass');
            expect(profileService.called).to.be.false;
        });

        it('shows error message if CURRENT password does not match', function() {
            loginSuccess = false;
            ctrl.update(NEW_USERNAME, NEW_EMAIL, NEW_PASS, NEW_PASS, 'abadoldpass');
            expect(ctrl.showWrongPassword).to.be.true;
        });

        it('checks that the new password is confirmed', function () {
            ctrl.update(USERNAME, EMAIL, NEW_PASS, 'someotherpass', OLD_PASS);
            expect(profileService.called).to.be.false;
        });

        it('shows error message if new password is not confirmed', function() {
            ctrl.update(USERNAME, EMAIL, NEW_PASS, 'someotherpass', OLD_PASS);
            expect(ctrl.showPasswordMismatch).to.be.true;
        });
    });
});
