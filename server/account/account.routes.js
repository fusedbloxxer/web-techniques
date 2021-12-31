function init({ accountService, productsService }) {
  const express = require("express");
  const router = express.Router();

  router.get("", (req, res, next) => {
    productsService.fetchProductTypes().subscribe({
      next: (productTypes) =>
        res.render(`pages/content/account/account`, {
          productTypes,
        }),
      error: () =>
        next({
          status: 404,
          message: "Error: Product Types Not Found",
        }),
    });
  });

  return router;
}

module.exports = init;
