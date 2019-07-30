const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Bienvenidos a La Casa de El Express');
});



module.exports = router;