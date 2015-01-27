describe("controllers", function() {
    beforeEach(module('playlists'));
    beforeEach(module('babelbooapp'));

    var samplePopular = [];

    beforeEach(inject(function($controller, $rootScope) {
        var scope = $rootScope.$new();
        var playlistsService = {
            getPopular: function (playlistId) {
                return {
                    success: function (callback) {
                        callback(samplePopular);
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

    it('loads popular playlists', function() {
        expect(ctrl.popular).to.equal(samplePopular);
    });

});
