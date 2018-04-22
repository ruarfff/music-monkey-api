'use strict';
const SpotifyWebApi = require('spotify-web-api-node');
const scopes = ['user-read-private', 'user-read-email'];
const callbackEndpoint = '/callback';
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9';
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19';

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/login', function(req, res) {
    const spotifyApi = new SpotifyWebApi({
      redirectUri: 'http://' + req.hostname + callbackEndpoint,
      clientId: clientId,
    });
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
  });

  router.get('/callback', function(req, res) {
    var credentials = {
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: 'http://' + req.hostname + callbackEndpoint,
    };

    var spotifyApi = new SpotifyWebApi(credentials);

    // The code that's returned as a query parameter to the redirect URI
    var code = req.query.code;

    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(
      function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        res.cookie('access_token', data.body['access_token']);
        res.cookie('refresh_token', data.body['refresh_token']);
        res.redirect('http://localhost:3000');
      },
      function(err) {
        console.log('Something went wrong!', err);
        res.send(err);
      }
    );
  });

  router.get('/refresh', function(req, res) {
    const spotifyApi = new SpotifyWebApi({
      redirectUri: 'http://' + req.hostname + callbackEndpoint,
      clientId: clientId,
      clientSecret: clientSecret,
    });
    spotifyApi.setRefreshToken(req.get('refresh_token'));
    spotifyApi.refreshAccessToken().then(
      function(data) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept');

        console.log('The access token has been refreshed!');
        spotifyApi.setAccessToken(data.body['access_token']);
        res.cookie('access_token', data.body['access_token']);
        /* eslint-disable */
        res.send({access_token: data.body['access_token']});
        /* eslint-enable */
      },
      function(err) {
        res.status(500).send({error: 'Could not refresh access token: ' + JSON.stringify(err)});
      }
    );
  });
  app.use(router);
};
