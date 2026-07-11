const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Extract email from GitHub profile
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : `${profile.username}@github.oauth`;

        // Check if a user with this email already exists (link accounts)
        user = await User.findOne({ email });
        if (user) {
          user.githubId = profile.id;
          user.avatar = profile.photos?.[0]?.value || '';
          await user.save();
          return done(null, user);
        }

        // Create a new user
        user = await User.create({
          name: profile.displayName || profile.username,
          email,
          githubId: profile.id,
          avatar: profile.photos?.[0]?.value || '',
          // Generate a random password (OAuth users won't use it)
          password: crypto.randomBytes(32).toString('hex'),
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
