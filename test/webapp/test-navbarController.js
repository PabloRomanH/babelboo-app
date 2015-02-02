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
        var userService;
        var rankingService;
        var rankData;

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

            userService = { fillUser: fillUser, data: userData, correctAnswer: sinon.spy() };

            rankData = { username: 'u1', nickname: 'n1', rank: 42, golds: 3, silvers: 13, bronzes: 51 };

            var getUserRank = function(callback) {
                callback(rankData);
            };

            rankingService = { getUserRank: getUserRank };
        });

        beforeEach(inject(function($rootScope, $controller) {
            analytics = {
                eventTrack: sinon.spy()
            };
            scope = $rootScope.$new();
            ctrl = $controller('NavbarController', {
                $scope: scope,
                $analytics: analytics,
                user: userService,
                ranking: rankingService
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

        describe('sets and updates rank and medal count', function() {
            it('correctly copies medals at the beginning', function() {
                expect(ctrl.rank).to.equal(rankData.rank);
                expect(ctrl.golds).to.equal(rankData.golds);
                expect(ctrl.silvers).to.equal(rankData.silvers);
                expect(ctrl.bronzes).to.equal(rankData.bronzes);
            });

            it('correctly updates after route change event', function() {
                rankData.rank = 1337;
                rankData.golds = 15;
                rankData.silvers = 3;
                rankData.bronzes = 666;
                
                scope.$emit('$routeChangeSuccess');
                
                expect(ctrl.rank).to.equal(rankData.rank);
                expect(ctrl.golds).to.equal(rankData.golds);
                expect(ctrl.silvers).to.equal(rankData.silvers);
                expect(ctrl.bronzes).to.equal(rankData.bronzes);
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
