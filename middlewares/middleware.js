var Course = require('../models/course');
var User = require('../models/user');
var m = {};

m.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
}

m.isStudent = (req, res, next) => {
    if(req.isAuthenticated()) {
        if(req.user.type === 'student') {
            return next();
        } else {
            req.flash('error', 'You need to be student to do that!');
            res.redirect('back');
        }
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
}

m.isTeacher = (req, res, next) => {
    if(req.isAuthenticated()) {
        if(req.user.type === 'teacher') {
            return next();
        } else {
            req.flash('error', 'You need to be teacher to do that!');
            res.redirect('back');
        }
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
}

m.isAdmin = (req, res, next) => {
    if(req.isAuthenticated()) {
        if(req.user.type === 'admin') {
            return next();
        } else {
            req.flash('error', 'You need to be admin to do that!');
            res.redirect('back');
        }
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
}

m.checkCourseOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Course.findById(req.params.id, function(err, foundCourse) {
            if(err || !foundCourse) {
                req.flash('error', 'Course not found!');
                res.redirect('back');
            } else {
                if(foundCourse.teacher.equals(req.user._id) || req.user.type == 'admin') {
                    return next();
                } else {
                    req.flash('error', "You don't have permission to do that!");
                    res.redirect('/courses');
                }
            }
        })
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
}

m.checkUserOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        User.findById(req.params.id, function(err, foundUser) {
            if(err || !foundUser) {
                req.flash('error', 'User not found!');
                res.redirect('back');
            } else {
                if(foundUser._id.equals(req.user._id) || req.user.type == 'admin') {
                    return next();
                } else {
                    req.flash('error', "You don't have permission to do that!");
                    res.redirect('/courses');
                }
            }
        })
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
}


module.exports = m;