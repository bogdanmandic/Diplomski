var express = require('express');
var Course = require('../models/course');
var User = require('../models/user');
const { URL } = require('url');
var queryString = require('query-string');

var m = {};

m.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        console.log(req.headers.referer);
        req.flash('error', 'Please login first!');
        res.redirect(req.headers.referer);
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
        var url = new URL(req.headers.referer);
        console.log(url.search);
        url.search = 'failLogin=1';
        req.flash('error', 'Please login first!');
        console.log(url.href);
        res.redirect(url.href);
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
        res.redirect(req.headers.referer + '?failLogin=1');
    }
}

m.isAdmin = (req, res, next) => {
    if(req.isAuthenticated()) {
        if(req.user.type === 'admin') {
            return next();
        } else {
            req.flash('error', 'You need to be admin to do that!');
            res.redirect('/courses');
        }
    } else {
        req.flash('error', 'Please login first!');
        res.redirect(req.headers.referer + '?failLogin=1');
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
        res.redirect(req.headers.referer + '?failLogin=1');
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
        res.redirect(req.headers.referer + '?failLogin=1');
    }
}

m.isEqualArrays = (arr1, arr2) => {
    // check if there are values in arrays
    if(!arr1 || !arr2)
        return false;

    // compare lengths
    if(arr1.length != arr2.length)
        return false;

    // sort arrays before checking
    arr1.sort();
    arr2.sort();

    return arr1.every((el,i) => el == arr2[i]);
}

m.diffInArrays = (arr1, arr2) => {
    if(!arr1)
        arr1 = [];
    else if(!arr2)
        arr2 = [];

    return arr1.filter(x => !arr2.includes(x));

}


module.exports = m;