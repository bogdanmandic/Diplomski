const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: String,
    code: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        default: 'http://via.placeholder.com/250x200'
    },
    description: String
});

module.exports = mongoose.model('Course', CourseSchema);