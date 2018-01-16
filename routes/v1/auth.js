var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../../models/user');
const { URL } = require('url');

router.post('/register', (req, res) => {
    var newUser = new User({
        email: req.body.email,
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.json(404, err);
        } else {
            passport.authenticate('local')
                (req, res, () => {
                    res.json(200, { "registerSuccess": true });
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
        if (err) { return next(err); }
        // Redirect if it fails
        if (!user) {
            res.status(404).json(info.message);
        }
        req.logIn(user, function (err) {
            if (err) { res.json(404, err) }
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
            res.status(404).json(err);
        }
    }
});

module.exports = router;