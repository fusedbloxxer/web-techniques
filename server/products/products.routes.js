const express = require('express');

function init({ dbCon: client }) {
    const router = express.Router();

    router.get("/", (req, res) => {
        console.log(req.query);
        const condition = '';
        if ('category' in req.query) {
            condition = ` AND category='${req.query.category}'`;
        }
        client.query(`
            SELECT *
            FROM product
            WHERE 1=1 ${condition};
        `, (err, data) => {
            if (!err) {
                console.log(data.rows);
                res.send(data.rows);
            } else {
                console.error('oops');
            }
        });
    });

    router.get("/:id", (req, res) => {
        console.log(req.params);
        client.query(`
            SELECT *
            FROM product
            WHERE id=${req.params.id};
        `, (err, data) => {
            if (!err) {
                console.log(data.rows);
                res.send(data.rows)
            } else {
                console.error('oops');
            }
        });
    });

    return router;
}

module.exports = init;