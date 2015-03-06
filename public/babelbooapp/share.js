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

                playlists.getPlaylist(match[1], function(data) {
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

                playlists.getPlaylist(match[1], function(data) {
                    var url = "mailto:?subject=" + "Mírate estos videos en inglés" + "&body=" + 'He encontrado un playlist muy bueno en Babelboo. Míratelo.' + escape('\n\n') + data.title + ': ' + 'http://www.babelboo.com' + path;
                    $window.open(url, '_blank');
                });
            } else if (path == '/tv') {
                var url = "mailto:?subject=" + 'Nueva web para aprender inglés' + "&body=" + 'Mírate Boo TV. Es una manera genial de mejorar el inglés sin preocuparte.' + escape('\n\n') + 'http://www.babelboo.com/tv';
                $window.open(url, '_blank');
            } else {
                var url = "mailto:?subject=" + "Nueva web para aprender inglés" + "&body=" + 'He descubierto Babelboo. Es una manera genial de mejorar tu inglés.' + escape('\n\n') + 'Dale al enlace para entrar:' + escape('\n\n') + 'http://www.babelboo.com';

                $window.open(url, '_blank');
            }
        };

    });
})();
