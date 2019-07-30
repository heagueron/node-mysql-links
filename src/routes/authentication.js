const express = require('express');
const router = express.Router();

const passport = require('passport');

// SIGNUP
router.get('/signup', (req, res) => {
    res.render('auth/signup');
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
            failureRedirect: '/signup' 
        }
));





router.get('/profile', (req, res) => {
    res.send('HERE GOES YOUR PROFILE');
});


module.exports = router;