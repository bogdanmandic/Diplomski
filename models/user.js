const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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
    password: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

UserSchema.pre('remove', function (next) {
    this.model('Course').update({ students: { $elemMatch: { data: this._id } } },{ $pull: { students: { $elemMatch: { data: this._id } }  } }, { multi: true }).exec();
    next();
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
