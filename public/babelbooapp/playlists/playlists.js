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

        getList();
    });
    
    app.directive('playlistCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlists/playlist-card.html'
        };
    });
})();
