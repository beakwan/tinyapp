const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//Function to generate random 6 character string
const generateRandomString = function() {
  string = Math.random().toString(36).substring(2, 8);
  return string;
};

//Current hardcoded database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



//All GET requests
//Says hello on the homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Gets all of the urls
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };
  res.render("urls_index", templateVars);
});

//Creates new urls
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

//Shows long url from short url
app.get("/urls/:shortURL", (req, res) => {
  templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

//Redirects to long url from short url
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});




//All POST requests
//Generates new tiny url for long url input and redirects to show the new tiny url
app.post("/urls", (req, res) => {
  const shortCode = generateRandomString();
  urlDatabase[shortCode] = req.body.longURL;
  console.log(req.body);  
  res.redirect(`urls/${shortCode}`);         
});

//Deletes urls and redirects to urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  const toDelete = req.params.shortURL;
  delete urlDatabase[toDelete];
  res.redirect("/urls");
});

//Edit and update urls
app.post("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

//Set login username to cookie and redirect back to urls page
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//Complete logout by clearing cookie and redirecting to urls page
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});



//LISTEN request
//Set up listen, and log to ensure it is on the correct port
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});


//
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

