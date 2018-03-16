var express = require("express");
var router = express.Router();

// Place
router.get("/", function (req, res) {
    res.render("places/place");
});

module.exports = router;
