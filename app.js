var app = require('./server');

function startServer () {
    var server = app.listen(process.env.PORT);
    console.log('Express server started on port %s', server.address().port);
}

app.onSessionConnected(startServer);