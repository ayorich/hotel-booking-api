const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
    minlength: [3, 'A User name must be equal or more than 3 character']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your Email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // THIS ONLY WORKS ON SAVE !!! AND CAN'T WORK ON UPDATE , SO WE UPDATE USER PASSWORD USING SAVE() AND NOT UPDATE METHOD
      validator(el) { return el === this.password; }
    },
    message: 'Password are not the same'
 
  }
});

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  // ONLY RUN IF PASSWORD IS ONLY MODIFIED
  if (!this.isModified('password')) return next();
  
  // HASH THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12);
  // DELETE THE PASSWORDCONFIRM
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
