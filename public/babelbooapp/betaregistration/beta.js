(function() {
    var app = angular.module('betaregistration', []);

    app.controller('BetaregistrationController', function($location, registration, login){
        var controller = this;
        controller.showError = false;

        controller.register = function(email, nickname, password) {
            registration(email, nickname, password, function(success) {
                if(success) {
                    login(nickname, password, function() {
                        $location.path('/tutorial');
                    });
                } else {
                    controller.showError = true;
                }
            });
        };

    });
})();
