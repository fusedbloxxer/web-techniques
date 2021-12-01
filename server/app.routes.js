function init({
    productsService,
}) {
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

    router.get(['/home'], (req, res, next) => {
        const images = loadImages({
            filterByMonth: true,
            takeWithinLimit: true,
            filterByAvailability: true,
            root: path.resolve(__dirname, '..'),
        });

        productsService.fetchProductTypes().subscribe({
            next: (productTypes) => {
                res.render(
                    'pages/content/home', {
                        productTypes,
                        ip: req.ip,
                        images
                    }
                );
            },
            error: () => next({
                status: 404,
                message: 'Error: Product Types Not Found',
            })
        });
    });

    router.get('/*.ejs', (req, res, next) => {
        next({
            status: 403,
            message: 'Error: Server File Requested'
        })
    });

    return router;
}

module.exports = init;