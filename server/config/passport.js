require("dotenv").config()

const passport_jwt = require('passport-jwt');

const JwtStrategy = passport_jwt.Strategy;
const ExtractJwt = passport_jwt.ExtractJwt;

const UserCred = require("../Models/UserCredential")

const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

const passportConfig =  passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            // console.log('JWT PAYLOAD>>', jwt_payload);
            
            UserCred
                .find({ user_id: jwt_payload.user_id })
                .then(user => {
                    if (user) {
                        return done(null, user[0]);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
            
        }),
    );
};

module.exports = passportConfig