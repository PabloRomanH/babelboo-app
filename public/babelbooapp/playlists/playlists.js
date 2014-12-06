(function() {
    var app = angular.module('playlists', []);
    app.controller('PlaylistsController', function($http){
        var controller = this;
        this.playlists = [];
        this.tags = []

        this.getList = function () {
            $http.get('/api/playlist').success(function(data){
                controller.playlists = data;
            });
        }
        
        this.getListWithTag = function (tag) {
            $http.get('/api/playlist/tag/' + tag).success(function(data){
                controller.playlists = data;
            });
        }
        
        function getTags () {
            $http.get('/api/tag').success(function(data){
                controller.tags = data;
            });
        }

        this.delete = function(playlistId) {
            $http.delete('/api/playlist/' + playlistId).success(function() {
                this.getList();
            });
        }
        
        function pad (number) {
            var str = String(number);
            
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

        getTags();
        this.getList();
    });
    
    app.directive('playlistCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlists/playlist-card.html'
        };
    });
})();
