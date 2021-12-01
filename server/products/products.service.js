const rxjs = require('rxjs');
const {map} = require('rxjs/operators');

function ProductsService({ dbCon }) {
    // Extract args
    this.dbCon = dbCon;

    // Get all the product types from the db
    this.fetchProductTypes = function() {
        return rxjs.from(this.dbCon.query(`
            SELECT UNNEST(ENUM_RANGE(NULL::device_type));
        `))
        .pipe(
            map(data => data.rows.map(row => row.unnest))
        );
    }

    // Get all the product categories from the db
    this.fetchProductCategories = function() {
        return rxjs.from(this.dbCon.query(`
            SELECT UNNEST(ENUM_RANGE(NULL::category));
        `))
        .pipe(
            map(data => data.rows.map(row => row.unnest))
        )
    }

    // Get all operating system options from the db
    this.fetchProductOperatingSystems = function() {
        return rxjs.from(this.dbCon.query(`
            SELECT UNNEST(ENUM_RANGE(NULL::operating_system));
        `))
        .pipe(
            map(data => data.rows.map(row => row.unnest))
        );
    }

    // Filter the products from the db by deviceType
    this.fetchProductsByType = function(productType) {
        // Create a sql query string
        let query = {
            sql: '',
            params: undefined,
        };

        // Prepare the query for the db
        if (productType) {
            query = {
                sql: `
                    SELECT *
                    FROM product
                    WHERE device_type = $1;
                `,
                params: [productType]
            };
        } else {
            query = {
                sql: `
                    SELECT *
                    FROM product;
                `,
                params: undefined,
            };
        }

        // Send the request and extract the rows
        return rxjs.from(this.dbCon.query(...Object.values(query))).pipe(
            map(data => {
                // Extract the rows from the db response
                const products = data.rows;

                products.forEach(product => {
                    // Add custom url to each product
                    const dashedString = product.name.replaceAll(' ', '-');
                    const encodedName = encodeURIComponent(dashedString);
                    product.url = `/products/${product.id}-${encodedName}`
                });

                // Return the products
                return products;
            })
        );
    }
}

module.exports = {
    ProductsService
};