const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(async (username, password, done) => {

        const user = await User.findOne({ email: username }); 
    
        if(!user){
            return done(null, false);
        }
        if(user){

            bcrypt.compare(password, user.password, (err, pass) => {

                if(!err && pass){

                    return done(null, user);
                }else{

                    return done(err);
                }
            });
        }
}));

passport.serializeUser((user, next) => {
    next(null, user._id);
});

passport.deserializeUser(async (id, next) => {
    const user = await User.findOne({_id : id});
    next(null, user);
});

module.exports = passport;