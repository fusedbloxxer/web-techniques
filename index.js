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

// Configure the server
const app = express();
const port = process.env.PORT || 8080;

// Configure the DbConnectionObject
const client = new Client({
    user: 'andrei',
    password: 'andrion1234',
    database: 'andrion',
    host: 'localhost',
    port: 5432
});

// const client = new Client({
//     user: 'iwopmcbxppwqnw',
//     password: 'c87f2cbec070cdca0b09d0acfb415824222c18822fe8a8a782783f92ff4f3dd5',
//     database: 'df33m1b15fq4lh',
//     host: 'ec2-52-0-93-3.compute-1.amazonaws.com',
//     port: 5432,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

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
    console.log(`Server is listening on http://localhost:${port}/`);
});
