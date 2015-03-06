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
            getPlaylist: function (id, callback) {
                callback({ title: playlistTitle });
            }
        };

        ctrl = $controller('ShareController', {
            $location: locationService,
            $window: windowService,
            playlists: playlistsService
        });
    }));

    it('opens the facebook share address with the correct playlist url', function() {
        path = '/play/playlist-title';
        ctrl.facebook();
        expect(windowService.open.calledWithExactly('https://www.facebook.com/sharer/sharer.php?u=http://www.babelboo.com' + path, '_blank')).to.be.true;
    });

    it('opens the twitter share address with the correct playlist url and name', function() {
        path = '/play/playlist-title';
        ctrl.twitter();
        var message = 'Me ha gustado este playlist en @babelboo : ' + playlistTitle;
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + message + '&url=http://www.babelboo.com' + path, '_blank')).to.be.true;
    });

    it('opens a new email with the correct playlist url and name', function() {
        path = '/play/playlist-title';
        var url = "mailto:?subject=" + "Mírate estos videos en inglés" + "&body=" + 'He encontrado un playlist muy bueno en Babelboo. Míratelo.' + escape('\n\n') + playlistTitle + ': ' + 'http://www.babelboo.com' + path;
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
    });

    it('opens the twitter share address with the boo tv url and message', function() {
        path = '/tv';
        var message = 'Aprende inglés sin preocupaciones con Boo TV @babelboo';
        ctrl.twitter();
        expect(windowService.open.calledWithExactly('https://twitter.com/intent/tweet?text=' + message + '&url=http://www.babelboo.com' + path, '_blank')).to.be.true;
    });

    it('opens a new email with the boo tv url and message', function() {
        var path = '/tv';
        var url = "mailto:?subject=" + 'Nueva web para aprender inglés' + "&body=" + 'Mírate Boo TV. Es una manera genial de mejorar el inglés sin preocuparte.' + escape('\n\n') + 'http://www.babelboo.com/tv';
        ctrl.email();
        expect(windowService.open.calledWithExactly(url, '_blank')).to.be.true;
    });

    it('opens the twitter share address with the landing page url and message', function() {
        var generalMessage = 'Aprende inglés mirando videos con @babelboo. Have fun, learn English.';
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
        var url = "mailto:?subject=" + "Nueva web para aprender inglés" + "&body=" + 'He descubierto Babelboo. Es una manera genial de mejorar tu inglés.' + escape('\n\n') + 'Dale al enlace para entrar:' + escape('\n\n') + 'http://www.babelboo.com';
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
