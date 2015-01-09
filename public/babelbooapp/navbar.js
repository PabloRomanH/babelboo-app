(function() {
    var app = angular.module('navbar', []);
    app.controller('NavbarController', function($analytics, $route, $location, $scope, user) {
        this.user = {};
        var controller = this;
        controller.showLogout = false;
        controller.userLogged = false;

        $scope.$on('$routeChangeSuccess', function($currentRoute, $previousRoute) {
            updateMedalCount();
        });

        user.fillUser(function (user) {
            controller.user = user;
            controller.userLogged = true;
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

            for (var playlistId in user.data.playlistprogress) {
                var ratio = user.data.playlistprogress[playlistId].ratio;
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

    app.controller('LoginController', function($analytics, $http){
        var controller = this;
        controller.formVisible = false;
        controller.showPassword = false;

        this.toggleForm = function() {
            controller.formVisible = !controller.formVisible;
            $analytics.eventTrack('callToAction', {
                category: 'conversion'
            });
        }

        this.submit = function($event) {
            if (!controller.showPassword && (this.username == 'sepha' || this.username == 'toni' || this.username == 'fran')) {
                controller.showPassword = true;
                $event.preventDefault()
            }
        }
    });
})();