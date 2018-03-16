const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const app = express();

// 기본 세팅
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret: "MySecret"}));

// 패스포트
app.use(passport.initialize());
app.use(passport.session());

// 커스텀 미들웨어
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

// 라우팅
app.use("/", require("./routes/home"));
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/places", require("./routes/places"));

require('./config/database')(app);

// 포트세팅
app.listen(3000, function () {
    console.log("server on!");
});
