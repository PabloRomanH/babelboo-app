(function() {
    var app = angular.module('navbar', []);
    app.controller('NavbarController', function($analytics, $route, $location, $scope, user) {
        this.user = {};
        var controller = this;
        controller.showLogout = false;

        user.fillUser(function (user) {
            $scope.$on('$routeChangeSuccess', function($currentRoute, $previousRoute) {
                updateMedalCount();
            });
            
            controller.user = user;
            updateMedalCount();
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

        function updateMedalCount() {
            controller.bronzes = 0;
            controller.silvers = 0;
            controller.golds = 0;

            for (var playlistId in controller.user.playlistprogress) {
                var ratio = controller.user.playlistprogress[playlistId].ratio;
                if (0 < ratio && ratio <= 0.5) {
                    controller.bronzes++;
                } else if (0.5 < ratio && ratio < 1) {
                    controller.silvers++;
                } else if (ratio == 1) {
                    controller.golds++;
                }
            }
        }
    });
})();