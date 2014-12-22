(function() {
    var app = angular.module('playlists', []);
    app.controller('PlaylistsController', function($http, $window, $analytics, $scope, $location){
        var controller = this;
        this.playlists = null;
        this.tags = []
        this.selectedLevel = -1;
        this.selectedTag = '';
        controller.levelNames = ['beginner', 'intermediate', 'advanced', 'fluent', 'native'];

        this.setLevel = function(level) {
            if (level == this.selectedLevel) {
                this.selectedLevel = -1;
            } else {
                this.selectedLevel = level;
                $analytics.eventTrack('setlevel', {
                    category: 'search', label: controller.levelNames[level]
                });
            }
            getList();
        }

        this.toggleTag = function(tag) {
            if (tag == this.selectedTag) {
                this.selectedTag = '';
            } else {
                this.selectedTag = tag;
                $analytics.eventTrack('addtag', {
                    category: 'search', label: tag
                });
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
            var query = '/api/playlist/?tags=' + controller.selectedTag + '&level=' + controller.selectedLevel;
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
