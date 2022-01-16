const formidable = require('formidable');
const express = require("express");
const path = require('path');
const fs = require('fs');

function init({
  dbCon,
  tokenService,
  accountService,
  productsService,
}) {
  const router = express.Router();

  const userImagesFolder = path.join(
    __dirname,
    '..',
    '..',
    'data',
    '#USERNAME',
    'images',
  );

  const userImageFilePath = path.join(
    userImagesFolder,
    '#IMAGE_FILE'
  );

  router.get('', (req, res, next) => {
    res.render(`pages/content/account/account`);
  });

  router.get('/register', (req, res, next) => {
    res.render(`pages/content/account/register`);
  });

  router.post('/register/submit', (req, res, next) => {
    const formular = new formidable.IncomingForm();
    let username;

    formular.parse(req, function(err, fields, files) {
      const formValidationResult = accountService.isFormValid(fields, files);

      if (!formValidationResult.isValid) {
        res.render(`pages/content/account/register`, {
          error: formValidationResult.error,
        });
        return;
      }

      accountService.userExists(fields.username, fields.email).subscribe({
        next: (userExists) => {
          if (userExists) {
            res.render(`pages/content/account/register`, {
              error: `The user with the username '${fields.username}' and '${fields.email}' already exists`,
            });
            return;
          }

          accountService.createUser(fields, files).subscribe({
            next: () => {
              res.redirect(`/`);
              return;
            },
            error: (err) => {
              console.error(err);
              res.render(`pages/content/account/register`, {
                error: 'Database error',
              });
              return;
            }
          });
        },
        error: (error) => {
          res.render(`pages/content/account/register`, {
            error: 'Database error',
          });
          return;
        }
      });
    });

    // Read all fields
    formular.on("field", function(fieldName, fieldValue) {
      console.log("----> ", fieldName, fieldValue);
      if (fieldName == 'username') {
        username = fieldValue
      }
    });

    // Start the upload of the file
    formular.on("fileBegin", function(name, file) {
      if(!file.originalFilename)
          return;

      // Check if the file is jpg otherwise reject it
      if (file.originalFilename.split('.').slice(-1)?.[0] !== 'jpg') {
        return;
      }

      // Log the file name
      console.log("----> ", name, file.originalFilename);

      // Save the photo in a user's own folder
      const folder = userImagesFolder.replace('#USERNAME', username);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {recursive: true});
      }

      // Set the file to be saved in the user's own folder'
      file.filepath = userImageFilePath
        .replace('#USERNAME', username)
        .replace('#IMAGE_FILE', file.originalFilename);
    });

    // Notify when the file has uploaded
    formular.on("file", function(name, file){
      if(!file.originalFilename)
          return;

      console.log(` == Image (${name}): ${file.originalFilename} has been uploaded`);
    });
  });

  router.get('/activate/:timeToken/:username/:activateToken', (req, res, next) => {
    tokenService.confirmUserTokens(
      req.params.username,
      req.params.timeToken,
      req.params.activateToken
    ).subscribe({
      next: (accountConfirmed) => {
        if (!accountConfirmed) {
          res.render(`pages/content/account/register`, {
            error: 'Invalid account confirmation link.',
          });
          return;
        }
        res.render(`pages/content/account/confirm`);
      },
      error: (err) => {
        res.render(`pages/content/account/register`, {
          error: 'Database error',
        });
      }
    });
  });

  return router;
}

module.exports = init;
