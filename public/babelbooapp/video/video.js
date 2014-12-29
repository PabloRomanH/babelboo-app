(function() {
    var app = angular.module('video', []);

    app.controller('VideoController', function ($scope, $http, levelNames, videos) {
        var controller = this;
        controller.ids = [];
        controller.levelNames = levelNames.names;
        controller.level = -1;

        function search(query) {
            var request = gapi.client.youtube.videos.list({
                id: query.join(','),
                part: 'snippet'
            });

            request.execute(function(response) {
                var validated = [];
                for (var i in response.result.items) {
                    validated.push({
                        id: response.result.items[i].id,
                        title: response.result.items[i].snippet.title,
                        level: controller.level
                    });
                }

                videos.addLoose(validated);
            });
        }

        this.submit = function() {
            console.log(controller.ids.split("\n"));
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
