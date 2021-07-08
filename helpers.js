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
const findUserEmail = function(email, userDB) {
  for (let user in userDB) {
    if (userDB[user].email === email) {
      return userDB[user];
    } else {
      return null;
    }
  }
};

//STILL NEED TO FIX THIS
//Fundtion to find URLs based on user ID
const urlsForUser = function(id, urlDB) {
  let wantedURLs = [];
  for (let url in urlDB) {
     if (urlDB[url].userID === id) {
       wantedURLs.push(urlDB[url]);
       return wantedURLs;
     }
     return null;
  }
};



module.exports= {
  generateRandomString,
  findUserById,
  findUserEmail,
  urlsForUser
};