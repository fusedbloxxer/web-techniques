function init({
    productsService,
}) {
    const express = require('express');
    const router = express.Router();
    const rxjs = require('rxjs');

    router.get('', (req, res, next) => {
        rxjs.forkJoin({
            operatingSystems: productsService.fetchProductOperatingSystems(),
            products: productsService.fetchProductsByType(req.query.type),
            productCategories: productsService.fetchProductCategories(),
        }).subscribe({
            next: ({
                    productCategories,
                    operatingSystems,
                    products,
                }) => (
                res.render('pages/content/products/products', {
                    maxPrice: Math.max(...products.map(p => p.price)),
                    productCategories,
                    priceStep: 0.025,
                    operatingSystems,
                    products,
                })
            ),
            error: (err) => next({
                status: 404,
                message: 'Error: Could Not Fetch the Product Types',
            })
        });
    });

    router.get('/:id-:name', (req, res, next) => {
        const productId = req.params.id;
        res.render('pages/content/products/product');
    });

    return router;
}

module.exports = init;