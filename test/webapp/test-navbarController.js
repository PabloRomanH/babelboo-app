describe("controllers", function() {
    beforeEach(module('navbar'));
    beforeEach(module('babelbooapp'));

    var route = {
        reload: function() {}
    };

    describe("navbar controller", function() {
        var ctrl;
        var scope;
        var analytics;
        var user;

        beforeEach(function() {
            var userData = {
                username: 'guest',
                _id: 3,
                playlistprogress : {
                    1: {ratio: 0},
                    2: {ratio: 0.9},
                    3: {ratio: 1},
                    4: {ratio: 0.1},
                    5: {ratio: 0.3},
                    6: {ratio: 0.7},
                    7: {ratio: 0.8}
                }
            };

            var fillUser = function(callback) {
                callback(userData);
            }

            user = { fillUser: fillUser, data: userData, correctAnswer: sinon.spy() };
        });

        beforeEach(inject(function($rootScope, $controller) {
            analytics = {
                eventTrack: sinon.spy()
            };
            scope = $rootScope.$new();
            ctrl = $controller('NavbarController', {
                $scope: scope,
                $analytics: analytics,
                user: user
            });
        }));

        afterEach (function() {
            analytics.eventTrack.reset();
        });

        it('tracks people clicking in points', function() {
            ctrl.pointsClicked();
            expect(analytics.eventTrack.called).to.be.true;
            expect(analytics.eventTrack.calledWithExactly('pointsClicked',{
                category: 'navigation',
                label: 3
            })).to.be.true;
        });

        describe('routeChangeSuccess event (updates medal count)', function() {
            it('complete user profile', function () {
                ctrl.user.playlistprogress = {
                    1: {ratio: 0},
                    2: {ratio: 0.9},
                    3: {ratio: 1},
                    4: {ratio: 0.1},
                    5: {ratio: 0.3},
                    6: {ratio: 0.7},
                    7: {ratio: 0.8}
                };
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.golds).to.equal(1);
                expect(ctrl.silvers).to.equal(3);
                expect(ctrl.bronzes).to.equal(2);
            });

            it('no playlist progress', function () {
                ctrl.user.playlistprogress = undefined;
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.golds).to.equal(0);
                expect(ctrl.silvers).to.equal(0);
                expect(ctrl.bronzes).to.equal(0);
            });

            it('empty playlist progress', function () {
                ctrl.user.playlistprogress = {};
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.golds).to.equal(0);
                expect(ctrl.silvers).to.equal(0);
                expect(ctrl.bronzes).to.equal(0);
            });

            it('ratio 0 means no medals', function () {
                ctrl.user.playlistprogress = {
                    1: {ratio: 0},
                    2: {ratio: 0}
                };
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.golds).to.equal(0);
                expect(ctrl.silvers).to.equal(0);
                expect(ctrl.bronzes).to.equal(0);
            });

            it('bronze ratio', function () {
                ctrl.user.playlistprogress = {
                    1: {ratio: 0},
                    2: {ratio: 0.00000001},
                    3: {ratio: 0.5},
                    4: {ratio: 0.50000001}
                };
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.bronzes).to.equal(2);
            });

            it('ratio silver', function () {
                ctrl.user.playlistprogress = {
                    1: {ratio: 0.5},
                    2: {ratio: 0.50000001},
                    3: {ratio: 0.99999999},
                    4: {ratio: 1}
                };
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.silvers).to.equal(2);
            });

            it('ratio gold', function () {
                ctrl.user.playlistprogress = {
                    1: {ratio: 0.99999999},
                    2: {ratio: 1}
                };
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.golds).to.equal(1);
            });
        });

        describe('logout panel', function() {
            it('initially false', function() {
                expect(ctrl.showLogout).to.be.false;
            });
        });

        describe('fill user', function(){
            it('detects user is logged', function() {
                expect(ctrl.userLogged).to.be.true;
            });
            it('loads user name', function() {
                expect(ctrl.user.username).to.equal("guest");
            });

            it('loads user id', function() {
                expect(ctrl.user._id).to.equal(3);
            });

            it('updates medal count', function(){
                expect(ctrl.golds).to.equal(1);
                expect(ctrl.silvers).to.equal(3);
                expect(ctrl.bronzes).to.equal(2);
            });
        });

        describe('no user logged', function () {
            var ctrl2;
            var user2;

            beforeEach(inject(function($rootScope, $controller) {
                user2 = { fillUser: function(){} }; // callback is not called when user is not logged in
                ctrl2 = $controller('NavbarController', {
                    $scope: scope,
                    $analytics: analytics,
                    user: user2
                });
            }));
            it('detects user is not logged', function () {
                expect(ctrl2.userLogged).to.be.false;
            });
        });
    });
});
