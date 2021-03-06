(function() {
    var app = angular.module('playlists', []);
    app.controller('PlaylistsController', function($analytics, playlists, tags, renderTime, levelNames, user){
        var controller = this;
        this.playlists = null;
        this.recommended = null;
        this.tags = [];
        this.selectedLevel = -1;
        this.selectedTag = '';
        controller.levelNames = levelNames.names;
        controller.renderTime = renderTime;
        controller.userData = {};
        controller.showRecommended = false;
        controller.recommended = [];

        var NUM_RECOMMENDED_RESULTS = 4;

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

            updateRecommended();
            getList();
        };

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
        };

        this.dismiss = function(playlistId) {
            playlists.dismissRecommendation(playlistId, updateRecommended);
        };

        this.playClicked = function (isRecommendation, slug) {
            if (isRecommendation) {
                $analytics.eventTrack('recommendation', {category: 'startPlaylist', label: slug});
            } else {
                $analytics.eventTrack('newest', {category: 'startPlaylist', label: slug});
            }
        };

        tags.getTags(function(data){
            controller.tags = data;
        });

        updateRecommended();

        function updateRecommended() {
            playlists.getRecommended(NUM_RECOMMENDED_RESULTS, controller.selectedLevel).success(function(data) {
                controller.recommended = data;
                controller.showRecommended = isRecommendedVisible();
            });
        }

        getList();

        function isRecommendedVisible() {
            return controller.recommended.length > 0
                    && !controller.selectedTag;
        }

        function getList() {
            playlists.getWithTagLevel(controller.selectedTag, controller.selectedLevel).success(function(data){
                controller.playlists = data;
                controller.showRecommended = isRecommendedVisible();
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
