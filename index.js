// Import dependencies
const productsRouter = require('./server/products/products.routes.js');
const galleryRouter = require('./server/gallery/gallery.routes.js');
const router = require('./server/app.routes.js');
const express = require('express');
const {Client} = require("pg");
const path = require('path');

// Configure the server
const app = express();
const port = 8080;

// Configure the DbConnectionObject
const client = new Client({
    user: 'andrei',
    password: 'andrion1234',
    database: 'andrion',
    host: 'localhost',
    port: 5432
});

// Connect to the database
client.connect();

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Use separately defined routers
app.use(router);
app.use('/gallery', galleryRouter);
app.use('/products', productsRouter({
    dbCon: client,
}));

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
        err.message?.includes('Cannot find') ||
        err.message?.includes('ENOENT')) {
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
