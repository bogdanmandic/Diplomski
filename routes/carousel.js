var express = require('express');
var router = express.Router();
var Carousel = require('../models/carousel');
var multer = require('multer');
var upload = multer( { dest: './uploads/' });
var m = require('../middlewares/middleware');

router.get('/', m.isAdmin, (req, res) => {
    res.render('carousel/new');
});

router.post('/', m.isAdmin, upload.single('pic'), (req, res) => {
    var newCar = {
        picture: req.file,
        link: req.body.link
    }
    Carousel.create(newCar, (err, createdCourse) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/courses');
        } else {
            req.flash('success', 'New carousel created!');
            res.redirect('/courses');
        }
    })
});

module.exports = router;