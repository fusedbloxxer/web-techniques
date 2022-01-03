function init({
    productsService,
}) {
    const {loadImages} = require('./gallery/gallery.service.js');
    const {forkJoin, iif, tap, of} = require('rxjs');
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
        // Load gallery images
        const images = loadImages({
            filterByMonth: true,
            takeWithinLimit: true,
            filterByAvailability: true,
            root: path.resolve(__dirname, '..'),
        });

        // Init slideshow if necessary
        if (!req.app.locals.slideShow) {
            req.app.locals.slideShow = {
                lastRequest: new Date(0),
            };
        }

        // Get stored slideShowState
        const slideShow = req.app.locals.slideShow;

        // Previous request timestamp
        const {lastRequest} = slideShow;

        // Time in seconds
        const timePassed = Math.abs(new Date() - lastRequest) / 1000;

        // Get new sample or previous batch
        const randomProducts = iif(
            () => timePassed >= 15,
            productsService.fetchRandomProducts({
                sampleSize: 5,
            }).pipe(
                tap(products => {
                    slideShow.products = products;
                    slideShow.lastRequest = new Date();
                })
            ),
            of(slideShow.products)
        )

        // Launch requests and send the result
        forkJoin({
            products: randomProducts,
        }).subscribe({
            next: ({ products }) => {
                res.render(
                    'pages/content/home', {
                        ip: req.ip,
                        products,
                        images
                    }
                );
            },
            error: (error) => next({
                status: 404,
                message: 'Error: Could not load product data from database.',
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