const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const m = require('../../middlewares/middleware');
const h = require('../../helpers/helpers');


// INDEX
router.get('/', (req, res) => {
    User.find({}, (err, allUsers) => {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json(allUsers)
        }
    })
})

// SHOW
router.get('/:id', (req, res) => {
    User.findById(req.params.id).populate({ path: 'courses', populate: { path: 'students.data' } }).exec((err, foundUser) => {
        if (err || !foundUser) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json(foundUser);
        }
    })
})

// EDIT
router.get('/:id/edit',  (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json(foundUser)
        }
    })
})

// Update 

router.put('/:id', (req, res) => {
    console.log(req.body)
    const {firstName, lastName, email } = req.body;
    let newData = {
        $set: {
            firstName,
            lastName,
            email
        }
    };
    req.body.image === '' ? newData.$unset = {image: ''} : newData.$set.image = req.body.image;
    User.findByIdAndUpdate(req.params.id, newData, (err, updatedUser) => {
        if (err) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            res.status(200).json({ "updateSuccess": true })
        }
    })
})

// DELETE

router.delete('/:id', (req, res) => {
    User.findById(req.params.id, (err, deleted) => {
        if (err || !deleted) {
            h.logError(err, req);
            res.status(404).json(err);
        } else {
            deleted.remove();
            res.status(200).json({ "Deleted": true })
        }
    })
})


module.exports = router;