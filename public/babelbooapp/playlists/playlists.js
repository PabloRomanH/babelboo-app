(function() {
    var app = angular.module('playlists', []);
    app.controller('PlaylistsController', function($analytics, playlists, tags, renderTime, levelNames){
        var controller = this;
        this.playlists = null;
        this.tags = []
        this.selectedLevel = -1;
        this.selectedTag = '';
        controller.levelNames = levelNames.names;
        controller.renderTime = renderTime;

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

        tags.getTags(function(data){
            controller.tags = data;
        });

        function getList() {
            playlists.getWithTagLevel(controller.selectedTag, controller.selectedLevel).success(function(data){
                controller.playlists = data;
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
