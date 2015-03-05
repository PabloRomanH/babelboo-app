describe("play controller", function() {
    beforeEach(module('player'));
    beforeEach(module('babelbooapp'));

    var route = {
        reload: function() {}
    };

    var userData = {
        username: 'guest',
        points: 25,
        _id: 3,
        playlistprogress: {
            "123A": 0.5
        }
    };
    var fillUser = function(callback) {
        callback(userData);
    }
    var user = { fillUser: fillUser, data: userData, correctAnswer: sinon.spy() };

    var ctrl;
    var scope;
    var analytics;
    var routeParams;
    var playlists;
    var playlist = {
        "_id": "123A",
        "entries": [
            {
                "id": "xkiYn8LFFQY",
                "correctanswer": 2
            },
            {
                "id": "wI5gVEzrc_Q",
                "correctanswer": 1
            }
        ],
    };

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        analytics = {
            eventTrack: sinon.spy()
        };

        routeParams = {
            playlistId: "123A"
        };

        playlists = {
            getPlaylist: function (playlistIdOrSlug, callback) {
                callback(playlist);
            }
        };

        ctrl = $controller('PlayController', {
            user: user,
            playlists: playlists,
            $scope: scope,
            $analytics: analytics
        });
    }));


    it('loads playlist', function() {
        expect(ctrl.playlist).to.equal(playlist);
    });

    it('sets playlistId', function() {
        expect(ctrl.playlistId).to.equal(playlist._id);
    });

    afterEach (function() {
        analytics.eventTrack.reset();
        user.correctAnswer.reset();
    });
});
