(function(){
    var app = angular.module('mayhem', []);
    
    app.controller('PlaylistsController', ['$http', function($http){
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
        
    }]);
    
    app.directive('playlistCard', function(){
        return {
            restrict: 'E',
            templateUrl: 'directives/playlist-card.html'
        }
    });
    
})();