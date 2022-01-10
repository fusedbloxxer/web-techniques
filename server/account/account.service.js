const {map} = require('rxjs/operators');
const rxjs = require('rxjs');

function AccountService({
  dbCon,
}) {

  this.isFormValid = function(fields) {
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

    // Check the fields' existance and validate
    // their formats
    for (const field of requiredFields) {
      if (!fields[field.name]?.length) {
        return {
          isValid: false,
          error: `The ${field.name} must be present.`,
        };
      }

      if (!fields[field.name].match(field.pattern)) {
        return {
          isValid: false,
          error: fields[field.name].error,
        };
      }
    }

    return {
      isValid: true,
    };
  };

  this.userExists = function(username) {
    const queryUserExists = `
      SELECT 'X'
      FROM app_user
      WHERE username = $1;
    `;

    const queryRequest = dbCon.query(queryUserExists, [username]);

    const usernameExists$ = rxjs
      .from(queryRequest)
      .pipe(
        map(data => data.rows.length === 1),
      );

    return usernameExists$;
  };

  return;
}

module.exports = {
  AccountService,
};
