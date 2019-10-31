if (process.env.NODE_ENV !== 'production') {
  const result = require('dotenv').config(); // eslint-disable-line global-require

  if (result.error) {
    throw result.error;
  }
}
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
// const util = require('util');
const StravaStrategy = require('passport-strava-oauth2').Strategy;
const path = require('path');
const strava = require('strava-v3');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

const stravaConfig = {
  clientID: process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
  callbackURL: process.env.STRAVA_CALLBACK
};
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Strava profile is
//   serialized and deserialized.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const stravaStrategy = new StravaStrategy(
  stravaConfig,
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(() => {
      // To keep the example simple, the user's Strava profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Strava account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
);

// Use the StravaStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Strava
//   profile), and invoke a callback with a user object.
passport.use(stravaStrategy);

const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../client/dist');

const app = express();

// configure Express
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'blahblahblah',
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'login.html'));
});

app.get('/api/activities', ensureAuthenticated, (req, res) => {
  strava.athlete.listActivities(
    { access_token: req.user.token, per_page: 20 },
    (err, payload, limits) => {
      if (err) {
        res.json(err);
      } else {
        // TODO: each activity has a bunch of data. only send back the necessary stuff
        res.json({ activities: payload, user: req.user._json }); // eslint-disable-line
      }
    }
  );
});

// Helper function... move this somewhere
const updateActivity = params =>
  new Promise((resolve, reject) => {
    strava.activities.update(params, (err, payload, limits) => {
      console.log('limits', limits);
      if (err) return reject(err);
      return resolve(payload);
    });
  });

const reflectUpdateActivity = async params => {
  try {
    const payload = await updateActivity(params);
    return { status: 'fulfilled', value: payload };
  } catch (error) {
    return { status: 'rejected', reason: error, id: params.id };
  }
};

app.patch('/api/activities/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { gear_id } = req.body;

  try {
    const payload = await updateActivity({ access_token: req.user.token, id, gear_id });
    res.json(payload);
  } catch (err) {
    res.json(err);
  }
});

app.patch('/api/activities/batch', ensureAuthenticated, async (req, res) => {
  const { activity_ids, gear_id } = req.body;

  // TODO: handle rate limiting
  const requests = await Promise.all(
    activity_ids.map(id => reflectUpdateActivity({ access_token: req.user.token, id, gear_id }))
  );

  const updates = requests.reduce(
    (acc, update, idx) => {
      const id = activity_ids[idx];
      if (update.status === 'fulfilled') {
        acc.updated[update.value.id] = update.value; // TODO: maybe only return the id instead of the whole object
      } else {
        acc.errors[update.id] = update.reason;
      }
      return acc;
    },
    { errors: {}, updated: {} }
  );

  res.json(updates);
});

// GET /auth/strava
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Strava authentication will involve
//   redirecting the user to strava.com.  After authorization, Strava
//   will redirect the user back to this application at /auth/strava/callback
app.get(
  '/auth/strava',
  passport.authenticate('strava', { scope: ['activity:read_all,activity:write,profile:read_all'] }),
  () => {
    // The request will be redirected to Strava for authentication, so this
    // function will not be called.
  }
);

// GET /auth/strava/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/auth/strava/callback',
  passport.authenticate('strava', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.use(express.static(DIST_DIR));

app.listen(port, () => {
  console.log(`App listening on port: ${port}`); // eslint-disable-line no-console
});
