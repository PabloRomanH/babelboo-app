(function() {
    var app = angular.module('playlists', []);
    app.controller('PlaylistsController', function($http, $window){
        var controller = this;
        this.playlists = [];
        this.tags = []
        this.selectedLevel = '';
        this.selectedTags = {};
        
        this.setLevel = function(level) {
            this.selectedLevel = level;
            getList();
        }

        this.toggleTag = function(tag) {
            if (tag in this.selectedTags) {
                delete this.selectedTags[tag];
            } else {
                this.selectedTags[tag] = true;
            }
            
            getList();
        }

        this.delete = function(playlistId) {
            if ( $window.confirm('Are you sure you want to delete playlist ' + playlistId + '?') ) {
                $http.delete('/api/playlist/' + playlistId).success(function() {
                    getList();
                });
            }
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

        function getList() {
            var tags = [];
            
            for (tag in controller.selectedTags) {
                tags.push(tag);
            }
            
            var query = '/api/playlist/?tags=' + tags.join(',') + '&level=' + controller.selectedLevel;
            $http.get(query).success(function(data){
                controller.playlists = data;
            });
        }
        
        function getTags () {
            $http.get('/api/tag').success(function(data){
                controller.tags = data;
            });
        }
        
        function pad (number) {
            var str = '00' + String(number);
            
            return str.substr(str.length - 2);
        }
        
        getTags();
        getList();

    });
    
    app.directive('playlistCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlists/playlist-card.html'
        };
    });
})();
