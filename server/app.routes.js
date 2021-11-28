const {loadImages} = require('./gallery/gallery.service.js');
const express = require('express');
const router = express.Router();
const path = require('path');

// Intercept all requests to this router
router.use(function(req, res, next) {
    console.log('Middleware in action...');
    next();
});

router.get(['/', '/index'], (req, res) => {
    res.redirect('/home');
});

router.get(['/home'], (req, res) => {
    const images = loadImages({
        filterByMonth: true,
        takeWithinLimit: true,
        filterByAvailability: true,
        root: path.resolve(__dirname, '..'),
    });

    res.render(
        'pages/content/home', {
            ip: req.ip,
            images
        }
    );
});

router.get('/*.ejs', (req, res, next) => {
    next({
            status: 403,
            message: 'Error: Server File Requested'
    })
});

module.exports = router;