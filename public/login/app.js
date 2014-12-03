var _gaq = _gaq || [];

(function() {
    var app = angular.module('login', []);

    app.controller('LoginController', function(){
        var controller = this;
        controller.formVisible = false;

        function getList () {
            $http.get('/api/playlist').success(function(data){
                controller.playlists = data;
            });
        }

        this.toggleForm = function() {
            controller.formVisible = !controller.formVisible;
        }

    });
})();

function loadAnalytics() {
    _gaq.push(['_setAccount', 'UA-56348024-1'],
            ['_trackPageview']);
    (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}