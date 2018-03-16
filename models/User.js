var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// schema
var userSchema = mongoose.Schema({
    userid: {
        type: String,
        required: [true, "아이디는 필수사항입니다!"],
        match: [/^.{4,12}$/, "4~12자 이내여야 합니다."],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "비밀번호는 필수사항입니다!"],
        select: false
    },
    name: {
        type: String,
        required: [true, "이름는 필수사항입니다!"],
        match: [/^.{2,12}$/, "2~12자 이내여야 합니다."],
        trim: true
    },
    email: {
        type: String,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "유효한 이메일 주소를 입력하세요!"],
        trim: true
    }
}, {
    toObject: {virtuals: true}
});

// virtuals
userSchema.virtual("passwordConfirmation")
    .get(function () {
        return this._passwordConfirmation;
    })
    .set(function (value) {
        this._passwordConfirmation = value;
    });

userSchema.virtual("originalPassword")
    .get(function () {
        return this._originalPassword;
    })
    .set(function (value) {
        this._originalPassword = value;
    });

userSchema.virtual("currentPassword")
    .get(function () {
        return this._currentPassword;
    })
    .set(function (value) {
        this._currentPassword = value;
    });

userSchema.virtual("newPassword")
    .get(function () {
        return this._newPassword;
    })
    .set(function (value) {
        this._newPassword = value;
    });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "알파벳과 숫자가 포함된 8~16자 이내의 비밀번호";
userSchema.path("password").validate(function (v) {
    var user = this;

    // create user
    if (user.isNew) {
        if (!user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "비밀번호 확인이 필요합니다!");
        }
        if (!passwordRegex.test(user.password)) {
            user.invalidate("password", passwordRegexErrorMessage);
        } else if (user.password !== user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "비밀번호와 일치하지 않습니다!");
        }
    }

    // update user
    if (!user.isNew) {
        if (!user.currentPassword) {
            user.invalidate("currentPassword", "현재 비밀번호를 입력하세요!");
        }
        if (user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)) {
            user.invalidate("currentPassword", "현재 비밀번호가 틀립니다!");
        }
        if (user.newPassword && !passwordRegex.test(user.newPassword)) {
            user.invalidate("newPassword", passwordRegexErrorMessage);
        } else if (user.newPassword !== user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "비밀번호와 일치하지 않습니다!");
        }
    }
});

// hash password
userSchema.pre("save", function (next) {
    var user = this;
    if (!user.isModified("password")) {
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

// model methods
userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

// model & export
var User = mongoose.model("user", userSchema);
module.exports = User;
