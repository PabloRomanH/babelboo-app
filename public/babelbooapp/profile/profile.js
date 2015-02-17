(function() {
    var app = angular.module('profile', []);

    app.controller('ProfileController', function($scope, $rootScope, profile, user, FileUploader) {
        var controller = this;
        controller.showWrongPassword = false;
        controller.showSuccess = false;
        controller.uploader = new FileUploader();

        updateUser();

        controller.uploader.onSuccessItem = function () {
            updateUser();
            $rootScope.$broadcast('updateNavbarEvent');
        }

        controller.update = function() {
            profile($scope.nickname, $scope.email, $scope.password, $scope.newpassword, function(success) {
                controller.showSuccess = success;
                controller.showWrongPassword = !success;
            });
        };

        function updateUser() {
            user.fillUser(function (user) {
                $scope.nickname = user.nickname;
                $scope.email = user.username;
                controller.avatar = user.avatar;
            });
        }

    });
})();
