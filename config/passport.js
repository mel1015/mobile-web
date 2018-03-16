var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("../models/User");

// serialize & deserialize User
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, function (err, user) {
        done(err, user);
    });
});

// local strategy
passport.use("local-login",
    new LocalStrategy({
            usernameField: "userid",
            passwordField: "password",
            passReqToCallback: true
        },
        function (req, userid, password, done) {
            User.findOne({userid: userid})
                .select({password: 1})
                .exec(function (err, user) {
                    if (err) return done(err);

                    if (user && user.authenticate(password)) {
                        return done(null, user);
                    } else {
                        req.flash("userid", userid);
                        req.flash("errors", {login: "아이디나 비밀번호가 틀립니다!"});
                        return done(null, false);
                    }
                });
        }
    )
);

module.exports = passport;
