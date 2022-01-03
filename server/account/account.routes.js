function init({ accountService, productsService }) {
  const express = require("express");
  const router = express.Router();

  router.get('', (req, res, next) => {
    res.render(`pages/content/account/account`);
  });

  router.get('/register', (req, res, next) => {
    res.render(`pages/content/account/register`);
  });

  return router;
}

module.exports = init;
