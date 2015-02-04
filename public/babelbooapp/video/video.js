(function() {
    var app = angular.module('video', []);

    app.controller('VideoController', function ($scope, $http, levelNames, videos) {
        var controller = this;
        controller.ids = [];
        controller.levelNames = levelNames.names;
        controller.level = -1;
        controller.total = 0;
        controller.done = 0;
        
        var requests = [];

        function search(query) {
            controller.total = 0;
            controller.done = 0;
            var i = 0;
            function listVideos() {
                if (i >= query.length) {
                    return;
                }
                var ids = query.slice(i, i + 50);
                i += 50;
                var request = gapi.client.youtube.videos.list({
                    id: ids.join(','),
                    part: 'snippet'
                });
                console.log('pushed');
                request.execute(submitResults);
            }

            function submitResults(response) {
                console.log('executed');
                var validated = [];
                controller.total += response.result.items.length;
                for (var i in response.result.items) {
                    controller.done++;
                    validated.push({
                        id: response.result.items[i].id,
                        title: response.result.items[i].snippet.title,
                        level: controller.level
                    });
                }

                videos.addLoose(validated);

                setTimeout(listVideos, 100);
            }

            listVideos();
        }

        this.submit = function() {
            search(controller.ids.split("\n"));
        };

        $scope.parseInt = function(number) {
            return parseInt(number, 10);
        }
    });
})();

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

function handleClientLoad() {
    gapi.client.setApiKey(API_KEY);
    gapi.client.load('youtube', 'v3');
}
