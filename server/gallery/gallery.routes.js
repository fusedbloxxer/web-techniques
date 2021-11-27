// Manage express objects
const {loadImages} = require('./gallery.service.js');
const express = require('express');
const router = express.Router();

// Define available gallery types
const galleryTypes = Object.freeze([
    'static',
    'dynamic'
]);

// Intercept all requests to this router
router.use(function(req, res, next) {
    console.log('Gallery middleware in action...');
    next();
});

router.get(['', '/'], (req, res) => {
    res.redirect('/gallery/static');
})

// Redirect default page to the static gallery page
router.get('/static', (req, res) => {
    const images = loadImages({
        filterByMonth: true,
        takeWithinLimit: true,
        filterByAvailability: true,
    });
    res.render(`pages/content/gallery/static-gallery`, {
        images
    });
});

// Extract and redirect to the proper gallery page
router.get(['/dynamic'], (req, res) => {
    res.render(`pages/content/gallery/dynamic-gallery`);
});

module.exports = router;