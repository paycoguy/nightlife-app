'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var User = new Schema({
	email: { type: String, unique: true, lowercase: true },
  	password: String,
	github: {
		id: String,
		displayName: String,
		username: String,
      publicRepos: Number
	},
	facebook: {
		id: String,
		displayName: String
	},
	google: {
		id: String,
		displayName: String
	}
});

/**
 * Password hash middleware.
 */
User.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', User);
