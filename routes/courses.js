var express = require('express');
var router = express.Router();
var Course = require('../models/course');
var Carousel = require('../models/carousel');
var User = require('../models/user');
var m = require('../middlewares/middleware');


// INDEX
router.get('/', (req, res) => {
    Carousel.find({}, (err, car) => {
        Course.find({}, (err, allCourses) => {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/courses');
            } else {
                res.render('courses/index', { courses: allCourses, carousel: car });
                //res.json(allCourses);
            }
        });
    });
});

// NEW
router.get('/new', m.isAdmin, (req, res) => {
    res.render('courses/new');
});

// CREATE
router.post('/', m.isTeacher, (req, res) => {
    if (req.body.image === '') delete req.body.image;
    req.body.teacher = req.user._id;
    Course.create(req.body, (err, created) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/courses');
        } else {
            User.findById(req.user._id, (err, foundUser) => {
                foundUser.courses.push(created._id);
                foundUser.save();
            });
            req.flash('success', 'New course created!');
            res.redirect('/courses');
        }
    })
})

// SHOW
router.get('/:id', (req, res) => {
    Course.findById(req.params.id).populate('teacher').exec( (err, foundCourse) => {
        if (err || !foundCourse) {
            req.flash('error', 'There was an error or that course can\'t be found');
            res.redirect('/courses');
        } else {
            res.render('courses/show', { course: foundCourse });
        }
    })
})

// EDIT
router.get('/:id/edit', m.checkCourseOwnership, (req, res) => {
    Course.findById(req.params.id, (err, foundCourse) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/courses');
        } else {
            res.render('courses/edit', { course: foundCourse });
        }
    })
})

// UPDATE
router.put('/:id', m.checkCourseOwnership, (req, res) => {
    var newData = {
        $set: {
            name: req.body.name,
            code: req.body.code,
            //image: req.body.image,
            description: req.body.description
        }
    };
    req.body.image === "" ? newData.$unset = { image: "" } : newData.$set.image = req.body.image;
    Course.findByIdAndUpdate(req.params.id, newData, { new: true }, (err, updated) => {
        if (err) {
            req.flash('error', err.message);
            console.log(err);
            res.redirect('/courses');
        } else {
            req.flash('success', 'Successfully Updated!');
           
            res.redirect('/courses/' + updated.id);
        }
    })
})

// DELETE
router.delete('/:id', (req, res) => {
    Course.findById(req.params.id, (err, removed) => {
        if(err) {
            req.flash('error', err.message);
            res.redirect('/courses');
        } else {
            removed.remove();
            req.flash('success', 'Successfully Removed!');
            res.redirect('back');
        }
    })
})


module.exports = router;