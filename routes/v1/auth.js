const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport')(passport);
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const m = require('../../middlewares/middleware').api;



router.post('/register', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Username already exists.', err: err });
            }
            res.json({ success: true, msg: 'Successful created new user.' });
        });
    }
})

router.post('/login', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    user = user.toObject();
                    //user.password = '';
                    var token = jwt.sign(user, 'SomeSuperSecret');
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });

                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});

router.get('/currentUser', m.isLoggedIn,  (req, res) => {
    if(req.user) {
        return res.json(req.user);
    } else {
        return res.json({success: 'false', message: 'No req.user'});
    }
})

/*router.post('/register', (req, res) => {
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
});*/

/*router.post('/login', function (req, res, next) {
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
});*/

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