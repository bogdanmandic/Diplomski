var express = require('express');
var router = express.Router();
var User = require('../models/user');
var m = require('../middlewares/middleware');

// INDEX
router.get('/', m.isAdmin, (req, res) => {
	User.find({}, (err, users) => {
		if (err) {
			req.flash("error", err.message);
			res.redirect("/courses");
		} else {
			res.render('./users/index', { users: users });
		}
	})
});

// NEW (auth.js)

// CREATE (auth.js)

// SHOW
router.get('/:id', (req, res) => {
	User.findById(req.params.id).populate({path: 'courses', populate: { path: 'students.data' }}).exec( (err, foundUser) => {
		if (err || !foundUser) {
			req.flash('error', "User can't be found" );
			res.redirect('/courses');
		} else if(foundUser.type == 'student') {
			res.render('./users/student', { user: foundUser });
		} else if(foundUser.type == 'teacher') {
			res.render('./users/teacher', { user: foundUser });
		} else {
			res.redirect('/courses');
		}
	})
});

// EDIT
router.get('/:id/edit', m.checkUserOwnership, (req, res) => {
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
router.put('/:id', m.checkUserOwnership, (req, res) => {
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
            res.redirect('/users/' + updatedUser.id);
		}
	})

});

// DELETE
router.delete('/:id', m.checkUserOwnership, (req, res) => {
	User.findById(req.params.id, (err, deleted) => {
		if(err || !deleted) {
        	req.flash('error', 'No user to delete');
            res.redirect('/courses');
        } else {
			deleted.remove();
            req.flash('success', 'Successfully Removed!');
            res.redirect('/users');
        }
	})
})

module.exports = router;
