const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");

module.exports = passport => {
    passport.use(new LocalStrategy(
        function(err, user){
                if(err){
                    return done(err);
                }
                if(!user){
                    return done(null, false, {message: 'Incorrect email or username'});
                }
                if(!user.validPassword(password))
                {
                    return done(null, false, {message: 'Incorrect password'});
                }
                return done(null, user);
            }
            )
            )
        }
