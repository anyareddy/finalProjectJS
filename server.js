var express = require('express')
var request = require('request')
var mongoose = require('mongoose')
var User = require('./db/models/user')
var Playlists = require('./db/models/playlists')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var cors = require('cors')
var querystring = require('querystring')
var cookieParser = require('cookie-parser')
const path = require('path')
var apiRouter = require('./routes/apiRouter.js')

var client_id = '9c20170c02cc42a2ae8e2108ce57fda3'
var client_secret = 'da928e2382c24712b3c45aa8123c1b32'
var redirect_uri = 'http://localhost:8888/callback'

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1' || '127.0.0.1')


var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)
app.engine('html', require('ejs').__express)
app.set('view engine', 'html')

// Register body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/static', express.static(path.join(__dirname, 'static')))
   .use(cors())
   .use(cookieParser());


app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };


    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        req.session.access_token = access_token;
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          //console.log(body);
          req.session.user = body.display_name
          var userObj = new User(
            {id: body.id, display_name: body.display_name, uri: body.uri, href: body.href, access_token: access_token})
          userObj.save(function(err) {
          })
        });
        

        var playlists = {
          url: "https://api.spotify.com/v1/me/playlists",
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        var playListObj;
        request.get(playlists, function(error, response, body) {
          req.session.playlist = body.items[0].id;
          for (var i = 0; i < body.total; i++) {
            playlistObj = new Playlists(
                {id: body.items[i].id, name: body.items[i].name, owner: body.items[i].owner.display_name,
                tracks: body.items[i].tracks.href, uri: body.items[i].uri});
            var tracks = {
              url: ""+body.items[i].tracks.href ,
              headers: { 'Authorization': 'Bearer ' + access_token },
              json: true
            }
            request.get(tracks, function(error, response, bod) {
              var length = bod.items.length
              var song = [bod.items[length - 5].track.album.name, bod.items[length - 7].track.album.name, bod.items[length - 12].track.album.name]
              var artist = [bod.items[length - 5].track.artists[0].name, bod.items[length - 7].track.artists[0].name, bod.items[length - 12].track.artists[0].name]
              var ids = [bod.items[length - 5].track.album.id, bod.items[length - 7].track.album.id, bod.items[length - 12].track.album.id]
              req.session.playlist = body.items[0].id;
              playlistObj.songs = song
              playlistObj.artists = artist
              playlistObj.ids = ids
              //console.log(playlistObj)
              playlistObj.save(function(err) {
              })
            })
          } 
        });
        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


app.post('/playlist', function (req, res, next) {
   request.get(tracks, function(err, response, bod) {
    res.render('playlist', { playlists: bod, })
  })
  res.json({ playlists: tracks})
})

app.post('/tracks', function (req, res, next) {
  Playlists.find({}, function(err, results) {
    var rel = results[results.length - 1]
    req.session.playlist = rel.id
  })
  User.find({}, function(err, results) {
    var rel = results[results.length - 1]
    req.session.token = rel.access_token
  })
  var track = req.body.song
  var playlist = req.session.playlist
  var add = {
    url: 'https://api.spotify.com/v1/playlists/'+playlist+'/tracks?uris='+track,
    headers: { 'Authorization': 'Bearer ' + req.session.token },
    json: true
  }
  request.post(add, function(error, response, body) {
  });
  res.json({ success: 'OK' })
})

app.get('/home', function(req, res, next) {
  // TODO: render out an index.html page with questions (queried from db)
  //       also pass to ejs template a user object so we can conditionally
  //       render the submit box
    Playlists.find({}, function(err, results) {
      if (!err) {
        res.render('home', { playlists: results, })
      } else {
        next(err)
      }
    })
})


app.get('/playlists', function(req, res, next) {
   Playlists.find({}, function(err, results) {
    if (!err) {
      res.json({ playlists: results})
    } else {
      next(err)
    }
  })
})


// Load the api router onto app
//app.use('/apiRouter', apiRouter)

// Any non-api routes should be sent the html file as a response
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'FinalProject/views', 'index.html'));
});

app.listen(8888, () => console.log('listening...'));
