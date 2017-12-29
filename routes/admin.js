var express = require('express');
var router = express.Router();
var m = require('../middlewares/middleware');
var Course = require('../models/course');
var User = require('../models/user');

router.get('/', m.isAdmin, (req, res) => {
    res.render('admin/index');
})

router.get('/courses', m.isAdmin, (req, res) => {
    Course.find({}).populate('teacher').exec( (err, allCourses) => {
        res.render('admin/courses', { allCourses: allCourses });
    });
});

router.get('/users', m.isAdmin, (req, res) => {
    User.find({}).exec();
});


module.exports = router;