var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var m = require('../../middlewares/middleware');

router.get('/', (req, res) => {
    User.find({}, (err, allUsers) => {
        if (err){
            res.json(err)
        } else {
            res.json(allUsers)
        }
    })
})


module.exports = router;