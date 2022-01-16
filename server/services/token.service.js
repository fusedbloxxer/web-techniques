const { map } = require('rxjs/operators');
const lodash = require('lodash');
const rxjs = require('rxjs');

function TokenService({
  appSettings,
  dbCon,
}) {
  this.updateUserTokens = function(username) {
    const queryUpdateTokens = `
      UPDATE app_user
      SET
        time_token = (SELECT TO_CHAR(add_date, 'YYYYMMDDHH24MISS')
                      FROM app_user
                      WHERE username = $1),
        activate_token = $2
      WHERE username = $1
      RETURNING *;
    `;

    // Bundle the values for the parameterized query
    const values = [
      username,
      this.generateActiveToken(appSettings.security.token.length),
    ];

    // Update the user's tokens and return the entity
    return rxjs.from(dbCon.query(queryUpdateTokens, values)).pipe(
      map(data => data.rows?.[0])
    );
  }

  this.generateActiveToken = function(length) {
    const consonants = Array('Z'.charCodeAt(0) - 'A'.charCodeAt(0))
      .fill(0)
      .map((_, i) => i + 'A'.charCodeAt(0))
      .filter(c => !~['A', 'E', 'I', 'O', 'U'].indexOf(String.fromCharCode(c)))
      .map(x => String.fromCharCode(x));
    const token = Array(length).fill(0).map(() => lodash.sample(consonants));
    return token.join('');
  }

  this.confirmUserTokens = function(username, timeToken, activateToken) {
    const queryConfirmAccount = `
      UPDATE app_user
      SET account_confirmed = TRUE
      WHERE username        = $1 AND
            time_token      = $2 AND
            activate_token  = $3;
    `;

    // Bundle the values for the parameterized query
    const values = [
      username,
      timeToken,
      activateToken,
    ]

    return rxjs.from(dbCon.query(queryConfirmAccount, values)).pipe(
      map(data => data.rowCount > 0)
    );
  }
}

module.exports = {
  TokenService
};