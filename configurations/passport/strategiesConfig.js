var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var authController = require('../../controllers/authController');

//google strategy
passport.use(new GoogleStrategy({
    'clientID': process.env.GOOGLE_CLIENT_ID,
    'clientSecret': process.env.GOOGLE_CLIENT_SECRET,
    'callbackURL':  process.env.GOOGLE_CALLBACK_URL
},
    async function (token, tokenSecret, profile, done) {
        try {

            var user = await authController.findOrCreate(profile);
            if (user) {
                return done(null, user);
            }
        } catch (err) {
            console.log("error : " + err)
            return done(err);
        }
    }
));

//passport facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            console.log(profile)
            var user = await authController.findOrCreate(profile);
            if (user) {
                return done(null, user)
            }
        } catch (err) {
            console.log("error : " + err)
            return done(err);
        }
    }
));

//local login strategy
passport.use(new LocalStrategy(
async function (email, password, done) {
    try{
        var user = await authController.getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'User not found.' });
        }if(user.active === false){
            return done(null, false, { message: 'Not authorised.' });
        }
        else{
         let isMatch = await authController.comparePassword(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
        }
    }catch(err){
        return(err);
    }
	}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser( async function (id, done) {
    try{
        let user = await authController.getUserById(id)
		done(null, user);
    }catch(err){
        done(err, null);
    }
});

module.exports = passport;