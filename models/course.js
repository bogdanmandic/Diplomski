const mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        default: 'http://via.placeholder.com/250x200'
    },
    description: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        data: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        entryDate: {
            type: Date,
            default: Date.now
        },
        _id: false
    }]
});


CourseSchema.pre('remove', function (next) {
    this.model('User').update({ courses: this._id }, { $pull: { courses: this._id } }, { multi: true }).exec();
    next();
});

module.exports = mongoose.model('Course', CourseSchema);