(function() {
    var app = angular.module('profile', []);

    app.controller('ProfileController', function(login, profile, user) {
        var controller = this;
        controller.showWrongPassword = false;
        controller.showPasswordMismatch = false;
        controller.username = undefined;
        controller.email = undefined;

        user.fillUser(function (user) {
            controller.username = user.nickname;
            controller.email = user.username;
        });

        controller.update = function(username, email, newpassword, newpasswordconfirm, password) {
            username = (typeof username === 'undefined')? controller.username: username;
            email = (typeof email === 'undefined')? controller.email: email;

            if ((typeof newpassword === 'undefined') && (typeof newpasswordconfirm === 'undefined')) {
                profile(username, email);
            } else {
                if (newpassword == newpasswordconfirm) {
                    login(username, password, function (success) {
                        if (success) {
                            profile(username, email, newpassword);
                        } else {
                            controller.showWrongPassword = true;
                        }
                    });
                } else {
                    controller.showPasswordMismatch = true;
                }
            }

        };

    });
})();
