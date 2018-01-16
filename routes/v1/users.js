var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var m = require('../../middlewares/middleware');

// INDEX
router.get('/', (req, res) => {
    User.find({}, (err, allUsers) => {
        if (err){
            res.sendStatus(404);
        } else {
            res.json(allUsers)
        }
    })
})

// SHOW
router.get('/:id', (req, res) => {
    User.findById(req.params.id).populate({path: 'courses', populate : {path: 'students.data'}}).exec ( (err, foundUser) => {
        if(err || !foundUser){
            res.status(404);
        } else {
            res.json(foundUser);
        }
    })
})

// EDIT
router.get('/:id/edit', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err || !foundUser){
            res.status(404);
        } else {
            res.json(foundUser)
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
        if(err){
            res.status(404);
        } else {
            res.status(200).json({"updateSuccess" : true})
        }
    })
})

// DELETE

router.delete('/:id', (req, res) => {
    User.findById(req.params.id, (err, deleted) => {
        if(err || !deleted){
            res.status(404)
        } else {
            deleted.remove();
            res.status(200).json({"Deleted": true})
        }
    })
})


module.exports = router;