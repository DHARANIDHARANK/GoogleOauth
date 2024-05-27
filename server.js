const express = require('express');
const authRoute = require('./router/auth-route');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./model/login');
const cookies = require('cookie-session');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');

// Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoute);
app.use(cookies({
  maxAge: 24*60*60*1000, // age of a cookie it was 1 day
  keys:PROCESS.ENV.COOKIE_KEY,
}))
// MongoDB connection
const db = process.env.DATABASE_LOGIN;

async function connectDB() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database has been connected");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

connectDB();

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// sending out id in cookie
passport.serializeUser((user,done)=>{
  done(null,user.id)
})

//getting id who's it belongs
passport.deserializeUser(async (user,done)=>{
  await User.findById(id).then((user) =>{
    done(null,user.id);
  });
  
})
// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.YOUR_GOOGLE_CLIENT_ID,
  clientSecret: process.env.YOUR_GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        username: profile.displayName,
        googleId: profile.id
      });
      await user.save();
      console.log("New user has been created");
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));
