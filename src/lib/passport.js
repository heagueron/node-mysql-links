const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');

const helpers = require('../lib/helpers');

passport.use(
    'local.signup', 
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true  // Maybe pass another fields
        }, 
        async ( req, username, password, done ) => {
            const { fullname } = req.body;
            const newUser = {
                username,
                password,
                fullname
            };
            newUser.password = await helpers.encryptPassword(password);
            const result = await pool.query('INSERT INTO users SET ?', [newUser]);
            //console.log({result});
            newUser.id = result.insertId;
            return done(null, newUser);
        }
) );

// Store user to session
passport.serializeUser ((user, done) =>{
    done(null, user.id);
});

// Get user from session
passport.deserializeUser (async (id, done) =>{
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});