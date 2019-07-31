const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');


// Add link
router.get('/add', isLoggedIn, (req, res) => {
    //res.send('form');
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    //console.table(req.body);
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };

    // Save to DB:
    await pool.query( 'INSERT INTO links set ?', [newLink] );
    
    // Flash is middleware, it is available here
    req.flash(
        'success', // name of the message
        'Link saved successfully' // message value
        );
    // To make this message available for all views, put it in
    // global variables.
    
    res.redirect('/links');

    //res.render('links/add');
});

// Show links list
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query(
        'SELECT * FROM links WHERE user_id = ?',
        [req.user.id] 
    );
    //console.log({ links });
    res.render('links/list', { links });
});

// Delete link
router.get( '/delete/:id', isLoggedIn, async (req, res) => {
    // console.log(req.params.id);
    // res.send('deleted');
    const { id } = req.params;
    await pool.query( 'DELETE FROM links WHERE ID = ?', [id] );
    req.flash('success', 'Link removed');
    res.redirect('/links');
});

// Edit link
router.get( '/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const link = await pool.query( 'SELECT * FROM links WHERE id = ?', [id] );
    res.render( 'links/edit', {linkData: link[0]} );
});

router.post('/edit/:id',  isLoggedIn, async (req, res) => {
    //console.table(req.body);
    const { id } = req.params;
    const { title, url, description } = req.body;
    const updatedLink = {
        title,
        url,
        description
    };
    // Save to DB:
    await pool.query( 'UPDATE links set ? WHERE id = ?', [updatedLink, id] );
    req.flash('success', `Link \"${updatedLink.title}\" updated`);
    res.redirect('/links');
    
    //res.render('links/add');
});





module.exports = router;