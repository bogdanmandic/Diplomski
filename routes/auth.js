var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// SHOW REGISTER FORM
router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', (req, res) => {
    var newUser = new User({
        email: req.body.email,
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/register');
        } else {
            passport.authenticate('local')
            (req, res, () => {
                req.flash('success', 'Welcome ' + user.username + '.');
                res.redirect('/courses');
            })
        }
    })
});

// LOGIN
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/courses',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {

});

router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        req.flash('success', 'Logged out!');
        res.redirect('/courses');
    } else {
        req.flash('error', 'Noone is logged in!');
        res.redirect('back');
    }
});

module.exports = router;