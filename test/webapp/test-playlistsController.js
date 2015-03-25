describe("controllers", function() {
    beforeEach(module('playlists'));
    beforeEach(module('babelbooapp'));

    var sampleRecommended = [];

    beforeEach(inject(function($controller, $rootScope) {
        var scope = $rootScope.$new();
        var playlistsService = {
            getRecommended: function (playlistId) {
                return {
                    success: function (callback) {
                        callback(sampleRecommended);
                    }
                }
            },
            getWithTagLevel: function (tag, level) {
                return {
                    success: function (callback) {
                        callback([]);
                    }
                }
            }
        };

        var tags = { getTags: function() {} };
        var user = { fillUser: function() {} };

        ctrl = $controller('PlaylistsController', {
            user: user,
            playlists: playlistsService,
            tags: tags
        });

    }));

    it('loads recommended playlists', function() {
        expect(ctrl.recommended).to.equal(sampleRecommended);
    });

});
