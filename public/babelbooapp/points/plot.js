(function() {
    var app = angular.module('plot', ['chart.js']);

    app.controller('PlotController', function(plot){
        var controller = this;
        // controller.data;
        controller.period = 'week';

        controller.labels = ['sample 1', 'sample 2', 'sample 3', 'sample 4'];
        controller.data = [[1, 2, 3, 2], [2, 3, 4, 1], [3, 1, 1, 4]];
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
                console.log('hello');
                controller.data = data;
                controller.labels = [];
                for (var i = 0; i < data[0].length; i++) controller.labels[i] = i;
                console.log(controller.data);
                console.log(controller.labels);
            });
        }

    });
})();
