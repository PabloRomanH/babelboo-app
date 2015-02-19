describe('Profile controller', function() {
    beforeEach(module('profile'));
    var ctrl;
    var scope;
    var profileService;
    var NICKNAME = 'auser';
    var EMAIL = 'asuer@test.com';
    var OLD_PASS = 'anoldpass';
    var NEW_NICKNAME = 'anewuser';
    var NEW_EMAIL = 'anewuser@test.com';
    var NEW_PASS = 'anewpass';

    beforeEach(inject(function($controller, $rootScope) {
        loginSuccess = true;
        scope = $rootScope.$new();

        profileService = sinon.spy(function(nickname, email, password, newPass, callback) {
            callback(password == OLD_PASS);
        });

        var userService = {
            fillUser: function (callback) {
                callback({username: EMAIL, nickname: NICKNAME});
            }
        };

        ctrl = $controller('ProfileController', {
            profile: profileService,
            user: userService,
            $scope: scope
        })
    }));

    describe('fill user', function(){
        it('loads user name', function() {
            expect(scope.nickname).to.equal(NICKNAME);
        });

        it('loads user email', function() {
            expect(scope.email).to.equal(EMAIL);
        });
    });

    describe('user inputs new values', function() {
        beforeEach(function() {
            scope.nickname = NEW_NICKNAME;
            scope.email = NEW_EMAIL;
            scope.password = OLD_PASS;
            scope.newpassword = NEW_PASS;
        });

        it('do not show errors on load', function() {
            expect(ctrl.showWrongPassword).to.be.false;
        });

        it('do not show success message on load', function() {
            expect(ctrl.showSuccess).to.be.false;
        });

        it('show success message', function() {
           ctrl.update();
           expect(ctrl.showSuccess).to.be.true;
        });

        it('shows error if current password NOT ok', function() {
            scope.password = 'notcurrentpassword';
            ctrl.update();
            expect(ctrl.showWrongPassword).to.be.true;
        });

        it('bad password, good password hides error message', function() {
            scope.password = 'notcurrentpassword';
            ctrl.update();
            scope.password = OLD_PASS;
            ctrl.update();
            expect(ctrl.showWrongPassword).to.be.false;
            expect(ctrl.showSuccess).to.be.true;
        });

        it('NO new password calls service with appropriate fields', function () {
            scope.newpassword = undefined;
            ctrl.update();
            expect(profileService.calledWith(NEW_NICKNAME, NEW_EMAIL, OLD_PASS, undefined)).to.be.true;
        });

        it('New password calls service with appropriate fields', function () {
            ctrl.update();
            expect(profileService.calledWith(NEW_NICKNAME, NEW_EMAIL, OLD_PASS, NEW_PASS)).to.be.true;
        });
    });

});
