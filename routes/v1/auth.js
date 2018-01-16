const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');
const { URL } = require('url');
const h = require('../../helpers/helpers');


router.post('/register', (req, res) => {
    var newUser = new User({
        email: req.body.email,
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            passport.authenticate('local')
                (req, res, () => {
                    res.status(200).json({ "registerSuccess": true });
                });
        }
    });
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

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { 
            h.logError(err, req);
            return next(err); 
        }
        // Redirect if it fails
        if (!user) {
            res.status(404).json(info.message);
        }
        req.logIn(user, function (err) {
            if (err) { 
                h.logError(err, req);
                res.status(200).json(err);
            }
            // Redirect if it succeeds
            res.status(200).json({ "loginSuccess": true });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        res.status(200).json({ "logoutSuccess": true });
    } else {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err);
        }
    }
});

module.exports = router;