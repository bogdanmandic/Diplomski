var express = require('express');
var router = express.Router();
var m = require('../middlewares/middleware');
var Course = require('../models/course');
var User = require('../models/user');

router.get('/', m.isAdmin, (req, res) => {
    res.render('admin/index');
})

router.get('/courses', m.isAdmin, (req, res) => {
    Course.find({}).populate('teacher').exec((err, allCourses) => {
        res.render('admin/courses', { allCourses: allCourses });
    });
});

router.get('/users', m.isAdmin, (req, res) => {
    User.find({}, (err, allUsers) => {
        res.render('admin/users', { allUsers: allUsers });
    })
});

router.get('/users/:id/edit',  (req, res) => {
    var enumm = User.schema.path('type').enumValues;
    Course.find({}, 'name', (err, allCourses) => {
        User.findById(req.params.id).populate('courses', 'name').exec((err, foundUser) => {
            if (err || !foundUser) {
                req.flash('error', 'That user can not be found!');
                res.redirect('/admin/users');
            } else {
                var fCourses = allCourses.filter(el => foundUser.courses.findIndex(a => a.id == el.id ) < 0);
                res.render('admin/userEdit', { user: foundUser, enumm: enumm, allCourses: fCourses });
            }
        })
    })
});


module.exports = router;