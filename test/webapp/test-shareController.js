describe('share buttons controller', function() {
    beforeEach(module('share'));
    var locationService;
    var windowService;
    var ctrl;

    var path;
    var playlistTitle = 'a playlist title';

    beforeEach(inject(function($controller) {
        locationService = {
            path: sinon.spy(function() {
                return path;
            })
        };

        windowService = {
            open: sinon.spy()
        };

        playlistsService = {
            playById: function () {
                return { success: function (callback) {
                        callback({ title: playlistTitle });
                    }
                };
            }
        };

        ctrl = $controller('ShareController', {
            $location: locationService,
            $window: windowService,
            playlists: playlistsService
        });
    }));

    it('opens the facebook share address with the correct playlist url', function() {
        path = '/play/shau9sr8g.sru8fr8asrgr';
        ctrl.facebook();
        expect(windowService.open.calledWithExactly('https://www.facebook.com/sharer/sharer.php?u=http://www.babelboo.com' + path, '_blank')).to.be.true;
    });

    it('opens the twitter share address with the correct playlist url and name', function() {
        path = '/play/shau9sr8g.sru8fr8asrgr';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=Cool playlist in Babelboo: ' + playlistTitle + '&url=http://www.babelboo.com' + path, '_blank')).to.be.true;
    });

    it('opens a new email with the correct playlist url and name', function() {
        var path = '/play/shau9sr8g.sru8fr8asrgr';
        var url = "mailto:?subject=" + escape("Check out this playlist") + "&body=" + escape('Hey, check out this playlist in Babelboo:\n\n' + playlistTitle + ': ' + 'http://www.babelboo.com' + path);
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
    });

    it('opens the twitter share address with the boo tv url and message', function() {
        path = '/tv';
        var message = 'Learn English without worries with Boo TV';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + message + '&url=http://www.babelboo.com' + path, '_blank')).to.be.true;
    });

    it('opens a new email with the boo tv url and message', function() {
        var path = '/tv';
        var url = "mailto:?subject=" + escape("Check out Boo TV") + "&body=" + escape('Check Boo TV. It\'s a great way to improve your English without worries.\n\nhttp://www.babelboo.com/tv');
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
    });

    it('opens the twitter share address with the landing page url and message', function() {
        var generalMessage = 'Have fun, learn English with Babelboo';
        var generalUrl = 'http://www.babelboo.com';

        path = '/playlists';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + generalMessage + '&url=' + generalUrl, '_blank')).to.be.true;
        path = '/tutorial';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + generalMessage + '&url=' + generalUrl, '_blank')).to.be.true;
        path = '/progress';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + generalMessage + '&url=' + generalUrl, '_blank')).to.be.true;
        path = '/profile';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + generalMessage + '&url=' + generalUrl, '_blank')).to.be.true;
        path = '/login';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + generalMessage + '&url=' + generalUrl, '_blank')).to.be.true;
    });

    it('opens a new email with the landing page url and message', function() {
        var url = "mailto:?subject=" + escape("Check out Babelboo") + "&body=" + escape('Check Babelboo, a great way to improve your English.\n\nhttp://www.babelboo.com');
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;

        path = '/playlists';
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
        path = '/tutorial';
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
        path = '/progress';
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
        path = '/profile';
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
        path = '/login';
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
    });
});
