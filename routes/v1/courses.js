const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Course = require('../../models/course');
const Carousel = require('../../models/carousel');
const m = require('../../middlewares/middleware');

// API INDEX
router.get('/', (req, res) => {
    Course.find({}).populate('teacher').populate('students.data').exec((err, allCourses) => {
        if(err) {
            res.json(err);
        }
        res.json(allCourses);
    });
});

// NEW COURSE
router.post('/new', (req, res) => {
    res.json(req.body);
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