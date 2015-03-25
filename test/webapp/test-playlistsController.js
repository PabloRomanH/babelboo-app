describe("controllers", function() {
    beforeEach(module('playlists'));
    beforeEach(module('babelbooapp'));

    var sampleRecommended = ['aPlaylist', 'anotherPlaylist'];
    var playlistsService;
    var dismissCallback;

    beforeEach(inject(function($controller, $rootScope) {
        var scope = $rootScope.$new();
        playlistsService = {
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
            },
            dismissRecommendation: sinon.spy(function (id, callback) {
                dismissCallback = callback;
            })
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

    describe('dismiss recommendations', function() {
        it('calls service to dismiss a recommendation', function() {
            var aplaylistId = '1nt2h3i4ds1hd';
            ctrl.dismiss(aplaylistId);
            expect(playlistsService.dismissRecommendation.calledWith(aplaylistId)).to.be.true;
        });

        it('refreshes the recommendations after dismissing one', function() {
            var sampleRecommendedOld = sampleRecommended;
            sampleRecommended = ['someplaylist'];
            var aplaylistId = '1nt2h3i4ds1hd';
            ctrl.dismiss(aplaylistId);

            expect(ctrl.recommended).to.equal(sampleRecommendedOld);
            dismissCallback();
            expect(ctrl.recommended).to.equal(sampleRecommended);
        });

    });

});
