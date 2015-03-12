(function() {
    var app = angular.module('profile', []);

    app.controller('ProfileController', function($scope, $rootScope, profile, user, FileUploader) {
        var controller = this;
        controller.showWrongPassword = false;
        controller.showSuccess = false;
        controller.showFileError = false;
        controller.showUploading = false;
        controller.uploader = new FileUploader({
            url: '/api/user/avatar'
        });

        updateUser();

        controller.uploader.onAfterAddingFile = function () {
            controller.uploader.uploadAll();
            controller.showUploading = true;
        };

        controller.uploader.onSuccessItem = function () {
            updateUser();
            $rootScope.$emit('avatar.refresh');
            controller.showFileError = false;
            controller.showUploading = false;
        };

        controller.uploader.onErrorItem = function() {
            controller.showFileError = true;
            controller.showUploading = false;
        };

        controller.update = function() {
            profile($scope.nickname, $scope.email, $scope.password, $scope.newpassword, function(success) {
                controller.showSuccess = success;
                controller.showWrongPassword = !success;

                if (success) {
                    $rootScope.$emit('nickname.refresh');
                }
            });
        };

        function updateUser() {
            user.fillUser(function (user) {
                $scope.nickname = user.nickname;
                $scope.email = user.username;
                if (typeof user.avatar !== 'undefined') {
                    if(user.avatar.large.match(/facebook/)) {
                        controller.avatar = user.avatar.large;
                    } else {
                        controller.avatar = user.avatar.large + '?' + new Date().getTime();
                    }
                }
            });
        }

    });
})();
