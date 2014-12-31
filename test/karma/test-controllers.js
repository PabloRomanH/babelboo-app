describe("controllers", function() {
    beforeEach(module('navbar'));

    var route = {
        reload: function() {}
    };

    var fillUser = function(callback) {
        callback({
            username: 'guest',
            points: 25,
            _id: 3
        });
    }
    var user = { fillUser: fillUser };

    describe("navbar controller", function() {
        var ctrl;
        var scope;
        var analytics;

        beforeEach(module(function($provide) {
            $provide.value('user', user);
        }));

        beforeEach(inject(function($rootScope, $controller) {
            analytics = {
                eventTrack: sinon.spy()
            };
            scope = $rootScope.$new();
            ctrl = $controller('NavbarController', {
                $scope: scope,
                $analytics: analytics,
                $route: route,
                $location: location,
                user: user
            });
        }));

        afterEach (function() {
            analytics.eventTrack.reset();
        });

        it('loads user data', function() {
            expect(ctrl.user.username).to.equal("guest");
            expect(ctrl.user.points).to.equal(25);
            expect(ctrl.user._id).to.equal(3);
            expect(ctrl.showLogout).to.be.false;
        });

        it('tracks people clicking in points', function() {
            ctrl.pointsClicked();
            expect(analytics.eventTrack.called).to.be.true;
            expect(analytics.eventTrack.calledWithExactly('pointsClicked',{
                category: 'navigation',
                label: 3
            })).to.be.true;
        })
    });
});
