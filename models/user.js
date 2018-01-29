const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    image: {
        type: String,
        default: 'http://via.placeholder.com/250x200'
    },
    email: {
        type: String,
        required: [true, 'Email missing'],
        unique: true
    },
    type: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student'
    },
    username: {
        type: String,
        required: [true, 'Username missing'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

UserSchema.pre('remove', function (next) {
    if (this.type == 'student')
        this.model('Course').update({ students: { $elemMatch: { data: this._id } } }, { $pull: { students: { data: this._id } } }, { multi: true }).exec();
    else if (this.type == 'teacher') {
        this.model('User').findOne({ username: 'tbd' }, (err, tbd) => {
            this.model('Course').update({ teacher: this._id }, { $set: { teacher: tbd._id } }, { multi: true }).exec();
            //this.model('User').update({ _id: tbd._id }, { $push: { courses: { $each: this.courses } } }, { multi: true }).exec();
            tbd.courses.push.apply(tbd.courses, this.courses);
            tbd.save();
        })
    }
    next();
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.log('err')
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

//UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
