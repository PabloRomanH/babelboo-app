(function() {
    var app = angular.module('playlist', []);

    app.controller('SearchController', function ($scope, $http, $location, $routeParams, levelNames) {
        var controller = this;
        controller.videos = [];
        controller.query = '';
        controller.playlist = {};
        controller.playlist.entries = [];
        controller.playlist.title = '';
        controller.playlist.tags = [];
        controller.playlist.level = '';
        controller.showWarning = false;
        controller.levelNames = levelNames.names;

        var playlistId = $routeParams.playlistId;

        var addedVideos = controller.playlist.entries;

        if (playlistId) {
            $http.get('/api/playlist/' + playlistId).success(function(data){
                controller.playlist = data;
                addedVideos = controller.playlist.entries;
                for (var i = 0; i < addedVideos.length; i++) {
                    if (!addedVideos[i].answers)
                        addedVideos[i].answers = [{text: ''},{text: ''},{text: ''}];
                }
            });
        }

        function parseYoutubeTime (duration) {
            var regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/; // convert ISO_8601 format of video length.

            var match = regex.exec(duration);
            var hours = Number(match[1] || 0); // get rid of undefined for elements that don't exist
            var minutes = Number(match[2] || 0);
            var seconds = Number(match[3] || 0);

            return hours * 3600 + minutes * 60 + seconds;
        }

        this.search = function(query) {
            var request = gapi.client.youtube.search.list({
                q: query,
                part: 'id,snippet',
                type: 'video'
            });

            request.execute(function(response) {
                var ids = [];

                var items = response.result.items.map(function (element, index) {
                    var result = {};
                    result.thumbnail = element.snippet.thumbnails.medium.url;
                    result.title = element.snippet.title;
                    result.description = element.snippet.description;
                    result.answers = [{text: ''},{text: ''},{text: ''}];
                    result.id = element.id.videoId;
                    ids.push(result.id)
                    result.source = "youtube";
                    return result;
                });
                controller.videos = items;
                $scope.$apply();

                // query to get the times
                var request2 = gapi.client.youtube.videos.list({
                    id: ids.join(','),
                    part: 'contentDetails'
                });

                request2.execute(function(response) {
                    var items = response.result.items.map(function (element, index) {
                        controller.videos[index].duration = parseYoutubeTime(element.contentDetails.duration);
                    });
                    $scope.$apply();
                });
            });
        }

        function pad (number) {
            var str = '00' + String(number);

            return str.substr(str.length - 2);
        }

        this.renderTime = function (seconds) {
            if (!seconds) return;

            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            seconds = (seconds % 3600) % 60;

            seconds = pad(seconds);

            if (hours !== 0) {
                minutes = pad(minutes);
                return hours + ':' + minutes + ':' + seconds;
            }
            return minutes + ':' + seconds;
        };

        this.add = function(video) {
            video.answers = [{text: ''},{text: ''},{text: ''}];
            addedVideos.push(angular.copy(video));
        };

        this.rmvideo = function(index) {
            addedVideos.splice(index, 1);
        };

        this.addanswer = function (video) {
            video.answers.push({text: ''})
        };

        this.rmanswer = function (video, answeridx) {
            if (video.answers.length > 3)
                video.answers.splice(answeridx, 1);
        };

        function parseTime(timestr) {
            var re = /(?:(\d+):)?(\d+)/;
            var matching = re.exec(timestr);
            var minutes;
            var seconds;

            try {
                if (matching[1] === undefined) {
                    minutes = 0;
                } else {
                    minutes = parseInt(matching[1]);
                }
                seconds = parseInt(matching[2]);
            } catch (err) {
                return NaN;
            }

            return minutes * 60 + seconds;
        }

        this.submit = function() {
            if (controller.playlist.title === '') {
                controller.warningMessage = 'Cannot create a playlist without a name.'
                controller.showWarning = true;
                return;
            }

            if (controller.playlist.level === '') {
                controller.warningMessage = 'Please choose a level for the playlist.'
                controller.showWarning = true;
                return;
            }

            if (addedVideos.length == 0) {
                controller.warningMessage = 'Cannot create a playlist without videos.';
                controller.showWarning = true;
                return;
            }

            if (!controller.playlist.publicationdate) {
                controller.playlist.publicationdate = new Date();
            } else {
                controller.playlist.publicationdate = new Date(controller.playlist.publicationdate);
            }

            var totalTime = 0;

            for (var i = 0; i < addedVideos.length; i++) {
                var video = addedVideos[i];
                var questiontext = video.question;
                var answers = video.answers;

                if (video.starttime) {
                    video.starttime = parseTime(video.starttime);
                    if (isNaN(video.starttime)) {
                        controller.warningMessage = 'Can\'t understand start time for video "' + video.title + '".';
                        controller.showWarning = true;
                        return;
                    }

                    if (video.starttime > video.duration) {
                        controller.warningMessage = 'Start time can\'t be after end of video: "' + video.title + '".';
                        controller.showWarning = true;
                        return;
                    }
                }

                if (video.endtime) {
                    video.endtime = parseTime(video.endtime);

                    if (isNaN(video.endtime)) {
                        controller.warningMessage = 'Can\t understand end time for video "' + video.title + '".';
                        controller.showWarning = true;
                        return;
                    }

                    if (video.endtime > video.duration) {
                        controller.warningMessage = 'End time can\'t be after end of video: "' + video.title + '".';
                        controller.showWarning = true;
                        return;
                    }

                    if (video.starttime && video.starttime > video.endtime) {
                        controller.warningMessage = 'End time can\'t be before start time for video: "' + video.title + '".';
                        controller.showWarning = true;
                        return;
                    }
                }

                var lStartTime = video.starttime? video.starttime: 0;
                var lEndTime = video.endtime? video.endtime: video.duration;
                var lDuration = lEndTime - lStartTime;
                totalTime += lDuration;


                if (!questiontext) { // in case the video doesn't include a question
                    controller.warningMessage = 'Write question and answers.';
                    controller.showWarning = true;
                    return;
                }

                var validanswers = [];
                for (var j = 0; j < answers.length; j++) {
                    if(!answers[j].text) {
                        answers.splice(j,1);
                        continue;
                    }
                }

                if (answers.length < 3) {
                    controller.warningMessage = 'Write at least three answers to question: ' + questiontext + '.';
                    controller.showWarning = true;
                    return;
                }

                if (typeof video.correctanswer === 'undefined') {
                    controller.warningMessage = 'Correct answer not selected for question: ' + questiontext + '.';
                    controller.showWarning = true;
                    return;
                }
            }

            controller.playlist.duration = totalTime;

            if (playlistId) {
                $http.put('/api/playlist/' + playlistId, controller.playlist).success(function() {
                    window.location.href = "/manage";
                });
            } else {
                $http.post('/api/playlist', controller.playlist).success(function() {
                    window.location.href = "/manage";
                });
            }
        };

        $scope.parseInt = function(number) {
            return parseInt(number, 10);
        }
    });


    app.directive('videoCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlist/video-card.html'
        }
    });

    app.directive('videoqaCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlist/videoqa-card.html'
        }
    });

    app.directive('answerCard', function() {
        return {
            restrict: 'E',
            templateUrl: '/babelbooapp/playlist/answer-card.html'
        }
    });
})();

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

function handleClientLoad() {
    gapi.client.setApiKey(API_KEY);
    gapi.client.load('youtube', 'v3');
}
