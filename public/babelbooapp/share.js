(function() {
    var app = angular.module('share', []);
    app.controller('ShareController', function($location, $window, playlists) {
        var controller = this;

        controller.facebook = function() {
            var path = $location.path();
            if (/\/play\//.test(path) || path == '/tv') {
                $window.open('https://www.facebook.com/sharer/sharer.php?u=http://www.babelboo.com' + path, '_blank');
            } else {
                $window.open('https://www.facebook.com/sharer/sharer.php?u=http://www.babelboo.com', '_blank');
            }
        };

        controller.twitter = function() {
            var path = $location.path();
            if (/\/play\//.test(path)) {
                var match = path.match(/\/play\/(.*)/);
                playlists.playById(match[1]).success(function(data) {
                    var message = 'Me ha gustado este playlist en @babelboo : ' + data.title;
                    $window.open('https://twitter.com/intent/tweet?text=' + message + '&url=http://www.babelboo.com' + path, '_blank');
                });
            } else if (path == '/tv') {
                var message = 'Aprende inglés sin preocupaciones con Boo TV @babelboo';
                $window.open('https://twitter.com/intent/tweet?text=' + message + '&url=http://www.babelboo.com' + path, '_blank');
            } else {
                var generalMessage = 'Aprende inglés mirando videos con @babelboo. Have fun, learn English.';
                var generalUrl = 'http://www.babelboo.com';

                $window.open('https://twitter.com/intent/tweet?text=' + generalMessage + '&url=' + generalUrl, '_blank');
            }
        };

        controller.email = function() {
            var path = $location.path();
            if (/\/play\//.test(path)) {
                var match = path.match(/\/play\/(.*)/);
                playlists.playById(match[1]).success(function(data){
                    var url = "mailto:?subject=" + escape("mirate estos videos en inglés") + "&body=" + escape('He encontrado un playlist muy bueno en Babelboo. Miratelo.\n\n' + data.title + ': ' + 'http://www.babelboo.com' + path);
                    $window.open(url, '_blank');
                });
            } else if (path == '/tv') {
                var url = "mailto:?subject=" + escape("nueva web para aprender inglés") + "&body=" + escape('Mirate Boo TV. Es una manera genial de mejorar el inglés sin preocuparte.\n\nhttp://www.babelboo.com/tv');
                $window.open(url, '_blank');
            } else {
                var url = "mailto:?subject=" + escape("nueva web para aprender inglés") + "&body=" + escape('He descubierto Babelboo. Es una manera genial de mejorar tu inglés.\n\nDale al enlace para entrar:\n\nhttp://www.babelboo.com');

                $window.open(url, '_blank');
            }
        };

    });
})();
