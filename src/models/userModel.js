/* eslint-disable func-names */
const crypto = require('crypto');
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
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'hotelAdmin', 'admin', 'superAdmin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // THIS ONLY WORKS ON SAVE !!! AND CAN'T WORK ON UPDATE , SO WE UPDATE USER PASSWORD USING SAVE() AND NOT UPDATE METHOD
      validator(el) { return el === this.password; }
    },
    message: 'Password are not the same'

  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
  },
  updatedByAdmin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

});

userSchema.pre('save', async function (next) {
  // ONLY RUN IF PASSWORD IS ONLY MODIFIED
  if (!this.isModified('password')) return next();

  // HASH THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12);

  // DELETE THE PASSWORDCONFIRM
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
  const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
  return isCorrect;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    // return true if passwordChanged(on 12th-sept-2020) after JWTToken is issued(on 11th-sept-2020)
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
