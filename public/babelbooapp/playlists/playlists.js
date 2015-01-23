(function() {
    var app = angular.module('playlists', []);
    app.controller('PlaylistsController', function($analytics, playlists, tags, renderTime, levelNames, user){
        var controller = this;
        this.playlists = null;
        this.popular = null;
        this.tags = []
        this.selectedLevel = -1;
        this.selectedTag = '';
        controller.levelNames = levelNames.names;
        controller.renderTime = renderTime;
        controller.userData = {}
        controller.showPopular = false;
        controller.popular = [];

        var NUM_POPULAR_RESULTS = 4;

        user.fillUser (function (data) {
            controller.userData = data;
        });

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

        playlists.getPopular(NUM_POPULAR_RESULTS).success(function(data) {
            controller.popular = data;
            controller.showPopular = isPopularVisible();
        });

        getList();

        function isPopularVisible() {
            return (controller.popular.length > 0)
                    && !controller.selectedTag
                    && (controller.selectedLevel == -1);
        }

        function getList() {
            playlists.getWithTagLevel(controller.selectedTag, controller.selectedLevel).success(function(data){
                controller.playlists = data;
                controller.showPopular = isPopularVisible();
            });
        }
    });

    app.directive('playlistCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlists/playlist-card.html'
        };
    });
})();
