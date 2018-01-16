const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Course = require('../../models/course');
const Carousel = require('../../models/carousel');
const m = require('../../middlewares/middleware');
// const fs = require('fs');
const h = require('../../helpers/helpers');




// API INDEX
router.get('/', (req, res) => {
    console.log(__dirname);
    Course.find({}).populate('teacher').populate('students.data').exec((err, allCourses) => {
        if (err || !allCourses) {
            h.logError(err, req);
            res.status(404).json(err);
        }
        res.status(200).json(allCourses);
    });
});

// NEW COURSE
router.post('/new', (req, res) => {
    if (req.body.image === '') delete req.body.image;
    User.findOne({ username: req.body.teacher }, (err, foundUser) => { //TODO handle errors
        req.body.teacher = foundUser._id;
        Course.create(req.body, (err, created) => {
            if (err) {
                h.logError(err, req);
                res.status(404).json(err);
            } else {
                foundUser.courses.push(created._id);
                foundUser.save();
                res.status(200).json({
                    success: true
                })
            }
        });
    });

});

// SHOW
router.get('/:id', (req, res) => {
    Course.findById(req.params.id).populate('teacher').populate('students.data').exec((err, foundCourse) => {
        if (err || !foundCourse) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json(foundCourse);
        }
    });
});

// EDIT
router.get('/:id/edit', (req, res) => {
    Course.findById(req.params.id).populate('teacher').populate('students.data').exec((err, foundCourse) => {
        if (err || !foundCourse) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json(foundCourse);
        }
    });
});

// UPDATE
router.put('/:id', (req, res) => {
    const { name, code, description } = req.body;
    let newData = {
        $set: {
            name, code, description
        }
    };
    req.body.image === "" ? newData.$unset = { image: "" } : newData.$set.image = req.body.image;
    Course.findByIdAndUpdate(req.params.id, newData, {new: true, runValidators: true}, (err, updated) => {
        if (err || !updated) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json({
                "success": true
            });
        }
    })
})

// DELETE
router.delete('/:id', (req, res) => {
    Course.findByIdAndRemove(req.params.id, (err, removed) => {
        if (err || !removed) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            removed.remove();
            res.status(200).json({
                "success": true
            })
        }
    })
})


module.exports = router;