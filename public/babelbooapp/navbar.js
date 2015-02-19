(function() {
    var app = angular.module('navbar', []);
    app.controller('NavbarController', function($analytics, $route, $location, $scope, user, ranking) {
        var controller = this;
        controller.user = {};
        controller.showLogout = false;
        controller.userLogged = false;
        controller.showRegister = false;

        $scope.$on('$routeChangeSuccess', function($currentRoute, $previousRoute) {
            init('event');
        });

        init('init');

        controller.pointsClicked = function () {
            $analytics.eventTrack('pointsClicked', {
                    category: 'navigation', label: controller.user._id
                });
        };

        controller.goToPlaylists = function () {
            $location.path('/playlists'); // FIXME: prevent controller from being loaded twice
            $route.reload();
        };

        controller.goToBooTV = function () {
            $location.path('/tv'); // FIXME: prevent controller from being loaded twice
            $route.reload();
        };

        function init(when) {
            ranking.getUserRank(updateMedalsAndRank);
            controller.showRegister = false;

            if (($location.path() == '/tv' || $location.path().match(/^\/play/)) && !controller.userLogged) {
                controller.showRegister = true;
            }

            user.fillUser(function (user) {
                controller.showRegister = false;
                controller.user = user;
                controller.userLogged = true;
            });
        }

        function updateMedalsAndRank(rank) {
            controller.rank = rank.rank;
            controller.golds = rank.golds;
            controller.silvers = rank.silvers;
            controller.bronzes = rank.bronzes;
        }
    });

    app.controller('LoginController', function($analytics, $location, login){
        var controller = this;
        controller.formVisible = false;
        controller.showPassword = false;
        controller.showError = false;

        this.toggleForm = function() {
            controller.formVisible = !controller.formVisible;

            if (controller.formVisible) {
                $analytics.eventTrack('callToAction', {
                    category: 'conversion'
                });
            }
        }

        this.submit = function(username, password) {
            login(username, password, function(success) {
                if(success) {
                    $location.path('/');
                } else {
                    controller.showError = true;
                }
            });
        }
    });
})();