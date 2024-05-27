const mongoose = require('mongoose');

const ACVL_loginSchema = new mongoose.Schema({
  username: String,
  googleId: String
});

const ACVL_login = mongoose.model('ACVL_login', ACVL_loginSchema);

module.exports = ACVL_login;
