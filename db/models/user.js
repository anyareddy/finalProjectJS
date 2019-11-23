var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  id: { type: String },
  displayname: { type: String },
  uri: { type: String },
  href: {type: String}
})

module.exports = mongoose.model('User', userSchema)
