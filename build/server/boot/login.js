"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var SpotifyWebApi = require("spotify-web-api-node");
var userGateway_1 = require("../user/userGateway");
var scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-birthdate',
    'playlist-modify-public',
    'playlist-modify-private'
];
var callbackEndpoint = '/callback';
var clientId = 'ee4aa78cde4c4be08978d79c180e11c9';
var clientSecret = 'acfc43102e5c4e05902e66284dfdcb19';
var userGateway = new userGateway_1.default();
function default_1(server) {
    var router = server.loopback.Router();
    router.get('/login', function (req, res) {
        var redirectURL = getRedirectUrl(req);
        console.log('RedirectURL: ', redirectURL);
        var spotifyApi = new SpotifyWebApi({
            clientId: clientId,
            redirectUri: redirectURL
        });
        var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
        res.redirect(authorizeURL);
    });
    router.get('/callback', function (req, res) {
        var redirectURL = getRedirectUrl(req);
        var code = req.query.code;
        var redirectTo = req.query.redirectTo;
        var credentials = {
            clientId: clientId,
            clientSecret: clientSecret,
            redirectUri: redirectURL
        };
        console.log('Creds: ', JSON.stringify(credentials, null, 4));
        console.log('Code: ', code);
        var spotifyApi = new SpotifyWebApi(credentials);
        spotifyApi.authorizationCodeGrant(code).then(function (data) {
            res.redirect(redirectTo + '?rt=' + data.body.refresh_token);
        }, function (err) {
            console.log('Something went wrong!', err);
            res.status(500).send(err);
        });
    });
    router.post('/refresh', function (req, res) {
        var redirectUrl = getRedirectUrl(req);
        var spotifyApi = new SpotifyWebApi({
            clientId: clientId,
            clientSecret: clientSecret,
            redirectUri: redirectUrl
        });
        var refreshToken = req.body.refreshToken;
        spotifyApi.setRefreshToken(refreshToken);
        spotifyApi
            .refreshAccessToken()
            .then(function (data) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            var accessToken = data.body.access_token;
            var expiresIn = data.body.expires_in;
            spotifyApi.setAccessToken(accessToken);
            getOrCreateUser(spotifyApi, refreshToken, accessToken, expiresIn)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (err) { return res.status(401).send(err); });
        })
            .catch(function (err) {
            return res.status(500).send({
                error: 'Could not refresh access token: ' + JSON.stringify(err)
            });
        });
    });
    server.use(router);
}
exports.default = default_1;
function getRedirectUrl(req) {
    return ((req.hostname === 'localhost' ? 'http://' : 'https://') +
        req.hostname +
        (req.hostname === 'localhost' ? ':8080' : '') +
        callbackEndpoint +
        (req.query.redirectTo ? '?redirectTo=' + req.query.redirectTo : ''));
}
function getOrCreateUser(spotifyApi, refreshToken, accessToken, expiresIn) {
    var auth = {
        accessToken: accessToken,
        expiresIn: expiresIn,
        refreshToken: refreshToken
    };
    return new Promise(function (resolve, reject) {
        spotifyApi
            .getMe()
            .then(function (data) {
            userGateway
                .getUserByEmail(data.body)
                .then(function (savedUser) {
                savedUser.auth = auth;
                resolve(savedUser);
            })
                .catch(function (err) {
                console.log('Could not find user ' + data.body.email, err);
                // Try create the user
                var spotifyUser = data.body;
                var user = {
                    auth: auth,
                    birthdate: spotifyUser.birthdate,
                    country: spotifyUser.country,
                    displayName: spotifyUser.display_name,
                    email: spotifyUser.email,
                    image: spotifyUser.images && spotifyUser.images.length > 0
                        ? spotifyUser.images[0].url
                        : ''
                };
                userGateway
                    .createUser(user)
                    .then(resolve)
                    .catch(reject);
            });
        })
            .catch(reject);
    });
}
//# sourceMappingURL=login.js.map