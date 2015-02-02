(function() {
    var app = angular.module('plot', ['chart.js']);

    app.controller('PlotController', function(plot, now){
        var controller = this;
        controller.period = 'month';

        controller.data = [[0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0]];
        controller.series = ['Gold', 'Silver', 'Bronze'];
        controller.colours = [
            {
                fillColor: "rgba(254, 214, 20,0.2)",
                strokeColor: "rgba(254, 214, 20,1)",
                pointColor: "rgba(254, 214, 20,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(254, 214, 20,0.8)"
            },
            {
                fillColor: "rgba(211, 224, 222,0.2)",
                strokeColor: "rgba(211, 224, 222,1)",
                pointColor: "rgba(211, 224, 222,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(211, 224, 222,0.8)"
            },
            {
                fillColor: "rgba(220, 155, 122,0.2)",
                strokeColor: "rgba(220, 155, 122,1)",
                pointColor: "rgba(220, 155, 122,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220, 155, 122,0.8)"
            },
        ];

        setWeekLabels();
        update();

        controller.setPeriod = function(period) {
            controller.period = period;
            update();
        }

        var N_WEEKS = 4;

        function update() {
            plot.getData(controller.period).success(function(data) {
                if(controller.period == 'month') {
                    controller.data = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
                    for (var i = 0; i / 7 < N_WEEKS; i++) {
                        var week = N_WEEKS - 1 - Math.floor(i / 7);

                        for (var j = 0; j < data.length; j++) {
                            controller.data[j][week] += data[j][data[0].length - 1 - i];
                        }
                    }

                    controller.labels = ['3 weeks ago', '2 weeks ago', 'last week', 'this week'];
                } else {
                    controller.data = data;
                    setWeekLabels();
                }
            });
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
