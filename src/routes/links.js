const express = require('express');
const router = express.Router();


const pool = require('../database');


// Add link
router.get('/add', (req, res) => {
    //res.send('form');
    res.render('links/add');
});

router.post('/add',  async (req, res) => {
    //console.table(req.body);
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    // Save to DB:
    await pool.query( 'INSERT INTO links set ?', [newLink] );
    
    //req.flash('success', 'Link saved successfully');
    
    res.redirect('/links');

    //res.render('links/add');
});

// Show links list
router.get('/', async (req, res) => {
    const links = await pool.query( 'SELECT * FROM links' );
    //console.log({ links });
    res.render('links/list', { links });
});

// Delete link
router.get( '/delete/:id', async (req, res) => {
    // console.log(req.params.id);
    // res.send('deleted');
    const { id } = req.params;
    await pool.query( 'DELETE FROM links WHERE ID = ?', [id] );
    res.redirect('/links');
});

// Edit link
router.get( '/edit/:id', async (req, res) => {
    const { id } = req.params;
    const link = await pool.query( 'SELECT * FROM links WHERE id = ?', [id] );
    res.render( 'links/edit', {linkData: link[0]} );
});

router.post('/edit/:id',  async (req, res) => {
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
    res.redirect('/links');

    //res.render('links/add');
});





module.exports = router;