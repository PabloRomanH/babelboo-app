describe('navbar controller', function() {
    beforeEach(module('navbar'));
    beforeEach(module('babelbooapp'));

    var route = {
        reload: function() {}
    };

    var ctrl;
    var scope;
    var analytics;
    var rankData;
    var userLogged = false;
    var currentRoute;

    beforeEach(inject(function($rootScope, $controller) {
        currentRoute = '';

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

        rankData = { username: 'u1', nickname: 'n1', rank: 42, golds: 3, silvers: 13, bronzes: 51 };
        var fillUser = function(callback) {
            if (userLogged) {
                callback(userData);
            }
        }
        var locationService = { path: function() { return currentRoute; }};
        var userService = { fillUser: fillUser, data: userData, correctAnswer: sinon.spy() };
        var getUserRank = function(callback) {
            if (userLogged) {
                callback(rankData);
            }
        };
        var rankingService = { getUserRank: getUserRank };

        analytics = {
            eventTrack: sinon.spy()
        };
        scope = $rootScope.$new();
        ctrl = $controller('NavbarController', {
            $scope: scope,
            $analytics: analytics,
            user: userService,
            ranking: rankingService,
            $location: locationService
        });
    }));

    afterEach (function() {
        analytics.eventTrack.reset();
    });

    describe('user not logged', function() {
        beforeEach(function() {
            userLogged = false;
        });

        it('detects user is not logged', function () {
            expect(ctrl.userLogged).to.be.false;
        });

        describe('register link behaviour', function() {
            it('shown if in bootv', function(){
                currentRoute = '/tv';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.true;
            });

            it('shown if in play', function() {
                currentRoute = '/play/ng14src1d3rd1';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.true;
            });

            it('not shown if in landing page', function() {
                currentRoute = '/login';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });

            it('not shown if in register page', function() {
                currentRoute = '/register';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });

            it('not shown if going to register page', function() {
                currentRoute = '/tv';
                scope.$emit('$routeChangeSuccess');
                currentRoute = '/register';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });

            it('not shown if going to landing page', function() {
                currentRoute = '/tv';
                scope.$emit('$routeChangeSuccess');
                currentRoute = '/login';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });
        });
    });

    describe('user logged', function() {
        beforeEach(function() {
            userLogged = true;
            scope.$emit('$routeChangeSuccess');
        });

        it('tracks people clicking in points', function() {
            ctrl.pointsClicked();
            expect(analytics.eventTrack.called).to.be.true;
            expect(analytics.eventTrack.calledWithExactly('pointsClicked',{
                category: 'navigation',
                label: 3
            })).to.be.true;
        });

        it('logout panel not shown initially', function() {
            expect(ctrl.showLogout).to.be.false;
        });


        describe('register link behaviour', function() {
            it('not shown in playlists', function(){
                currentRoute = '/playlists';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });

            it('not shown in play', function() {
                currentRoute = '/play/9aoe7iai7';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });

            it('not shown in bootv', function() {
                currentRoute = '/tv';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });

            it('not shown in progress', function() {
                currentRoute = '/progress';
                scope.$emit('$routeChangeSuccess');
                expect(ctrl.showRegister).to.be.false;
            });
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
    });
});
