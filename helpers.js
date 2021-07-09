const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
//HELPER Functions
//Function to generate random 6 character string
const generateRandomString = function() {
  string = Math.random().toString(36).substring(2, 8);
  return string;
};

//Function to loop through users database to find correct id
const findUserById = function(userId, userDB) {
  for (let user in userDB) {
    if (user === userId) {
      return userDB[user];
    } 
  }
};

//Function to lookup a user email
const findUserByEmail = function(email, userDB) {
  const users = Object.values(userDB);
  for (const user of users) {
    if (user.email === email) {
      return user;
    }
  }
};

//STILL NEED TO FIX THIS
//Fundtion to find URLs based on user ID
const urlsForUser = function(id, urlDB) {
  const wantedURLs = {};
  for (const url in urlDB) {
    if (urlDB[url].userID === id) {
      wantedURLs[url] = urlDB[url].longURL;
    }
  }
  return wantedURLs;
};

findUserByEmail("lkjsdf", testUsers)

module.exports= {
  generateRandomString,
  findUserById,
  findUserByEmail,
  urlsForUser
};