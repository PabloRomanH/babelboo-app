describe('Profile controller', function() {
    beforeEach(module('profile'));
    var ctrl;
    var scope;
    var rootscope;
    var profileService;
    var userData;
    var uploaderMock;
    var NICKNAME = 'auser';
    var EMAIL = 'asuer@test.com';
    var OLD_PASS = 'anoldpass';
    var NEW_NICKNAME = 'anewuser';
    var NEW_EMAIL = 'anewuser@test.com';
    var NEW_PASS = 'anewpass';

    var UploaderMock = function() {};
    UploaderMock.prototype.onSuccessItem = function(item, response, status, headers) {};

    before(function() {
        userData = {};
    });

    beforeEach(inject(function($controller, $rootScope) {
        loginSuccess = true;
        rootscope = $rootScope;
        rootscope.$broadcast = sinon.spy(rootscope.$broadcast);
        scope = $rootScope.$new();

        profileService = sinon.spy(function(nickname, email, password, newPass, callback) {
            callback(password == OLD_PASS);
        });

        userData.username = EMAIL;
        userData.nickname = NICKNAME;

        var userService = {
            fillUser: function (callback) {
                callback(userData);
            }
        };

        ctrl = $controller('ProfileController', {
            profile: profileService,
            user: userService,
            $scope: scope,
            $rootScope: rootscope,
            FileUploader: UploaderMock
        });
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

    describe('avatar update', function() {
        var avatarURL = 'http://babelboo.com/avatars/08a7ir87ire87yuir8f7ir.jpeg';

        describe('user with existing avatar', function() {
            before(function () {
                userData.avatar = avatarURL;
            });

            it('sets path to avatar file in controller on load', function() {
                expect(ctrl.avatar).to.equal(avatarURL);
            });
        });

        it('if the user does not have an avatar, avatar variable takes value undefined', function() {
            expect(typeof ctrl.avatar === 'undefined').to.be.true;
        });

        it('controller updater is an instance of Updater', function() {
            expect(ctrl.uploader instanceof UploaderMock).to.be.true;
        });

        it('display new user avatar after successful upload', function() {
            userData.avatar = avatarURL;
            ctrl.uploader.onSuccessItem();

            expect(ctrl.avatar).to.equal(avatarURL);
        });

        it('throw event to update navbar after successful upload', function() {
            ctrl.uploader.onSuccessItem();
            expect(rootscope.$broadcast.calledWithExactly('updateNavbarEvent')).to.be.true;
        });
    });

});
