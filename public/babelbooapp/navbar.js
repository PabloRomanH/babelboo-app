(function() {
    var app = angular.module('navbar', []);
    app.controller('NavbarController', function($analytics, $route, $location, $rootScope, $scope, ranking) {
        var controller = this;
        controller.nickname = '';
        controller.showLogout = false;
        controller.userLogged = false;
        controller.formVisible = false;
        controller.showRegister = false;

        $scope.$on('$routeChangeSuccess', function($currentRoute, $previousRoute) {
            init();
        });

        $rootScope.$on('avatar.refresh', function () {
            ranking.getUserRank(updateMedalsAndRank);
        });

        $rootScope.$on('nickname.refresh', function () {
            ranking.getUserRank(updateMedalsAndRank);
        });

        $rootScope.$on('ranking.refresh', function () {
            ranking.getUserRank(updateMedalsAndRank);
        });

        init();

        controller.pointsClicked = function () {
            $analytics.eventTrack('pointsClicked', {
                    category: 'navigation', label: controller.nickname
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

        controller.toggleForm = function() {
            controller.formVisible = !controller.formVisible;

            if (controller.formVisible) {
                $analytics.eventTrack('callToAction', {
                    category: 'conversion'
                });
            }
        }

        function init() {
            ranking.getUserRank(updateMedalsAndRank);
            controller.showRegister = false;

            if (($location.path() == '/tv' || $location.path().match(/^\/play/)) && !controller.userLogged) {
                controller.showRegister = true;
            }
        }

        function updateMedalsAndRank(rank) {
            controller.nickname = rank.nickname;
            controller.rank = rank.rank;
            controller.golds = rank.golds;
            controller.silvers = rank.silvers;
            controller.bronzes = rank.bronzes;
            if (typeof rank.avatar !== 'undefined') {
                if(rank.avatar.small.match(/facebook/)) {
                    controller.avatar = rank.avatar.small;
                } else {
                    controller.avatar = rank.avatar.small + '?' + new Date().getTime();
                }
            }
            controller.userLogged = true;
            controller.showRegister = false;
        }
    });

    app.controller('LoginController', function($location, login){
        var controller = this;
        controller.showPassword = false;
        controller.showError = false;

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
