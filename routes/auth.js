var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
const { URL } = require('url');

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
            res.redirect('/courses?failSignup=1');
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

/*router.post('/login', passport.authenticate('local', {
    successRedirect: '/courses',
    failureRedirect: '/courses',
    failureFlash: true
}), (req, res) => {

});*/


/*var backUrl = '';
//(req, res, next) => { backUrl = req.headers.referer + '?failLogin=1'; next(); }
router.post('/login', passport.authenticate('local', {
    successRedirect: '/courses',
    failureRedirect: backUrl,
    failureFlash: true
}), (req, res) => {

});*/

router.post('/login', function(req, res, next) {
    var currentUrl = new URL(req.headers.referer);
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      // Redirect if it fails
      if (!user) { 
          currentUrl.search = 'failLogin=1';
          req.flash('error', info.message);
          return res.redirect(currentUrl.href);
        }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        // Redirect if it succeeds
        return res.redirect('back');
      });
    })(req, res, next);
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