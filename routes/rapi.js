
var express = require('express');

var router = express.Router();

router.get('/playlist', function(req, res) {
    var collection = req.db.get('playlists');

    var query = {};

    if (req.query.level && req.query.level != -1) {
        query.level = parseInt(req.query.level);
    }

    if (req.query.tags) {
        query.tags = { $all : req.query.tags.split(',') };
    }

    if (req.query.related) {
        collection.find({ _id: req.query.related },{},function (err, result) {
            var tags = result[0].tags;
            query._id = { $ne: collection.id(req.query.related) };
            query.tags = { $in: tags };
            runQuery(query);
        });
    } else if (req.query.all == 'true') {
        runQueryAll(query);
    } else {
        runQuery(query);
    }

    function runQueryAll (query) {
        try {
            collection.find(query, function (err, result) {
                res.json( result );
            });
        } catch (err2) {
            res.json();
        }
    }

    function runQuery (query) {
        try {
            collection.find(query, function (err, result) {
                for (var i = 0; i < result.length; i++) {
                    var current = result[i];
                    var newentries = [];
                    for (var j = 0; j < current.entries.length; j++) {
                        var newvid = {};
                        newvid.thumbnail = current.entries[j].thumbnail;
                        newentries[j] = newvid;
                    }

                    current.entries = newentries;
                }
                res.json( result );
            });
        } catch (err2) {
            res.json();
        }
    }
});

router.get('/tag', function(req, res) {
    var collection = req.db.get('tags');

    try {
        collection.find({},{},function (err, result) {
            res.json( result );
        });
    } catch (err2) {
        res.json();
    }
});

router.get('/user', function(req, res) {
    var collection = req.db.get('usercollection');

    res.json(req.user);
});

router.post('/user/update', function(req, res) {
    var username = req.user.username;

    var newUsername = req.body.username;
    var newNickname = req.body.nickname;
    var newPassword = req.body.password;

    var query = {
        username: username
    };

    var setop = {
        username: newUsername,
        nickname: newNickname
    }

    if (typeof newPassword !== 'undefined') {
        setop.password = newPassword;
    }

    var collection = req.db.get('usercollection');
    collection.update(query, {$set: setop});

    res.status(201);
    res.json();
});

router.post('/user/:username/correctanswer/:playlist_id', function(req, res) {
    if (req.params.username != req.user.username) {
        res.status(403); // FORBIDDEN
        res.json();
        return;
    }

    var collection = req.db.get('usercollection');

    var videoId = req.body.id;
    var newRatio = req.body.ratio;
    var playlistId = req.params.playlist_id;

    var query = {
        username: req.user.username
    };

    var setop = {};
    setop['playlistprogress.' + playlistId + '.correct.' + videoId] = true;
    setop['playlistprogress.' + playlistId + '.ratio'] = newRatio;

    collection.update(query, {$set: setop});
    res.json();

    var newMedal = getMedal(newRatio);
    try {
        var oldMedal = getMedal(req.user.playlistprogress[playlistId].ratio);
        if (newMedal <= oldMedal) {
            return;
        }
    } catch(err) {}

    var now = new Date();

    if (req.user.medalhistory) {
        var medalHistory = req.user.medalhistory;
        for (var i = medalHistory.length-1; i >= 0 && sameDay(now, medalHistory[i].date); i--) {
            if (medalHistory[i].playlistid == playlistId) {
                collection.update(query, {$pull: {medalhistory: medalHistory[i]}});
                break;
            }
        }
    }

    var entry = {
        playlistid: playlistId,
        medal: newMedal,
        date: now
    };

    collection.update(query, {$push: {medalhistory: entry}});
});

var BRONZE = 1;
var SILVER = 2;
var GOLD = 3;

function getMedal(ratio) {
    if (0 < ratio && ratio <= 0.5) {
        return BRONZE;
    } else if (0.5 < ratio && ratio < 1) {
        return SILVER;
    } else {
        return GOLD;
    }
}

function sameDay(aDate, anotherDate) {
    return aDate.toLocaleDateString() == anotherDate.toLocaleDateString();
}

router.post('/user/:username/finished/:playlist_id', function(req, res) {
    if (req.params.username != req.user.username) {
        res.status(403); // FORBIDDEN
        res.json();
        return;
    }

    var playlistId = req.params.playlist_id;

    try {
        if (req.user.playlistprogress[playlistId].finished) {
            return;
        }
    } catch(err) {
        return;
    }

    var setop = {};
    setop['playlistprogress.' + playlistId + '.finished'] = true;

    var query = {
        username: req.user.username
    }

    var collection = req.db.get('usercollection');
    collection.update(query, {$set: setop});

    collection = req.db.get('playlists');
    query = {
        _id: playlistId
    }

    collection.update(query, {$inc: {visitcount: 1}});
    res.json();
});

router.post('/feedback', function(req, res) {
    var collection = req.db.get('feedback');

    var id = req.user._id;
    var username = req.user.username;
    var message = req.body.message;

    var object = {
        userid: id,
        username: username,
        message: message,
        date: new Date()
    };

    collection.insert(object);

    res.json();
});

router.post('/video', function(req, res) {
    var collection = req.db.get('videos');

    var videoIds = req.body;
    var videos = videoIds.map(function (currentValue) {
        return {
            videoId: currentValue.id,
            title: currentValue.title,
            level: currentValue.level,
            source: 'YouTube'
        }
    });

    for (var i = 0; i < videoIds.length; i++) {
        collection.insert(videos);
    }

    res.json();
});

router.get('/ranking/:period', function(req, res) {
    var period = req.params.period;
    var periodBegin;

    if (period == 'week') {
        periodBegin = nDaysAgo(6);
    } else if (period == 'month') {
        periodBegin = nDaysAgo(29);
    } else if (period == 'alltime') {
        periodBegin = new Date(null);
    } else {
        res.status(404);
        res.json();
        return;
    }

    var collection = req.db.get('usercollection');
    var fields = {username: 1, nickname: 1, medalhistory: 1, _id: 0};
    collection.find({}, {fields: fields}, function(err, result) {
            var ranking = result.map(processMedalHistory);
            ranking.sort(medalCompare);
            fillRanks(ranking);

            res.json(ranking);
    });

    function processMedalHistory(element) {
        var seenMedals = seenMedalsMap(element.medalhistory);
        var medals = accumulateMedals(seenMedals);
        var entry  = {
            username: element.username,
            nickname: element.nickname,
            golds: medals.golds,
            silvers: medals.silvers,
            bronzes: medals.bronzes
        }

        return entry;
    }

    function seenMedalsMap(medalhistory) {
        var seenMedals = {};
        if (!medalhistory) {
            return seenMedals;
        }

        for (var j = 0; j < medalhistory.length; j++) {
            var hEntry = medalhistory[j];

            if (hEntry.date < periodBegin) {
                continue;
            }

            var playlistId = hEntry.playlistid;
            var currentMedal = seenMedals[playlistId]? seenMedals[playlistId]: 0;
            seenMedals[playlistId] = Math.max(currentMedal, hEntry.medal);
        }

        return seenMedals;
    }

    function accumulateMedals(seenMedals) {
        var medals = {golds: 0, silvers: 0, bronzes: 0};
        for (var playlistId in seenMedals) {
            if (seenMedals[playlistId] == GOLD) {
                medals.golds++;
            } else if (seenMedals[playlistId] == SILVER) {
                medals.silvers++;
            } else if (seenMedals[playlistId] == BRONZE) {
                medals.bronzes++;
            }
        }

        return medals;
    }

    function medalCompare(a,b) {
        if (b.golds != a.golds) {
            return b.golds - a.golds;
        }

        if (b.silvers != a.silvers) {
            return b.silvers - a.silvers;
        }

        return b.bronzes - a.bronzes;
    }

    function fillRanks(ranking) {
        for (var i = 0; i < ranking.length; i ++) {
            ranking[i].rank = i+1;
        }
    }
});

router.get('/plot/:period', function(req, res) {
    var period = req.params.period;
    var periodDays;

    if (period == 'week') {
        periodDays = 7;
    } else if (period == 'month') {
        periodDays = 30;
    } else {
        res.status(404);
        res.json();
        return;
    }

    var periodStart = nDaysAgo(periodDays - 1)

    var collection = req.db.get('usercollection');

    var query = { username: req.user.username };

    collection.col.aggregate(
        { $match: query },
        { $unwind: '$medalhistory' },
        { $match: {'medalhistory.date': {$gt: nDaysAgo(periodDays)}} },
        { $group: {_id: '$_id', medalhistory: {$push: '$medalhistory'}} },
        function(err,result) {
            var goldsarray = [];
            var silversarray = [];
            var bronzesarray = [];

            for (var i = 0; i < periodDays; i++) {
                goldsarray[i] = 0;
                silversarray[i] = 0;
                bronzesarray[i] = 0;
            }

            if(result.length > 0) {
                var medalhistory = result[0].medalhistory;

                for (var i = 0; i < medalhistory.length; i++) {
                    switch(medalhistory[i].medal) {
                    case GOLD:
                        goldsarray[dayDifference(periodStart, medalhistory[i].date)]++
                        break;
                    case SILVER:
                        silversarray[dayDifference(periodStart, medalhistory[i].date)]++
                        break;
                    case BRONZE:
                        bronzesarray[dayDifference(periodStart, medalhistory[i].date)]++
                        break;
                    }
                }
            }

            res.json([goldsarray, silversarray, bronzesarray]);
        });
});

function dayDifference(firstDate, secondDate) {
    clearTime(firstDate);
    clearTime(secondDate);

    var timeDiff = Math.abs(secondDate.getTime() - firstDate.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function nDaysAgo(nDays) {
    var date = new Date();
    clearTime(date);
    date.setDate(date.getDate() - nDays);
    return date;
}

function clearTime(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
}

module.exports = router;
