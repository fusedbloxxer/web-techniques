function init({
  dbCon,
  accountService,
  productsService,
}) {
  const formidable = require('formidable');
  const express = require("express");
  const router = express.Router();

  router.get('', (req, res, next) => {
    res.render(`pages/content/account/account`);
  });

  router.get('/register', (req, res, next) => {
    res.render(`pages/content/account/register`);
  });

  router.post('/register/submit', (req, res, next) => {
    let formular = new formidable.IncomingForm();
    let username;

    formular.parse(req, function(err, fields, files) { // 4
      const formValidationResult = accountService.isFormValid(fields)

      if (!formValidationResult.isValid) {
        res.render(`pages/content/account/register`, {
          error: formValidationResult.error,
        });
        return;
      }

      accountService.userExists(fields.username).subscribe({
        next: (userExists) => {
          if (userExists) {
            res.render(`pages/content/account/register`, {
              error: `The user with the username '${username}' already exists`,
            });
            return;
          }
        },
        error: (error) => {
          res.render(`pages/content/account/register`, {
            error: 'Database error',
          });
          return;
        }
      });

      // queryVerifUtiliz=` select * from utilizatori where username= '${fields.username}' `;
      // console.log(queryVerifUtiliz)

      // dbCon.query(queryVerifUtiliz, function(err, rez){
      //     if (err){
      //         console.log(err);
      //         res.render("pagini/inregistrare", {err:"Eroare baza date"});
      //     }

      //     else{
      //         if (rez.rows.length==0){
      //             var criptareParola=crypto.scryptSync(fields.parola,parolaCriptare,32).toString('hex');
      //             var token=genereazaToken(100);
      //             var queryUtiliz = `
      //               insert into utilizatori(
      //                 username,
      //                 nume,
      //                 prenume,
      //                 parola,
      //                 email,
      //                 culoare_chat,
      //                 cod
      //               )values('${fields.username}','${fields.nume}','${fields.prenume}', $1 ,'${fields.email}','${fields.culoareText}','${token}')`;

      //             console.log(queryUtiliz, criptareParola);
      //             dbCon.query(queryUtiliz, [criptareParola], function(err, rez){ //TO DO parametrizati restul de query
      //                 if (err){
      //                     console.log(err);
      //                     res.render("pagini/inregistrare",{err:"Eroare baza date"});
      //                 }
      //                 else{
      //                     trimiteMail(fields.username,fields.email, token);
      //                     res.render("pagini/inregistrare",{err:"", raspuns:"Date introduse"});
      //                 }
      //             });
      //         }
      //         else{
      //             eroare+="Username-ul mai exista. ";
      //             res.render("pagini/inregistrare",{err:eroare});
      //         }
      //     }
      // });
    });

    formular.on("field", function(nume,val){  // 1 pentru campuri cu continut de tip text (pentru inputuri de tip text, number, range,... si taguri select, textarea)
      console.log("----> ",nume, val );
      if(nume=="username")
          username=val;
    });

    formular.on("fileBegin", function(nume,fisier){ //2
      if(!fisier.originalFilename)
          return;
      folderUtilizator=__dirname+"/poze_uploadate/"+username+"/";
      console.log("----> ",nume, fisier);
      if (!fs.existsSync(folderUtilizator)){
          fs.mkdirSync(folderUtilizator);
          v=fisier.originalFilename.split(".");
          fisier.filepath=folderUtilizator+"poza."+v[v.length-1];//setez calea de upload
          //fisier.filepath=folderUtilizator+fisier.originalFilename;
      }
    });

    formular.on("file", function(nume,fisier){ //3
      //s-a terminat de uploadat
      console.log("fisier uploadat");
    });
  });

  return router;
}

module.exports = init;
