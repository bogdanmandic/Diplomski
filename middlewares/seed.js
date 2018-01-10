var express = require('express');
var User = require('../models/user');
var passport = require('passport');


User.find({ type: 'admin' }, (err, foundAdmin) => {
    if(err) {
        console.warn(err);
        res.redirect('/courses');
    } else if(foundAdmin.length == 0) {
        User.register({email: 'admin@admin.com', username: 'admin', type: 'admin'}, 'admin', (err, user) => {
            passport.authenticate('local');
        })
    }
})


User.find({ type: 'teacher' }, (err, foundTeachers) => {
    if(err) {
        console.warn(err);
        res.redirect('/courses');
    } else if(foundTeachers.length == 0) {
        User.register({email: 'tbd@tbd.com', username: 'tbd', type: 'teacher'}, 'tbd', (err, user) => {
            passport.authenticate('local');
        })
    }
})



console.log('SEEEEEED');