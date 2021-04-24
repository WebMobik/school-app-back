const  { model, Schema } = require('mongoose')

const UserSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
    },
    password: {
      type: String,
      required: 'Password is required',
    },
    created: {
      type: Date,
      default: Date.now,
    },
    tests: [{ date: { type: Date, default: Date.now }, count: Number }],
})

UserSchema.methods = {
  authenticate: function(plainText) {
    return plainText === this.password
  }
}

module.exports = {
  User: model('User', UserSchema)
}