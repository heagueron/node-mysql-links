const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');

const helpers = require('../lib/helpers');


// Method for login
passport.use(
    'local.signin', 
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true  // Maybe pass another fields
        }, 
        async ( req, username, password, done ) => {
            const rows = await pool.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            if (rows.length > 0 ) {
                const user = rows[0]; // user from db
                const validPassword = await helpers.matchPassword(password, user.password);
                if (validPassword){
                    // done(null, user, req.flash('success', 'welcome '+user.username));
                    console.log('welcome');
                    done(null, user);
                } else {
                    // done(null, false, req.flash('message', 'Incorrect password'));
                    console.log('Incorrect password');
                    done(null, user);
                }
            } else {
                // return done(null, false, req.flash('message', 'Username not found'));
                console.log('Username not found');
                done(null, false);
            }
        }
) );



// Method for signup
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