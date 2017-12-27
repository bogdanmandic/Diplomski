var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Course = require('../models/course');

router.post('/enroll/:courseId', (req, res) => {
    if (req.isAuthenticated()) {
        Course.findById(req.params.courseId, (err, foundCourse) => {
            User.findById(req.user._id, (err, foundUser) => {
                foundCourse.students.push({ data: req.user._id });
                foundUser.courses.push(foundCourse._id);
                foundCourse.save();
                foundUser.save();
                req.flash('success', 'Successfully added this course to your list.');
                res.redirect('/courses/' + req.params.courseId);
            });
        });
    } else {
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('/login');
    }
});

router.post('/unenroll/:courseId', (req, res) => {
    if(req.isAuthenticated()) {
        Course.findById(req.params.courseId, (err, foundCourse) => {
            User.findById(req.user._id, (err, foundUser) => {
                var i = foundCourse.students.findIndex(e => e.data == foundUser._id);
                foundCourse.students.splice(i,1);
                foundCourse.save();
                foundUser.courses.pull(foundCourse._id);
                foundUser.save();
                req.flash('success', 'Successfully deleted this course from your list.');
                res.redirect('/courses/' + req.params.courseId);
            })
        })
    }
})



module.exports = router;