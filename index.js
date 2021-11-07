// Import dependencies
const router = require('./server/app.routes.js');
const express = require('express');
const path = require('path');

// Configure the server
const app = express();
const port = 8080;

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Use a separately defined router
app.use(router);

// Use error handlers
router.use(function errorLogger(err, req, res, next) {
    console.error(`An error occurred and was caught by the middleware:`);
    console.error(err);
    next(err);
});

router.use(function viewNotFoundHandler(err, req, res, next) {
    if (err.message?.includes('Failed to lookup view') ||
        err.message?.includes('Cannot find')) {
        res
            .status(404)
            .render(
                'pages/errors/error',
                {
                    error: {
                        code: 404,
                        title: 'Not Found!',
                        message: 'Could not find the file you requested.',
                        image: '/static/resources/images/errors/error-not-found.jpg'
                    }
                }
            );
        return;
    }

    next(err);
})

router.use(function forbiddenHandler(err, req, res, next) {
    if (err.status === 403) {
        res
            .status(403)
            .render(
                'pages/errors/error',
                {
                    error: {
                        code: 403,
                        title: 'Access Is Forbidden',
                        message: 'You are not authorized to access this page.',
                        image: '/static/resources/images/errors/error-forbidden.jpg'
                    }
                }
            )
        return;
    }

    next(err);
});

router.use(function defaultErrorHandler(err, req, res, next) {
    res
        .status(500)
        .render(
            'pages/errors/error',
            {
                error: {
                    code: 500,
                    title: 'An Internal Error Occurred!',
                    message: 'An unknown error took place.',
                    image: '/static/resources/images/errors/error-general.png'
                }
            }
        );

    return;
});

// Set the render engine to be usedd
app.set("view engine","ejs");

// Start the server
app.listen(port, () => {
    console.log("Server is listening on http://localhost:8080/");
});

// const sharp = require('sharp');
// const fs = require('fs');

// app.get(['/', '/index', '/home'], function(req, res) {
//     res.sendFile(`${__dirname}\\src\\html\\index.html`);

//     // Calea relativa la folderul views
//     console.log(req.ip);

//     // ! foloseste sharp pentru img resize

//     // Cale absoluta
//     // Ceva redimensionare cu sharp?
//     // let buf = fs.readFileSync(__dirname + '\\src\\resources\\json\\gallery.json').toString();
//     // let galleryJson = JSON.parse(buf);
//     // console.log(galleryJson);
//     // for (let img of galleryJson.images) {
//     //     let [name, extension] = img.filename.split('.');
//     //     console.log(name, extension);
//     // }

//     // res.render('pages/index', {
//     //     imagesPath: galleryJson["gallery-path"],
//     //     images: galleryJson.images,
//     //     ip: req.ip,
//     // });
// });
