const express = require('express');
const router = express.Router();

const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup'); // The form
});

/*
router.post('/signup', (req, res) => {
    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup'
    })
});
*/

router.post(
    '/signup', 
    isNotLoggedIn,
    passport.authenticate(
        'local.signup',
        {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            //failureFlash: true 
        }
));


// SIGNIN
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin'); // The form
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {

    passport.authenticate(
        'local.signin',
        {
            successRedirect: '/profile',
            failureRedirect: '/signin',
            //failureFlash: true
        }
    )(req, res, next);

});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});


module.exports = router;