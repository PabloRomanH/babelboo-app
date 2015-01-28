describe('RankingController', function() {
    beforeEach(module('ranking'));

    var ctrl;

    var ranking = 'd7aoy8euaoe7';

    var rankingService = {
        getRanking: function () {
            return {
                success: function (callback) {
                    callback(ranking);
                }
            }
        }
    };

    var userData = {
        username: 'user',
    };

    var userService = {
        fillUser: function(callback) {
            callback({ username: 'user' });
        }
    };

    describe('Happy path', function() {
        var aUser;

        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 8};
            ranking = [
                {username: 'u1', ranking: 1},
                {username: 'u2', ranking: 2},
                {username: 'u3', ranking: 3},
                {username: 'u4', ranking: 4},
                {username: 'u5', ranking: 5},
                {username: 'u6', ranking: 6},
                {username: 'u7', ranking: 7},
                aUser,
                {username: 'u9', ranking: 9},
                {username: 'u10', ranking: 10},
                {username: 'u11', ranking: 11},
                {username: 'u12', ranking: 12},
                {username: 'u13', ranking: 13},
                {username: 'u14', ranking: 14}
            ];

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('topRanked with the top three users', function() {
            expect(ctrl.topRanked).to.deep.equal(ranking.slice(0,3));
        });

        it('aboveUser containing the two users above', function() {
            expect(ctrl.aboveUser).to.deep.equal(ranking.slice(5,7));
        });

        it('the user\'s ranking', function() {
            expect(ctrl.userRank).to.deep.equal(aUser);
        });

        it('belowUser with a padding of 4', function() {
            expect(ctrl.belowUser).to.deep.equal(ranking.slice(8,12));
        });
    });

    describe('User is first', function() {
        var aUser;

        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 1};
            ranking = [
                aUser,
                {username: 'u2', ranking: 2},
                {username: 'u3', ranking: 3},
                {username: 'u4', ranking: 4},
                {username: 'u5', ranking: 5},
                {username: 'u6', ranking: 6},
                {username: 'u7', ranking: 7},
                {username: 'u8', ranking: 8},
                {username: 'u9', ranking: 9},
                {username: 'u10', ranking: 10},
                {username: 'u11', ranking: 11},
                {username: 'u12', ranking: 12},
                {username: 'u13', ranking: 13},
                {username: 'u14', ranking: 14}
            ];

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('topRanked is empty', function() {
            expect(ctrl.topRanked).is.empty;
        });

        it('aboveUser is empty', function() {
            expect(ctrl.aboveUser).is.empty;
        });

        it('the user\'s ranking', function() {
            expect(ctrl.userRank).to.deep.equal(aUser);
        });

        it('belowUser with a padding of 9', function() {
            expect(ctrl.belowUser).to.deep.equal(ranking.slice(1,10));
        });
    });

    describe('User is second', function() {
        var aUser;

        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 2};
            ranking = [
                {username: 'u1', ranking: 1},
                aUser,
                {username: 'u3', ranking: 3},
                {username: 'u4', ranking: 4},
                {username: 'u5', ranking: 5},
                {username: 'u6', ranking: 6},
                {username: 'u7', ranking: 7},
                {username: 'u8', ranking: 8},
                {username: 'u9', ranking: 9},
                {username: 'u10', ranking: 10},
                {username: 'u11', ranking: 11},
                {username: 'u12', ranking: 12},
                {username: 'u13', ranking: 13},
                {username: 'u14', ranking: 14}
            ];

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('topRanked contains first', function() {
            expect(ctrl.topRanked).to.deep.equal(ranking.slice(0,1));
        });

        it('aboveUser is empty', function() {
            expect(ctrl.aboveUser).is.empty;
        });

        it('the user\'s ranking', function() {
            expect(ctrl.userRank).to.deep.equal(aUser);
        });

        it('belowUser with a padding of 8', function() {
            expect(ctrl.belowUser).to.deep.equal(ranking.slice(2,10));
        });
    });

    describe('User must be displayed below the half of the list (no aboveUser)', function() {
        var aUser;

        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 4};
            ranking = [
                {username: 'u1', ranking: 1},
                {username: 'u2', ranking: 2},
                {username: 'u3', ranking: 3},
                aUser,
                {username: 'u5', ranking: 5},
                {username: 'u6', ranking: 6},
                {username: 'u7', ranking: 7},
                {username: 'u8', ranking: 8},
                {username: 'u9', ranking: 9},
                {username: 'u10', ranking: 10},
                {username: 'u11', ranking: 11},
                {username: 'u12', ranking: 12},
                {username: 'u13', ranking: 13},
                {username: 'u14', ranking: 14}
            ];

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('topRanked contains top three', function() {
            expect(ctrl.topRanked).to.deep.equal(ranking.slice(0,3));
        });

        it('aboveUser is empty', function() {
            expect(ctrl.aboveUser).is.empty;
        });

        it('the user\'s ranking', function() {
            expect(ctrl.userRank).to.deep.equal(aUser);
        });

        it('belowUser with a padding of 6', function() {
            expect(ctrl.belowUser).to.deep.equal(ranking.slice(4,10));
        });
    });

    describe('User must be displayed above the half of the list (1-aboveUser)', function() {
        var aUser;

        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 5};
            ranking = [
                {username: 'u1', ranking: 1},
                {username: 'u2', ranking: 2},
                {username: 'u3', ranking: 3},
                {username: 'u4', ranking: 4},
                aUser,
                {username: 'u6', ranking: 6},
                {username: 'u7', ranking: 7},
                {username: 'u8', ranking: 8},
                {username: 'u9', ranking: 9},
                {username: 'u10', ranking: 10},
                {username: 'u11', ranking: 11},
                {username: 'u12', ranking: 12},
                {username: 'u13', ranking: 13},
                {username: 'u14', ranking: 14}
            ];

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('topRanked contains top three', function() {
            expect(ctrl.topRanked).to.deep.equal(ranking.slice(0,3));
        });

        it('aboveUser contains 4th', function() {
            expect(ctrl.aboveUser).to.deep.equal(ranking.slice(3,4));
        });

        it('the user\'s ranking', function() {
            expect(ctrl.userRank).to.deep.equal(aUser);
        });

        it('belowUser with a padding of 5', function() {
            expect(ctrl.belowUser).to.deep.equal(ranking.slice(5,10));
        });
    });

    describe('User must be displayed below the half of the list', function() {
        var aUser;

        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 11};
            ranking = [
                {username: 'u1', ranking: 1},
                {username: 'u2', ranking: 2},
                {username: 'u3', ranking: 3},
                {username: 'u4', ranking: 4},
                {username: 'u5', ranking: 5},
                {username: 'u6', ranking: 6},
                {username: 'u7', ranking: 7},
                {username: 'u8', ranking: 8},
                {username: 'u9', ranking: 9},
                {username: 'u10', ranking: 10},
                aUser,
                {username: 'u12', ranking: 12},
                {username: 'u13', ranking: 13},
                {username: 'u14', ranking: 14}
            ];

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('topRanked contains top three', function() {
            expect(ctrl.topRanked).to.deep.equal(ranking.slice(0,3));
        });

        it('aboveUser contains an extra user', function() {
            expect(ctrl.aboveUser).to.deep.equal(ranking.slice(7,10));
        });

        it('the user\'s ranking', function() {
            expect(ctrl.userRank).to.deep.equal(aUser);
        });

        it('belowUser contains the rest of the list', function() {
            expect(ctrl.belowUser).to.deep.equal(ranking.slice(11,14));
        });
    });

    describe('User is at the bottom of the list', function() {
        var aUser;

        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 14};
            ranking = [
                {username: 'u1', ranking: 1},
                {username: 'u2', ranking: 2},
                {username: 'u3', ranking: 3},
                {username: 'u4', ranking: 4},
                {username: 'u5', ranking: 5},
                {username: 'u6', ranking: 6},
                {username: 'u7', ranking: 7},
                {username: 'u8', ranking: 8},
                {username: 'u9', ranking: 9},
                {username: 'u10', ranking: 10},
                {username: 'u11', ranking: 11},
                {username: 'u12', ranking: 12},
                {username: 'u13', ranking: 13},
                aUser,
            ];

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('topRanked contains top three', function() {
            expect(ctrl.topRanked).to.deep.equal(ranking.slice(0,3));
        });

        it('aboveUser is empty', function() {
            expect(ctrl.aboveUser).to.deep.equal(ranking.slice(7,13));
        });

        it('the user\'s ranking', function() {
            expect(ctrl.userRank).to.deep.equal(aUser);
        });

        it('belowUser is empty', function() {
            expect(ctrl.belowUser).is.empty;
        });
    });

    describe('Weekly, monthly and alltime ranking', function() {
        var aUser;
        beforeEach(inject(function($controller) {
            aUser = {username: 'user', ranking: 14};
            var ranking = {
                week: [
                    {username: 'u1', ranking: 1},
                    aUser
                ],
                month: [
                    {username: 'u2', ranking: 1},
                    aUser
                ],
                alltime: [
                    {username: 'u3', ranking: 1},
                    aUser
                ]
            };

            var rankingService = {
                getRanking: function (period) {
                    return {
                        success: function (callback) {
                            callback(ranking[period]);
                        }
                    }
                }
            };

            ctrl = $controller('RankingController', {ranking: rankingService, user: userService});
        }));

        it('selects week by default', function() {
            expect(ctrl.topRanked[0]).to.deep.equal({username: 'u1', ranking: 1});
        });

        it('correctly selects month', function() {
            ctrl.setPeriod('month');
            expect(ctrl.topRanked[0]).to.deep.equal({username: 'u2', ranking: 1});
        });

        it('correctly selects alltime', function() {
            ctrl.setPeriod('alltime');
            expect(ctrl.topRanked[0]).to.deep.equal({username: 'u3', ranking: 1});
        });

        it('correctly selects week', function() {
            ctrl.setPeriod('week');
            expect(ctrl.topRanked[0]).to.deep.equal({username: 'u1', ranking: 1});
        });
    });


});
