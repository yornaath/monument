/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt')

module.exports = {

  schema: true,

  attributes: {

    name: {
      type: 'string'
    },

    email: {
      type: 'email',
      unique: true,
      required: true
    },

    phoneNumber: {
      type: 'string',
      unique: true,
      required: true
    },

    encryptedPassword: {
      type: 'string',
      protected: true
    },

    role: {
      type: 'string',
      defaultsTo: 'normal',
      enum: ['admin', 'normal']
    },

    partakingAtEvent: {
      collection: 'Event',
      via: 'participants'
    }

  },

  beforeCreate: function(values, next) {
    if(!values.password || values.password !== values.passwordConfirmation) {
      return next(new Error('passwords does not match'))
    }

    bcrypt.hash(values.password, 10, function encrypted(err, encryptedPassword) {
      if(err) {
        return next(err)
      }

      values.encryptedPassword = encryptedPassword
      next()
    })
  }

};