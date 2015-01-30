(function() {
    var app = angular.module('plot', ['chart.js']);

    app.controller('PlotController', function(plot){
        var controller = this;
        // controller.data;
        controller.period = 'week';

        controller.labels = [6,5,4,3,2,1,0];
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

        update();

        controller.setPeriod = function(period) {
            controller.period = period;
            update();
        }

        function update() {
            plot.getData(controller.period).success(function(data) {
                controller.data = data;
                controller.labels = [];

                for (var i = 0; i < data[0].length; i++) {
                    controller.labels[i] = controller.data[0].length - i -1;
                }
            });
        }

    });
})();
