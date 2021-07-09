const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const {generateRandomString, findUserById, findUserByEmail, urlsForUser} = require("./helpers");

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ["verySecretThings", "IReallyLikeCookies"]
}));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");



//Current hardcoded databases
const urlDatabase = {
  b2xVn2: {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "user1"
  },
  Rsm5xK: {
    shortURL: "Rsm5xK",
    longURL: "http://www.google.com",
    userID: "user1"
  }
};

const users = {
  user1: {
    id: "user1",
    email: "email@email.com",
    password: bcrypt.hashSync("hello", salt)
  }
};




//LISTEN request
//Set up listen, and log to ensure it is on the correct port
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});



//All POST requests
//Generates new tiny url for long url input and redirects to show the new tiny url
app.post("/urls", (req, res) => {
  const shortCode = generateRandomString();
  urlDatabase[shortCode] = {
    shortURL: shortCode,
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortCode}`);
});

//Deletes urls and redirects to urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  const toDelete = req.params.shortURL;
  delete urlDatabase[toDelete];
  res.redirect("/urls");
});

//Get to edit page from urls page
app.post("/urls/:shortURL", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

//Edit and update urls
app.post("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = {
    shortURL: shortURL,
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect("/urls");
});

//Register new user and redirect to urls page
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Please enter a valid email address and password");
  } else if (findUserByEmail(req.body.email, users)) {
    res.status(400).send("Account already exists. Please enter a new email address or login.");
  } else {
    const id = generateRandomString();
    users[id] = {
      id: id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt)
    };
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

//Login to TinyApp and redirect to urls page
app.post("/login", (req, res) => {
  const user = findUserByEmail(req.body.email, users);
  if (!user) {
    res.status(403).send("Email address not found. Please enter a valid email or register");
  } else if (bcrypt.compareSync(req.body.password, user.password) === false) {
    res.status(403).send("Incorrect password. Please try again");
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

//Complete logout by clearing cookie and redirecting to urls page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});



//All GET requests
//Says hello on the homepage
app.get("/", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  if (user) {
    return res.redirect("/urls");
  }
  res.redirect("/login");
});

//Gets all of the urls
app.get("/urls", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  const urls = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = {
    urls,
    user
  };
  if (!user) {
    return res.render("urls_welcome", templateVars);
  }
  res.render("urls_index", templateVars);
});

//Creates new urls
app.get("/urls/new", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  const templateVars = {
    user
  };
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

//Shows long url from short url
app.get("/urls/:shortURL", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  const urls = urlsForUser(req.session.user_id, urlDatabase);
  if (!user || !urls[req.params.shortURL]) {
    return res.send("Access denied. Please login or try another tiny URL");
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urls[req.params.shortURL],
    user
  };
  res.render("urls_show", templateVars);
});

//Redirects to long url from short url, if short url does not exist, redirect back to main page
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("Tiny URL does not exist. Please try again.");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//Shows a page to register
app.get("/register", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user
  };
  res.render("register", templateVars);
});

//Shows a page to login
app.get("/login", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user
  };
  res.render("login", templateVars);
});






