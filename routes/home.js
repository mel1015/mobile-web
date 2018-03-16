var express = require("express");
var router = express.Router();
var passport = require("../config/passport");

// Home
router.get("/", function (req, res) {
    res.render("home/main");
});

// Login
router.get("/login", function (req, res) {
    var username = req.flash("userid")[0];
    var errors = req.flash("errors")[0] || {};
    res.render("home/login", {
        userid: username,
        errors: errors
    });
});

// Post Login
router.post("/login",
    function (req, res, next) {
        var errors = {};
        var isValid = true;

        if (!req.body.userid) {
            isValid = false;
            errors.userid = "아이디를 입력해주세요!";
        }
        if (!req.body.password) {
            isValid = false;
            errors.password = "비밀번호를 입력해주세요!";
        }

        if (isValid) {
            next();
        } else {
            req.flash("errors", errors);
            res.redirect("/login");
        }
    },
    passport.authenticate("local-login", {
            successRedirect: "/",
            failureRedirect: "/login"
        }
    ));

// Logout
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
