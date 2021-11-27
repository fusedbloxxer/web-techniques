// Import dependencies
const galleryRouter = require('./server/gallery/gallery.routes.js')
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
app.use('/gallery', galleryRouter);

// Handle all other routes
app.get('/*', (req, res, next) => {
    res.render(`pages/content${req.url}`, (err, html) => {
        if (err) {
            next(err);
            return;
        }
        res.send(html);
    });
});

// Use error handlers
app.use(function errorLogger(err, req, res, next) {
    console.error(`An error occurred and was caught by the middleware:`);
    console.error(err);
    next(err);
});

app.use(function viewNotFoundHandler(err, req, res, next) {
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

app.use(function forbiddenHandler(err, req, res, next) {
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

app.use(function defaultErrorHandler(err, req, res, next) {
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
