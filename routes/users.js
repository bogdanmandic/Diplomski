var express = require('express');
var router = express.Router();
var User = require('../models/user');

// INDEX
router.get('/', (req, res) => {
	User.find({}, (err, users) => {
		if (err) {
			req.flash("error", err.message);
			res.redirect("/courses");
		} else {
			res.render('./users/index', { users: users });
		}
	})
});

// NEW (register)

// CREATE (auth.js)

// SHOW
router.get('/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err || !foundUser) {
			req.flash('error', err.message);
			res.redirect('/courses');
		} else {
			res.render('./users/show', { user: foundUser });
		}
	})
});

// EDIT
router.get('/:id/edit', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/courses');
		} else {
			res.render('users/edit', { user: foundUser });
		}
	})
});

// UPDATE
router.put('/:id', (req, res) => {
	let newData = {
		$set: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
		}
	};
	req.body.image === '' ? newData.$unset = { image: '' } : newData.$set.image = req.body.image;
	User.findByIdAndUpdate(req.params.id, newData, (err, updatedUser) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/courses');
		} else {
			req.flash('success', 'Successfuly updated');
            res.redirect('/courses/' + updatedUser.id);
		}
	})

});

// DELETE
router.delete('/:id', (req, res) => {
	User.findByIdAndRemove(req.params.id, (err, deleted) => {
		if(err) {
        	req.flash('error', err.message);
            res.redirect('/courses');
        } else {
            req.flash('success', 'Successfully Removed!');
            res.redirect('/courses');
        }
	})
})

module.exports = router;
