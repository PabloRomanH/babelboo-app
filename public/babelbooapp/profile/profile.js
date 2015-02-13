(function() {
    var app = angular.module('profile', []);

    app.controller('ProfileController', function($scope, profile, user) {
        var controller = this;
        controller.showWrongPassword = false;
        controller.showSuccess = false;

        user.fillUser(function (user) {
            $scope.nickname = user.nickname;
            $scope.email = user.username;
        });

        controller.update = function() {
            profile($scope.nickname, $scope.email, $scope.password, $scope.newpassword, function(success) {
                controller.showSuccess = success;
                controller.showWrongPassword = !success;
            });
        };

    });
})();
