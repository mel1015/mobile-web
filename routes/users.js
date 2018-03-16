var express = require("express");
var router = express.Router();
var User = require("../models/User");
var util = require("../util");


// New
router.get("/new", function (req, res) {
    var user = req.flash("user")[0] || {};
    var errors = req.flash("errors")[0] || {};
    res.render("users/new", {user: user, errors: errors});
});

// create
router.post("/", function (req, res) {
    User.create(req.body, function (err, user) {
        if (err) {
            req.flash("user", req.body);
            req.flash("errors", util.parseError(err));
            return res.redirect("/users/new");
        }
        res.redirect("/login");
    });
});

// show
router.get("/:userid", util.isLoggedin, function (req, res) {
    User.findOne({userid: req.params.userid}, function (err, user) {
        if (err) return res.json(err);
        res.render("users/show", {user: user});
    });
});

// edit
router.get("/:userid/edit", util.isLoggedin, checkPermission, function (req, res) {
    var user = req.flash("user")[0];
    var errors = req.flash("errors")[0] || {};
    if (!user) {
        User.findOne({userid: req.params.userid}, function (err, user) {
            if (err) return res.json(err);
            res.render("users/edit", {userid: req.params.userid, user: user, errors: errors});
        });
    } else {
        res.render("users/edit", {userid: req.params.userid, user: user, errors: errors});
    }
});

// update
router.put("/:userid", util.isLoggedin, checkPermission, function (req, res, next) {
    User.findOne({userid: req.params.userid})
        .select({password: 1})
        .exec(function (err, user) {
            if (err) return res.json(err);

            // update user object
            user.originalPassword = user.password;
            user.password = req.body.newPassword ? req.body.newPassword : user.password;
            for (var p in req.body) {
                user[p] = req.body[p];
            }

            // save updated user
            user.save(function (err, user) {
                if (err) {
                    req.flash("user", req.body);
                    req.flash("errors", util.parseError(err));
                    return res.redirect("/users/" + req.params.userid + "/edit");
                }
                res.redirect("/users/" + user.userid);
            });
        });
});

module.exports = router;

// private functions
function checkPermission(req, res, next) {
    User.findOne({userid: req.params.userid}, function (err, user) {
        if (err) return res.json(err);
        if (user.id != req.user.id) return util.noPermission(req, res);

        next();
    });
}
