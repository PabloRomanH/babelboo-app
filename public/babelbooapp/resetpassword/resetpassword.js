(function() {
    var app = angular.module('resetpassword', []);

    app.controller('ResetController', function($location, resetpassword){
        var controller = this;
        controller.show = 'form';

        controller.setNewPassword = function(password) {
            var token = $location.search().token;

            resetpassword(token, password, function(success) {
                if (success) {
                    controller.show = 'success';
                } else {
                    controller.show = 'failure';
                }
            });
        };
    });
})();
