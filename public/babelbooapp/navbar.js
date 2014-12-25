(function() {
    var app = angular.module('navbar', []);
    app.controller('NavbarController', function($analytics, $route, $location, user) {
        this.user = {};
        var controller = this;
        controller.showLogout = false;

        user.fillUser(function (user) {
            controller.user = user;
        });

        controller.toggleLogout = function () {
            controller.showLogout = !controller.showLogout;
        }

        controller.pointsClicked = function () {
            $analytics.eventTrack('pointsClicked', {
                    category: 'navigation', label: controller.user._id
                });
        };

        controller.goToPlaylists = function () {
            $location.path('/playlists'); // FIXME: prevent controller from being loaded twice
            $route.reload();
        };
    });
})();