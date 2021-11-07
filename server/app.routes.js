const express = require('express');
const router = express.Router();

// Intercept all requests to this router
router.use(function(req, res, next) {
    console.log('Middleware in action...');
    next();
});

router.get(['/', '/index'], (req, res) => {
    res.redirect('/home');
});

router.get(['/home'], (req, res) => {
    res.render(
        'pages/content/home',
        {
            ip: req.ip,
        }
    );
});

router.get('/*.ejs', (req, res, next) => {
    next({
            status: 403,
            message: 'Error: Server File Requested'
    })
});

router.get('/*', (req, res, next) => {
    res.render(`pages/content${req.url}`, (err, html) => {
        if (err) {
            next(err);
            return;
        }
        res.send(html);
    });
});

module.exports = router;