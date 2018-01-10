var express = require('express');
var router = express.Router();
var Carousel = require('../models/carousel');
var multer = require('multer');
var fs = require('fs-extra');
var upload = multer({ dest: './uploads/' });
var m = require('../middlewares/middleware');

router.get('/new', m.isAdmin, (req, res) => {
    res.render('carousel/new');
});

router.post('/', m.isAdmin, upload.single('pic'), (req, res) => {

    fs.readFile(req.file.path, (err, newImg) => {
        var encImg = newImg.toString('base64');
        var a = new Buffer(encImg);
        var newCar = {
            picture: encImg,
            contentType: req.file.mimetype,
            link: req.body.link
        }

        Carousel.create(newCar, (err, createdCar) => {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/courses');
            } else {
                fs.remove(req.file.path);
                req.flash('success', 'New carousel created!');
                res.redirect('/courses');
            }
        })
    });

});

router.get('/test', (req, res) => {
    Carousel.find({}, (err, foundCars) => {

        /*var a = 'Hello';
        var b = a.toString('base64');
        var c = Buffer(a).toString('base64');
        var d = Buffer(c, 'base64').toString('ascii');
        var e = Buffer(c, 'base64').toString('ascii');
        console.log('a: ' + a);
        console.log('b: ' + b);
        console.log('c: ' + c);
        console.log('d: ' + d);
        console.log('e: ' + e);
        console.log('==========');*/

        res.render('carousel/index', { car: foundCars });

    })
})

router.get('/delete', m.isAdmin, (req, res) => {
    Carousel.remove({}).exec();
    res.redirect('/courses');
})

module.exports = router;