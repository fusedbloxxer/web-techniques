const {map, switchMap, tap} = require('rxjs/operators');
const crypto = require('crypto');
const rxjs = require('rxjs');

function AccountService({
  emailService,
  tokenService,
  appSettings,
  dbCon,
}) {
  this.isFormValid = function(fields, files) {
    const requiredFields = [
      {
        name: "first-name",
        pattern: /^[A-Z][a-z]+([-\.][A-Z][a-z]+)?$/,
        error: "The first name must contain only letters and dashes.",
      },
      {
        name: "last-name",
        pattern: /^[A-Z][a-z]+([-\.][A-Z][a-z]+)?$/,
        error: "The last name must contain only letters and dashes.",
      },
      {
        name: "username",
        pattern: /^[A-Za-z0-9\-]{3,}$/,
        error: "The username must contain only letters, numbers, dashes and must be at least 3 characters long.",
      },
      {
        name: "password",
        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d)(?=.*\.).*$/,
        error: "The password must contain 1 lowercase letter, 1 uppercase letter, at least two digits and a dot.",
      },
      {
        name: "password-again",
        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d)(?=.*\.).*$/,
        error: "The password must contain 1 lowercase letter, 1 uppercase letter, at least two digits and a dot.",
      },
      {
        name: "email",
        pattern: /^(?:[^\.][a-zA-Z\d\.]+[^\.])@(?:[^\.][a-zA-Z\d\.]+[^\.])$/,
        error: "The email must contain @, and not start or end with dots. Also, the email must contain only lowercase, uppercase letters digits and dots.",
      },
    ];

    const validationResult = {
      isValid: true,
      error: "",
    };

    const newLine = '<br/>';

    // Check the fields' existance and validate
    // their formats
    for (const field of requiredFields) {
      if (!fields[field.name]?.length) {
        validationResult.isValid = false;
        validationResult.error += `The ${field.name} must be present.${newLine}`;
      }

      if (!fields[field.name].match(field.pattern)) {
        validationResult.isValid = false;
        validationResult.error += `${field.error}${newLine}`;
      }
    }

    // Validate the file extension
    if (!files.photo.originalFilename?.match('^(|.*\.jpg)$')) {
      validationResult.isValid = false;
      validationResult.error += `Invalid photo file format. Only jpg is allowed!${newLine}`;
    }

    // Remove the last newline
    if (!validationResult.isValid) {
      validationResult.error.slice(0, -newLine.length);
    }

    return validationResult;
  };

  this.userExists = function(username, email) {
    const queryUserExists = `
      SELECT 'X'
      FROM app_user
      WHERE username = $1 OR email = $2;
    `;

    const queryRequest = dbCon.query(queryUserExists, [username, email]);

    const usernameExists$ = rxjs
      .from(queryRequest)
      .pipe(
        map(data => data.rows.length === 1),
      );

    return usernameExists$;
  };

  this.createDefaultPreferences = function() {
    const queryInsertDefaultPreference = `
      INSERT INTO user_preference
      DEFAULT VALUES
      RETURNING preference_id;
    `;

    return rxjs.from(dbCon.query(queryInsertDefaultPreference)).pipe(
      map(data => data.rows[0].preference_id)
    );
  }

  this.createUser = function(userFields, userFiles) {
    // SQL script for inserting a new user
    const queryInsertUser = `
      INSERT INTO app_user(
        first_name,
        last_name,
        username,
        email,
        chat_color,
        sight_issue,
        password_hash,
        password_salt,
        time_token,
        activate_token,
        photo,
        preference_id
      )VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    // Create a unique salt for each user
    const saltBytes = crypto.randomBytes(appSettings.security.salt.length);
    const passwordSalt = saltBytes.toString('base64');

    // Hash the password
    const passwordHash = crypto.scryptSync(
      userFields.password,
      passwordSalt,
      appSettings.security.hash.length
    ).toString('base64');

    // Create initial random tokens
    const timeToken = crypto.randomBytes(appSettings.security.token.length)
      .toString('base64')
      .slice(0, Math.floor(appSettings.security.token.length / 2));
    const activateToken = crypto.randomBytes(appSettings.security.token.length)
      .toString('base64')
      .slice(0, Math.floor(appSettings.security.token.length / 2));

    // Extract fields in order and build a user object
    const user = [
      userFields['first-name'],
      userFields['last-name'],
      userFields['username'],
      userFields['email'],
      userFields['color'] ?? 'red',
      userFields['sight-issue'] ?? false,
      passwordHash,
      passwordSalt,
      timeToken,
      activateToken,
      userFiles['photo'].originalFilename ? userFiles['photo'].filepath : null,
    ];

    // Create transaction observable depending on preferences
    this.createUser$ = function(preference_id) {
      return rxjs.from(dbCon.query(
        queryInsertUser,
        [...user, preference_id]
      )).pipe(
        map(data => data.rows?.[0])
      );
    }

    // Create preference, user and send email
    return this.createDefaultPreferences().pipe(
      switchMap(preference_id => this.createUser$(preference_id)),
      switchMap(user => tokenService.updateUserTokens(user.username)),
      tap(user => emailService.sendRegisterEmail({
        activateToken: user.activate_token,
        timeToken: user.time_token,
        username: user.username,
        email: user.email,
      }))
    );
  };
}

module.exports = {
  AccountService,
};
