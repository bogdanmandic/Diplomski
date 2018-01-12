const mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
    name: String,
    code: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        default: 'http://via.placeholder.com/250x200'
    },
    description: String,
    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    curriculum: {
        goal: String,
        content: String,
        referenceBooks: [{
            book: String,
            author: String
        }]
    },
    calendar: {
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        }
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