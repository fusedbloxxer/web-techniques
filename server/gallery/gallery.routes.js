function init({
    productsService,
}) {
    // Manage express objects
    const {loadImages, loadRandomImages} = require('./gallery.service.js');
    const express = require('express');
    const router = express.Router();
    const sass = require('sass');
    const path = require('path');
    const ejs = require('ejs');
    const fs = require('fs');

    // Resolve the path to the dynamic gallery assets
    const root = path.resolve(__dirname, '../..');

    // Resolve the path to the dynamic gallery scss file
    let dynamicGalleryScss = 'static/scss/content/gallery/_dynamic-gallery.scss';
    dynamicGalleryScss = path.join(root, dynamicGalleryScss);

    // Resolve the path to the dynamic gallery css file
    let tempDynGallCss = 'static/temp/dynamic-gallery.css';
    tempDynGallCss = path.join(root, tempDynGallCss);

    // Resolve the path to the dynamic gallery scss file
    let tempDynGallScss = 'static/temp/dynamic-gallery.scss';
    tempDynGallScss = path.join(root, tempDynGallScss);

    // Size of array of images in the gallery
    // Is updated in /dynamic-gallery
    let [width, height] = [400, 400];
    let totalImages = 0;

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
            root: path.resolve(__dirname, '../..'),
        });

        productsService.fetchProductTypes().subscribe({
            next: (productTypes) => (
                res.render(`pages/content/gallery/static-gallery`, {
                    productTypes,
                    images,
                })
            ),
            error: () => next({
                status: 404,
                message: 'Error: Product Types Not Found',
            })
        });
    });

    // Extract and redirect to the proper gallery page
    router.get(['/dynamic'], (req, res) => {
        const images = loadRandomImages({
            low: 6,
            high: 14,
            shuffle: true,
            filterBy: (imgs) => imgs,
            root: path.resolve(__dirname, '../..'),
        });

        // Save some properties to use in SCSS
        totalImages = images.length;
        if (totalImages > 0) {
            width = images[0].sizes.large.width;
            height = images[0].sizes.large.height;
        }

        productsService.fetchProductTypes().subscribe({
            next: (productTypes) => (
                res.render(`pages/content/gallery/dynamic-gallery`, {
                    productTypes,
                    images,
                })
            ),
            error: () => next({
                status: 404,
                message: 'Error: Product Types Not Found',
            })
        });
    });

    // Generate a scss custom for n-random images
    router.get('*/dynamic-gallery.css', (req, res, next) => {
        // Set the header content-type to SCSS
        res.setHeader("Content-Type", "text/css");

        // Read the contents of the scss file
        const scss = fs.readFileSync(dynamicGalleryScss)
            .toString('utf-8');

        // Send the data using EJS into SCSS
        const renderedEjs = ejs.render(scss, {
            total: totalImages,
            height: height,
            width: width,
        });

        // Save the compiled EJS / resulting SCSS file
        fs.writeFileSync(tempDynGallScss, renderedEjs);

        // Render the SCSS using SASS and save the CSS result
        sass.render({
            file: tempDynGallScss,
            sourceMap: true
        }, (err, compiledScss) => {
            // Check for errors
            if (err) {
                next(err);
                return;
            }

            // Save the CSS to a temporary file
            fs.writeFileSync(tempDynGallCss, compiledScss.css, (err) => {
                if (err) {
                    next(err);
                }
            });

            // Save the CSS.map to a temporary file
            if (compiledScss.map) {
                fs.writeFileSync(`${tempDynGallCss}.map`, compiledScss.map, (err) => {
                    if (err) {
                        next(err);
                    }
                });
            }

            // Send the result
            res.sendFile(tempDynGallCss);
        });
    });

    // Serve also the css map for the generated
    router.get('*/dynamic-gallery.css.map', (req, res, next) => {
        res.sendFile(`${tempDynGallCss}.map`, (err) => {
            next(err);
        });
    });

    return router;
}

module.exports = init;