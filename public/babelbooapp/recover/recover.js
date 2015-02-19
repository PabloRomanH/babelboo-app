(function() {
    var app = angular.module('recover', []);

    app.controller('RecoverController', function($location, recover){
        var controller = this;
        controller.submitted = false;

        controller.recover = function(email) {
            recover(email);
            controller.submitted = true;
        };
    });
})();
