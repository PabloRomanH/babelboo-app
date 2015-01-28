(function() {
    var app = angular.module('ranking', []);

    app.controller('RankingController', function(ranking, user){
        var N_TOP = 3;
        var N_PADDING_BEFORE = 2;
        var RANK_LENGTH = 10;

        var controller = this;
        controller.topRanked;
        controller.aboveUser;
        controller.userRank;
        controller.belowUser;

        controller.setPeriod = function(period) {
            controller.period = period;
            update();
        }

        var username;
        user.fillUser(function (data) {
            username = data.username;

            controller.setPeriod('week');
        });

        function update() {
            ranking.getRanking(controller.period).success(function(result) {
                var userRank;
                for(var i = 0; i < result.length; i++) {
                    if (result[i].username == username) {
                        userRank = i;
                        break;
                    }
                }
                
                var nTop = Math.min(N_TOP, userRank);
                var missingBelow = Math.max(0, RANK_LENGTH - N_TOP - N_PADDING_BEFORE - (result.length - userRank));
                var nAbove = Math.min(N_PADDING_BEFORE + missingBelow, Math.max(0, userRank - N_TOP));
                var nBelow = RANK_LENGTH - nTop - nAbove - 1;

                controller.topRanked = result.slice(0, nTop);
                controller.aboveUser = result.slice(userRank - nAbove, userRank);
                controller.userRank = result[userRank];
                controller.belowUser = result.slice(userRank + 1, userRank + nBelow + 1);

            });
        }
    });

})();
