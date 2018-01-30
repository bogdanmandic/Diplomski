var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Course = require('../../models/course');
var m = require('../../middlewares/middleware').api;
const h = require('../../helpers/helpers');

router.post('/:cId', m.isLoggedIn, m.isStudent, (req, res) => {
    Course.findById(req.params.cId, (err, foundCourse) => {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err)
        } else {
            if (foundCourse.students.findIndex(e => e.data.equals(req.user._id)) == -1) {
                User.findById(req.user._id, (err, foundUser) => {
                    if (err) {
                        h.logError(err, req);
                        res.status(404).json(err)
                    } else {
                        foundCourse.students.push({ data: req.user._id })
                        foundUser.courses.push(foundCourse._id);
                        foundCourse.save();
                        foundUser.save()
                        res.status(200).json({ "enrollSuccess": true })
                    }
                })
            } else {
                res.status(404).json({ "allreadyEnrolled": true })
            }
        }
    })
})

router.post('/unenroll/:cId', m.isLoggedIn, m.isStudent, (req, res) => {
    Course.findById(req.params.cId, (err, foundCourse) => {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err)
        } else {
            if (foundCourse.students.findIndex(e => e.data.equals(req.user._id)) > -1) {
                User.findById(req.user._id, (err, foundUser) => {
                    if (err) {
                        h.logError(err, req);
                        res.status(404).json(err)
                    } else {
                        var i = foundCourse.students.findIndex(e => e.data == foundUser._id);
                        foundCourse.students.splice(i, 1);
                        foundCourse.save();
                        foundUser.curses.pull(foundCourse._id);
                        foundUser.save();
                        res.status(200).json({ "unEnrolled": true })
                    }
                })
            } else {
                res.status(404).json({ "allreadyUnenrolled": true })
            }
        }
    })
})

module.exports = router;