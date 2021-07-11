
//HELPER Functions
//Function to generate random 6 character string
const generateRandomString = () => {
  const string = Math.random().toString(36).substring(2, 8);
  return string;
};

//Function to loop through users database to find correct id
const findUserById = (userId, userDB) => {
  for (let user in userDB) {
    if (user === userId) {
      return userDB[user];
    }
  }
};

//Function to lookup a user by email
const findUserByEmail = (email, userDB) => {
  const users = Object.values(userDB);
  for (const user of users) {
    if (user.email === email) {
      return user;
    }
  }
};


//Function to find URLs based on user ID
const urlsForUser = function(id, urlDB) {
  const wantedURLs = {};
  for (const url in urlDB) {
    if (urlDB[url].userID === id) {
      wantedURLs[url] = urlDB[url].longURL;
    }
  }
  return wantedURLs;
};


module.exports = {
  generateRandomString,
  findUserById,
  findUserByEmail,
  urlsForUser
};
