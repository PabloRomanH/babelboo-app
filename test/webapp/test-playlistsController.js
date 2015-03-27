describe("controllers", function() {
    beforeEach(module('playlists'));
    beforeEach(module('babelbooapp'));

    var sampleRecommended = ['aPlaylist', 'anotherPlaylist'];
    var playlistsService;
    var dismissCallback;
    var analyticsService;

    beforeEach(inject(function($controller, $rootScope) {
        var scope = $rootScope.$new();

        analyticsService = {
            eventTrack: sinon.spy()
        };

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
            tags: tags,
            $analytics: analyticsService
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

    describe('log whether the playlist was started from recommended', function() {
        it('started from a recommendation', function() {
            var slug = 'a_playlist_slug';
            ctrl.playClicked(true, slug);
            expect(analyticsService.eventTrack.calledWithExactly('recommendation', {category: 'startPlaylist', label: slug})).to.be.true;
        });

        it('started from newest', function() {
            var slug = 'another_playlist_slug';
            ctrl.playClicked(undefined, slug);
            expect(analyticsService.eventTrack.calledWithExactly('newest', {category: 'startPlaylist', label: slug})).to.be.true;
        });

    });

});
