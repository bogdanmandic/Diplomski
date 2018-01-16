const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Course = require('../../models/course');
const Carousel = require('../../models/carousel');
const m = require('../../middlewares/middleware');

// ALL COURSES
router.get('/', (req, res) => {
    Course.find({}, (err, courses) => {
        if (err) {
            res.json(err);
        }
        res.json(courses);
    })
});


// NEW COURSE
router.post('/new', (req, res) => {
    res.json(req.body);
})

module.exports = router;