const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ["verySecretThings", "IReallyLikeCookies"]
}));


const {generateRandomString, findUserById, findUserEmail, urlsForUser} = require("./helpers");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

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

console.log(urlsForUser("user1", urlDatabase))


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
    res.send("400! Please enter a valid email and password");
  } else if (findUserEmail(req.body.email, users)) {
    res.send("400! Please enter a new email address");
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
  const user = findUserEmail(req.body.email, users);
  if (!user) {
    res.send("403! Email address not found. Please enter a valid email or register")
   } else if (bcrypt.compareSync(req.body.password, user.password) === false) {
      res.send("403! Incorrect password. Please try again")
   } else {
     req.session.user_id = user.id;
     res.redirect("/urls");
   }
   console.log(users);
});

//Complete logout by clearing cookie and redirecting to urls page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});



//All GET requests
//Says hello on the homepage
app.get("/", (req, res) => {
  res.send("Hello!");
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
    res.render("urls_welcome", templateVars);
   }
   console.log(urls);
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
  templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user
  };
  res.render("urls_show", templateVars);
});

//Redirects to long url from short url, if short url does not exist, redirect back to main page
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]){
    res.cookie("error", "Tiny URL not found");
    res.redirect("/urls");
  } else {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
  }
});

//Shows a page to register
app.get("/register", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  const templateVars = {
    user
  };
  res.render("register", templateVars);
});

//Shows a page to login
app.get("/login", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  const templateVars = {
    user
  };
  res.render("login", templateVars);
});






