var express = require('express');
var router = express.Router();
var Carousel = require('../../models/carousel');
var multer = require('multer');
var fs = require('fs-extra');
var upload = multer({ dest: './uploads/' });
var m = require('../../middlewares/middleware').api;
const h = require('../../helpers/helpers');

router.get('/', m.isLoggedIn, m.isAdmin, (req, res) => {
    Carousel.find({}, (err, carousels) => {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json(carousels);
        }
    });
})

router.post('/', m.isLoggedIn, m.isAdmin, upload.single('pic'), (req, res) => {

    fs.readFile(req.file.path, (err, newImg) => {
        if (err) {
            h.logError(err);
        }
        var encImg = newImg.toString('base64');
        var a = new Buffer(encImg);
        var newCar = {
            picture: encImg,
            contentType: req.file.mimetype,
            link: req.body.link
        }

        Carousel.create(newCar, (err, createdCar) => {
            if (err) {
                h.logError(err, req);
                res.status(404).json(err);
            } else {
                fs.remove(req.file.path);
                res.status(200).json({success: true});
            }
        })
    });

});

router.delete('/delete/:id', m.isLoggedIn, m.isAdmin, (req, res) => {
    Carousel.findById(req.params.id, (err, deleted) => {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err);
        }
        deleted.remove();
        res.status(200).json({success: true});
    });
})

module.exports = router;