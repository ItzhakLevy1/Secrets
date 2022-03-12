const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");   

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = {   
  email: String,
  password: String
};  


const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

// ////////////////////////// Level 1 - Username and Password Only //////////////////////////

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,    // Catching whatever the user typed into the username field.
    password: req.body.password   // Catching whatever the user typed into the password field. field.
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("Secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

//  Looking through our "User.findOne" collection of users in our data base to see if the "email" field which is in our database matches with the "username" that is the user name who is trying to log in.
  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      // Checking if there is an existing user by checking our database for the email that the user who is trying to login has typed in.
      if (foundUser) {  
        // Checking if the password "password" that the user typed matches with the password in our databese "foundUser.password".
        if (foundUser.password === password)  {
          res.render("secrets");
        }
      }
    }
  });    

})






app.listen(3000, function(req, res){
  console.log("Server started on port 3000.");
});
