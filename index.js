// Import Services
const {ProductsService} = require('./server/products/products.service.js');
const {AccountService} = require('./server/account/account.service.js');

// Import Routers
const productsRouter = require('./server/products/products.routes.js');
const accountRouter = require('./server/account/account.routes.js');
const galleryRouter = require('./server/gallery/gallery.routes.js');
const applicationRouter = require('./server/app.routes.js');

// Import dependencies
const express = require('express');
const {Client} = require("pg");
const path = require('path');
const fs = require('fs');

// Configure the server
const app = express();
const port = process.env.PORT || 8080;

// Check environment and load settings
if (process.env.ENVIRONMENT === 'production') {
    ({ protocol, domainName } = JSON.parse(process.env.HOST));
    var client = new Client(JSON.parse(process.env.DATABASE_CREDENTIALS));
} else {
    const raw = fs.readFileSync(path.join(__dirname, 'config', 'server.json'));
    ({ host: {protocol, domainName }, databaseCredentials } = JSON.parse(raw));
    var client = new Client(databaseCredentials);
}

// Store host address
const host = `${protocol}${domainName}`;

// Connect to the database
client.connect();

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Create dependencies
const productsService = new ProductsService({
    dbCon: client,
});

const accountService = new AccountService({
});

// Use separately defined routers
// and inject the dependencies into them
app.use(applicationRouter({
    productsService,
}));

app.use('/gallery', galleryRouter({
    productsService,
}));

app.use('/products', productsRouter({
    productsService,
}));

app.use('/account', accountRouter({
    accountService,
    productsService
}));

// Handle all other routes
app.get('/*', (req, res, next) => {
    productsService.fetchProductTypes().subscribe({
        next: (productTypes) => (
            res.render(`pages/content${req.url}`, {
                productTypes: productTypes,
            })
        ),
        error: () => next({
            status: 404,
            message: 'Error: Product Types Not Found',
        })
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
        productsService.fetchProductTypes().subscribe({
            next: (productTypes) => (
                res
                    .status(404)
                    .render(
                        'pages/errors/error', {
                            error: {
                                code: 404,
                                title: 'Not Found!',
                                message: 'Could not find the file you requested.',
                                image: '/static/resources/images/errors/error-not-found.jpg'
                            },
                            productTypes,
                        }
                    )
            ),
            error: () => next({
                status: 404,
                message: 'Error: Product Types Not Found',
            })
        });
        return;
    }

    next(err);
})

app.use(function forbiddenHandler(err, req, res, next) {
    if (err.status === 403) {
        productsService.fetchProductTypes().subscribe({
            next: (productTypes) => (
                res
                    .status(403)
                    .render(
                        'pages/errors/error', {
                            error: {
                                code: 403,
                                title: 'Access Is Forbidden',
                                message: 'You are not authorized to access this page.',
                                image: '/static/resources/images/errors/error-forbidden.jpg'
                            },
                            productTypes,
                        }
                    )
            ),
            error: () => next({
                status: 404,
                message: 'Error: Product Types Not Found',
            })
        });
        return;
    }

    next(err);
});

app.use(function defaultErrorHandler(err, req, res, next) {
    productsService.fetchProductTypes().subscribe({
        next: (productTypes) => (
            res
            .status(500)
                .render(
                    'pages/errors/error', {
                        error: {
                            code: 500,
                            title: 'An Internal Error Occurred!',
                            message: 'An unknown error took place.',
                            image: '/static/resources/images/errors/error-general.png'
                        },
                        productTypes,
                    }
                )
        ),
        error: () => next({
            status: 404,
            message: 'Error: Product Types Not Found',
        })
    });
});

// Set the render engine to be usedd
app.set("view engine", "ejs");

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on ${host}`);
});
