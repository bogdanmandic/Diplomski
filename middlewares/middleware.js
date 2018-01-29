var express = require('express');
var Course = require('../models/course');
var User = require('../models/user');
const { URL } = require('url');
var queryString = require('query-string');
const passport = require('passport');
require('../config/passport')(passport);
var m = {};
var api = {};

m.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        var currentUrl = new URL(req.protocol + '://' + req.get('Host') + '/courses');
        //console.log(currentUrl);
        if (req.headers.referer) {
            currentUrl = new URL(req.headers.referer);
            //console.log('if: ' + currentUrl);
        }
        currentUrl.search = 'failLogin=1';
        req.flash('error', 'Please login first!');
        res.redirect(currentUrl.href);
    }
}

m.isStudent = (req, res, next) => {
    if (req.user.type === 'student') {
        return next();
    } else {
        req.flash('error', 'You need to be student to do that!');
        res.redirect('back');
    }
}


m.isTeacher = (req, res, next) => {
    if (req.user.type === 'teacher') {
        return next();
    } else {
        req.flash('error', 'You need to be teacher to do that!');
        res.redirect('back');
    }
}

m.isAdmin = (req, res, next) => {
    if (req.user.type === 'admin') {
        return next();
    } else {
        req.flash('error', 'You need to be admin to do that!');
        res.redirect('/courses');
    }
}

m.checkCourseOwnership = (req, res, next) => {
    Course.findById(req.params.id, function (err, foundCourse) {
        if (err || !foundCourse) {
            req.flash('error', 'Course not found!');
            res.redirect('back');
        } else {
            if (foundCourse.teacher.equals(req.user._id) || req.user.type == 'admin') {
                return next();
            } else {
                req.flash('error', "You don't have permission to do that!");
                res.redirect('/courses');
            }
        }
    })
}

m.checkUserOwnership = (req, res, next) => {
    User.findById(req.params.id, function (err, foundUser) {
        if (err || !foundUser) {
            req.flash('error', 'User not found!');
            res.redirect('back');
        } else {
            if (foundUser._id.equals(req.user._id) || req.user.type == 'admin') {
                return next();
            } else {
                req.flash('error', "You don't have permission to do that!");
                res.redirect('/courses');
            }
        }
    })
}

m.isEqualArrays = (arr1, arr2) => {
    // check if there are values in arrays
    if (!arr1 || !arr2)
        return false;

    // compare lengths
    if (arr1.length != arr2.length)
        return false;

    // sort arrays before checking
    arr1.sort();
    arr2.sort();

    return arr1.every((el, i) => el == arr2[i]);
}

m.diffInArrays = (arr1, arr2) => {
    if (!arr1)
        arr1 = [];
    else if (!arr2)
        arr2 = [];

    return arr1.filter(x => !arr2.includes(x));

}

api.isLoggedIn = (req, res, next) => {
    return passport.authenticate('jwt', {session: false})(req, res, next);
}

api.isStudent = (req, res, next) => {
    var token = getToken(req.headers);
    if(token) {
        if(req.user.type == 'student') {
            return next();
        } else {
            return res.json({success: false, message: 'You need to be student to do that!'});
        }
    } else {
        res.json({success: false, message: 'No token provided'});
    }
}

api.isTeacher = (req, res, next) => {
    var token = getToken(req.headers);
    if(token) {
        if(req.user.type == 'teacher') {
            return next();
        } else {
            return res.json({success: false, message: 'You need to be teacher to do that!'});
        }
    } else {
        res.json({success: false, message: 'No token provided'});
    }
}

api.isAdmin = (req, res, next) => {
    var token = getToken(req.headers);
    if(token) {
        if(req.user.type == 'admin') {
            return next();
        } else {
            return res.json({success: false, message: 'You need to be admin to do that!'});
        }
    } else {
        res.json({success: false, message: 'No token provided'});
    }
   
}

api.checkUserOwnership = (req, res, next) => {
    User.findById(req.params.id, function (err, foundUser) {
        if (err || !foundUser) {
            res.json({success: false, message: 'User not found.'});
        } else {
            if (foundUser._id.equals(req.user._id) || req.user.type == 'admin') {
                return next();
            } else {
                res.json({success: false, message: 'Unauthorized.'});
            }
        }
    })
}

api.checkCourseOwnership = (req, res, next) => {
    Course.findById(req.params.id, function (err, foundCourse) {
        if (err || !foundCourse) {
            res.json({success: false, message: 'Course not found'});
        } else {
            if (foundCourse.teacher.equals(req.user._id) || req.user.type == 'admin') {
                return next();
            } else {
                res.json({success: false, message: 'Unauthorized.'});
            }
        }
    })
}

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = { m: m, api: api };