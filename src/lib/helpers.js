const bcrypt = require('bcryptjs');

const helpers = {};

// Generate hash at signup
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Validate password when login
helpers.matchPassword = async (password, savedPassword) => {
    try {
        await bcrypt.compare(password, savedPassword);
    } catch(e) {
        console.log(e);
    }
  
};

module.exports = helpers;
