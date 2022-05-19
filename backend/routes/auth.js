const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
//const GoogleStrategy = require('passport-google-oidc');
const db = require('../db');


// Configure the Google strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
  clientID: '694928819805-92rdk092l1i3a75l10of0819e4hd2u7b.apps.googleusercontent.com',
  clientSecret: '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',
  authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
  callbackURL: 'http://localhost:3000/oauth2/redirect/google',
  scope: [ 'profile' ],
  state: true
},
function verify(accessToken, refreshToken, profile, cb) {
  db.any('SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2', [
    'https://accounts.google.com',
    profile.id
  ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) {
      db.none('INSERT INTO users (name) VALUES ($1)', [
        profile.displayName
      ], function(err) {
        if (err) { return cb(err); }
        var id = this.lastID;
        db.none('INSERT INTO federated_credentials (user_id, provider, subject) VALUES ($1, $2, $3)', [
          id,
          'https://accounts.google.com',
          profile.id
        ], function(err) {
          if (err) { return cb(err); }
          var user = {
            id: id,
            name: profile.displayName
          };
          return cb(null, user);
        });
      });
    } else {
      db.get('SELECT rowid AS id, * FROM users WHERE rowid = $1', [ row.user_id ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false); }
        return cb(null, row);
      });
    }
  });
}));
  
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Google profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

/* GET /login
 *
 * This route prompts the user to log in.
 *
 * The 'login' view renders an HTML page, which contain a button prompting the
 * user to sign in with Google.  When the user clicks this button, a request
 * will be sent to the `GET /login/federated/accounts.google.com` route.
 */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET /login/federated/accounts.google.com
 *
 * This route redirects the user to Google, where they will authenticate.
 *
 * Signing in with Google is implemented using OAuth 2.0.  This route initiates
 * an OAuth 2.0 flow by redirecting the user to Google's identity server at
 * 'https://accounts.google.com'.  Once there, Google will authenticate the user
 * and obtain their consent to release identity information to this app.
 *
 * Once Google has completed their interaction with the user, the user will be
 * redirected back to the app at `GET /oauth2/redirect/accounts.google.com`.
 */
router.get('/login/federated/google', passport.authenticate('google'));

/*
    This route completes the authentication sequence when Google redirects the
    user back to the application.  When a new user signs in, a user account is
    automatically created and their Google account is linked.  When an existing
    user returns, they are signed in to their linked account.
*/
router.get('/oauth2/redirect/google',
	passport.authenticate('google', {
		successReturnToOrRedirect: '/',
		failureRedirect: '/login'
}));

/* POST /logout
 *
 * This route logs the user out.
 */
router.post('/logout', function(req, res, next) {
  //req.logout(); // commented out to prevent an error from occurring
  res.redirect('/');
});

module.exports = router;
