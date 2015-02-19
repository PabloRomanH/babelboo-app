describe("landing controller", function() {
    beforeEach(module('landing'));

    var ctrl;
    var analytics;
    var playlistsService;
    var locationService;

    var EASY_PLAYLIST = {_id: '80aeiaoe'};
    var MEDIUM_PLAYLIST = {_id: '0i7oeuaoe7u'};
    var HARD_PLAYLIST = {_id: 'afioe9uai9'};

    var EASY_PATH = '/play/' + EASY_PLAYLIST._id;
    var MEDIUM_PATH = '/play/' + MEDIUM_PLAYLIST._id;
    var HARD_PATH = '/play/' + HARD_PLAYLIST._id;

    beforeEach(inject(function($controller) {
        analytics = { eventTrack: sinon.spy() };

        playlistsService = {
            getPopular: sinon.spy(function (numResults, level) {
                return {
                    success: function (callback) {
                        switch(level) {
                            case 1:
                                callback([EASY_PLAYLIST]);
                                break;
                            case 2:
                                callback([MEDIUM_PLAYLIST]);
                                break;
                            case 3:
                                callback([HARD_PLAYLIST]);
                                break;
                        }
                    }
                }
            })
        };

        locationService = { path: sinon.spy() };

        var levelNamesService = {};

        ctrl = $controller('LandingController', {
            $analytics: analytics,
            playlists: playlistsService,
            levelNames: levelNamesService,
            $location: locationService
        });
    }));

    it('level selector is hidden by default', function() {
        expect(ctrl.levelSelectorVisible).to.be.false;
    });

    it('shows level selector on button click', function() {
        ctrl.showLevelSelector();
        expect(ctrl.levelSelectorVisible).to.be.true;
    });

    it('playlists service is called with the right parameters', function() {
        expect(playlistsService.getPopular.calledWithExactly(1, 1)).to.be.true;
        expect(playlistsService.getPopular.calledWithExactly(1, 2)).to.be.true;
        expect(playlistsService.getPopular.calledWithExactly(1, 3)).to.be.true;
    });

    it('gets playlists from service', function() {
        expect(ctrl.easyPlaylist).to.equal(EASY_PLAYLIST);
        expect(ctrl.mediumPlaylist).to.equal(MEDIUM_PLAYLIST);
        expect(ctrl.hardPlaylist).to.equal(HARD_PLAYLIST);
    });

    it('navigates to easy path', function() {
        ctrl.startEasyPlaylist();
        expect(locationService.path.calledWithExactly(EASY_PATH)).to.be.true;
    });

    it('navigates to medium path', function() {
        ctrl.startMediumPlaylist();
        expect(locationService.path.calledWithExactly(MEDIUM_PATH)).to.be.true;
    });

    it('navigates to hard path', function() {
        ctrl.startHardPlaylist();
        expect(locationService.path.calledWithExactly(HARD_PATH)).to.be.true;
    });

    it('tracks navigation to easy path', function() {
        ctrl.startEasyPlaylist();
        expect(analytics.eventTrack.calledWithExactly('startEasyPlaylist', {category: 'conversion'})).to.be.true;
    });

    it('tracks navigation to medium path', function() {
        ctrl.startMediumPlaylist();
        expect(analytics.eventTrack.calledWithExactly('startMediumPlaylist', {category: 'conversion'})).to.be.true;
    });

    it('tracks navigation to hard path', function() {
        ctrl.startHardPlaylist();
        expect(analytics.eventTrack.calledWithExactly('startHardPlaylist', {category: 'conversion'})).to.be.true;
    });

});
