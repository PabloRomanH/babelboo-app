describe("controllers", function() {
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

    describe("play controller", function() {
        var ctrl;
        var scope;
        var analytics;
        var routeParams;
        var playlists;
        var playlist = {
            "_id": "54808ae31249b9630cbedcf4",
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
                getById: function (playlistId) {
                    return {
                        success: function (callback) {
                            callback(playlist);
                        }
                    };
                }
            };

            ctrl = $controller('PlayController', {
                user: user,
                playlists: playlists,
                $scope: scope,
                $analytics: analytics,
            });
        }));

        afterEach (function() {
            analytics.eventTrack.reset();
            user.correctAnswer.reset();
        });

        it('loads playlist', function() {
            expect(ctrl.playlist).to.equal(playlist);
        });
    });
});
