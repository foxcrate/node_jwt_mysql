const express = require('express');
const jwt = require('jsonwebtoken');
const {db} = require('./DB.js');
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt');

const app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

db.connect( (error) => {

  if(error){
    console.log(error);
  }else{
    console.log("MySql Connected ..");
  }

} );



app.post('api/register', (req, res) => {

  //console.log(req.body.name);

  var hashPassword = bcrypt.hashSync(req.body.password,8);

  //var h = bcrypt.compareSync("bacon", hash);

  db.query('INSERT INTO users SET?',{name:req.body.name , email:req.body.email , password:hashPassword},(error,results) =>{
    if(error){
      console.log('Error In Register',error);
    }else{
      console.log("Registered Successfully");
      res.json({
        message: "done",
        data: results
      });
    }
  });


});

app.post('/api/login', (req, res) => {

  db.query("SELECT id,name,email,password FROM users WHERE email = "+"'"+req.body.email+"'" ,(err, result, fields) =>{
    if (err) console.log('Error: ',err);
    //console.log(result[0]['password']);
    console.log(result);

    if(!result.length > 0){
      res.json({
        message:"Wrong Credintials"
      });
    }else{

      var user = {
        id: result[0]['id'],
        name: result[0]['name'],
        email: result[0]['email']
      }

      bcrypt.compare(req.body.password , result[0]['password']  , function(err, result) {

        if(result == true){

          jwt.sign({user}, 'secretkey', { expiresIn: '120s' }, (err, token) => {
            res.json({
              authToken:token,
              message:"Logged In Successfully"
            });
          });

        }else{

          res.json({
            message: "Wrong Password"
          });

        }

      });

    }

  });


});

app.get('/api/all_users',verifyToken, (req, res) => {

  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if(err) {
      res.sendStatus(403);
    } else {

      db.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        //console.log(result);
        res.json({
          data: result
        });
      });

    }

  });

});


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

app.listen(5000, () => console.log('Server started on port 5000'));
