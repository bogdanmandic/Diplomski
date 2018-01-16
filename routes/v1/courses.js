var express = require('express');
var router = express.Router();
var Course = require('../../models/course');
var Carousel = require('../../models/carousel');
var User = require('../../models/user');
const url = require('url');
var m = require('../../middlewares/middleware');

// API INDEX
router.get('/', (req, res) => {
    Course.find({}).populate('teacher').populate('students.data').exec((err, allCourses) => {
        if(err) {
            res.json(err);
        }
        res.json(allCourses);
    });
});

// SHOW
router.get('/:id', (req, res) => {
    Course.findById(req.params.id).populate('teacher').populate('students.data').exec((err, foundCourse) => {
        if (err || !foundCourse) {
            res.json(err);
        } else {
            res.json(foundCourse);
        }
    });
});


module.exports = router;