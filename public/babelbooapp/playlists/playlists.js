(function() {
    var app = angular.module('playlists', []);
    app.controller('PlaylistsController', function($http){
        var controller = this;
        controller.playlists = [];

        function getList () {
            $http.get('/api/playlist').success(function(data){
                controller.playlists = data;
            });
        }

        this.delete = function(playlistId) {
            $http.delete('/api/playlist/' + playlistId).success(function() {
                getList();
            });
        }
        
        function pad (number) {
            var str = '00' + String(number);
            
            return str.substr(str.length - 2);
        }
        
        this.renderTime = function (seconds) {
            if (!seconds) return;
            
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            seconds = (seconds % 3600) % 60;
            
            seconds = pad(seconds);
            
            if (hours !== 0) {
                minutes = pad(minutes);
                return hours + ':' + minutes + ':' + seconds;
            }
            return minutes + ':' + seconds;
        }

        getList();
    });
    
    app.directive('playlistCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlists/playlist-card.html'
        };
    });
})();
