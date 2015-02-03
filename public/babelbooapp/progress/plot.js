(function() {
    var app = angular.module('plot', ['chart.js']);

    app.controller('PlotController', function(plot, now, ranking){
        var controller = this;
        controller.period = 'month';

        var golds = 0;
        var silvers = 0;
        var bronzes = 0;

        controller.series = ['Gold', 'Silver', 'Bronze'];
        controller.colours = [
            {
                fillColor: "rgba(255, 234, 50, 1)",
                strokeColor: "rgba(254, 214, 20,1)",
                pointColor: "rgba(254, 214, 20,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(254, 214, 20,0.8)"
            },
            {
                fillColor: "rgba(231, 254, 242, 1)",
                strokeColor: "rgba(211, 224, 222,1)",
                pointColor: "rgba(211, 224, 222,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(211, 224, 222,0.8)"
            },
            {
                fillColor: "rgba(240, 175, 142, 1)",
                strokeColor: "rgba(220, 155, 122,1)",
                pointColor: "rgba(220, 155, 122,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220, 155, 122,0.8)"
            },
        ];

        controller.plotOptions = {
            showTooltips: false,
            datasetStrokeWidth: 6
        };

        initPlot();

        ranking.getUserRank(function(userRank) {
            golds = userRank.golds;
            silvers = userRank.silvers;
            bronzes = userRank.bronzes;
            update();
        });

        controller.setPeriod = function(period) {
            controller.period = period;
            update();
        }

        function update() {
            plot.getData(controller.period).success(function(data) {
                var currGolds = golds;
                var currSilvers = silvers;
                var currBronzes = bronzes;

                initPlot();

                if(controller.period == 'month') {
                    var nDataDays = data[0].length;
                    var N_WEEKS = 4;

                    for (var weekIndex = N_WEEKS - 1; weekIndex >= 0; weekIndex--) {
                        controller.data[0][weekIndex] = currGolds + currSilvers + currBronzes;
                        controller.data[1][weekIndex] = currSilvers + currBronzes;
                        controller.data[2][weekIndex] = currBronzes;

                        var lastDayOfWeek = nDataDays - 7 * (N_WEEKS - weekIndex - 1);
                        var firstDayOfWeek = lastDayOfWeek - 7;
                        for (var dayIndex = firstDayOfWeek; dayIndex < lastDayOfWeek; dayIndex++) {
                            currGolds -= data[0][dayIndex];
                            currSilvers -= data[1][dayIndex];
                            currBronzes -= data[2][dayIndex];

                            currGolds = Math.max(currGolds, 0);
                            currSilvers = Math.max(currSilvers, 0);
                            currBronzes = Math.max(currBronzes, 0);
                        }
                    }
                } else {
                    for (var dayIndex = 6; dayIndex >= 0; dayIndex--) {
                        controller.data[0][dayIndex] = currGolds + currSilvers + currBronzes;
                        controller.data[1][dayIndex] = currSilvers + currBronzes;
                        controller.data[2][dayIndex] = currBronzes;

                        currGolds -= data[0][dayIndex];
                        currSilvers -= data[1][dayIndex];
                        currBronzes -= data[2][dayIndex];

                        currGolds = Math.max(currGolds, 0);
                        currSilvers = Math.max(currSilvers, 0);
                        currBronzes = Math.max(currBronzes, 0);
                    }
                }
            });
        }

        function initPlot() {
            if (controller.period == 'month') {
                controller.data = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
                setMonthLabels();
            } else {
                controller.data = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
                setWeekLabels();
            }
        }

        function setMonthLabels() {
            controller.labels = ['3 weeks ago', '2 weeks ago', 'last week', 'this week'];
        }

        function setWeekLabels() {
            var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            controller.labels = [];

            for (var i = 0; i < weekday.length; i++) {
                var d = now();
                d.setDate(d.getDate() - (weekday.length - i - 1));
                controller.labels[i] = weekday[d.getDay()];
            }

            controller.labels[6] = 'Today';
        }

    });
})();
