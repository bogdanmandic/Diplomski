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
    kind: {
        type: String,
        enum: ['admin', 'teacher', 'student']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPromote: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: [true, 'Username missing'],
        unique: true
    },
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
