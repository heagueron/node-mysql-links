const express = require('express');
const router = express.Router();

const passport = require('passport');

// SIGNUP
router.get('/signup', (req, res) => {
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
    passport.authenticate(
        'local.signup',
        {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            //failureFlash: true 
        }
));


// SIGNIN
router.get('/signin', (req, res) => {
    res.render('auth/signin'); // The form
});

router.post('/signin', (req, res, next) => {

    passport.authenticate(
        'local.signin',
        {
            successRedirect: '/profile',
            failureRedirect: '/signin',
            //failureFlash: true
        }
    )(req, res, next)

});



router.get('/profile', (req, res) => {
    res.send('HERE GOES YOUR PROFILE');
});


module.exports = router;