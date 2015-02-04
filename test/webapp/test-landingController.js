describe("landing controller", function() {
    beforeEach(module('landing'));

    var ctrl;
    var analytics;
    var signupService;
    var locationService;

    var EASY_PLAYLIST = {_id: '80aeiaoe'};
    var MEDIUM_PLAYLIST = {_id: '0i7oeuaoe7u'};
    var HARD_PLAYLIST = {_id: 'afioe9uai9'};
    var PLAYLISTS = [EASY_PLAYLIST, MEDIUM_PLAYLIST, HARD_PLAYLIST];
    var EASY_PATH = '/play/' + EASY_PLAYLIST._id;
    var MEDIUM_PATH = '/play/' + MEDIUM_PLAYLIST._id;
    var HARD_PATH = '/play/' + HARD_PLAYLIST._id;

    beforeEach(inject(function($controller) {
        analytics = { eventTrack: sinon.spy() };
        
        signupService = {
            signupPlaylists: function () {
                return {
                    success: function (callback) {
                        callback(PLAYLISTS);
                    }
                }
            }
        };
        
        locationService = { path: sinon.spy() };
        
        var levelNamesService = {};

        ctrl = $controller('LandingController', {
            $analytics: analytics,
            signup: signupService,
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
    
    it('gets playlists from service', function() {
        expect(ctrl.playlists).to.deep.equal(PLAYLISTS);
    });
    
    it('navigates to easy path', function() {
        ctrl.startEasyPlaylist();
        expect(locationService.path.called).to.be.true;
        expect(locationService.path.calledWith(EASY_PATH)).to.be.true;
    });
    
    it('navigates to medium path', function() {
        ctrl.startMediumPlaylist();
        expect(locationService.path.called).to.be.true;
        expect(locationService.path.calledWith(MEDIUM_PATH)).to.be.true;
    });
    
    it('navigates to hard path', function() {
        ctrl.startHardPlaylist();
        expect(locationService.path.called).to.be.true;
        expect(locationService.path.calledWith(HARD_PATH)).to.be.true;
    });

    it('tracks navigation to easy path', function() {
        ctrl.startEasyPlaylist();
        expect(analytics.eventTrack.called).to.be.true;
        expect(analytics.eventTrack.calledWith('startEasyPlaylist', {category: 'conversion'}));
    });
    
    it('tracks navigation to medium path', function() {
        ctrl.startMediumPlaylist();
        expect(analytics.eventTrack.called).to.be.true;
        expect(analytics.eventTrack.calledWith('startMediumPlaylist', {category: 'conversion'}));
    });
    
    it('tracks navigation to hard path', function() {
        ctrl.startHardPlaylist();
        expect(analytics.eventTrack.called).to.be.true;
        expect(analytics.eventTrack.calledWith('startHardPlaylist', {category: 'conversion'}));
    });
    
});
