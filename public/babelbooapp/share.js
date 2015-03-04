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
                playlists.playById(match[1]).success(function(data){
                    $window.open('https://twitter.com/intent/tweet?text=Cool playlist in Babelboo: ' + data.title + '&url=http://www.babelboo.com' + path, '_blank');
                });
            } else if (path == '/tv') {
                var message = 'Learn English without worries with Boo TV';
                $window.open('https://twitter.com/intent/tweet?text=' + message + '&url=http://www.babelboo.com' + path, '_blank');
            } else {
                var generalMessage = 'Have fun, learn English with Babelboo';
                var generalUrl = 'http://www.babelboo.com';

                $window.open('https://twitter.com/intent/tweet?text=' + generalMessage + '&url=' + generalUrl, '_blank');
            }
        };

        controller.email = function() {
            var path = $location.path();
            if (/\/play\//.test(path)) {
                var match = path.match(/\/play\/(.*)/);
                playlists.playById(match[1]).success(function(data){
                    var url = "mailto:?subject=" + escape("Check out this playlist") + "&body=" + escape('Hey, check out this playlist in Babelboo:\n\n' + data.title + ': ' + 'http://www.babelboo.com' + path);
                    $window.open(url, '_blank');
                });
            } else if (path == '/tv') {
                var url = "mailto:?subject=" + escape("Check out Boo TV") + "&body=" + escape('Check Boo TV. It\'s a great way to improve your English without worries.\n\nhttp://www.babelboo.com/tv');
                $window.open(url, '_blank');
            } else {
                var url = "mailto:?subject=" + escape("Check out Babelboo") + "&body=" + escape('Check Babelboo, a great way to improve your English.\n\nhttp://www.babelboo.com');

                $window.open(url, '_blank');
            }
        };

    });
})();
