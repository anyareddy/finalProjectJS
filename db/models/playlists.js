var mongoose = require('mongoose')

var playlistSchema = new mongoose.Schema({
  id: {type: String},
  name: { type: String },
  owner: { type: String },
  tracks: {type: String},
  uri: {type: String},
  songs: {type: Object},
  artists: {type: Object},
  ids: {type: Object}
})

module.exports = mongoose.model('Playlist', playlistSchema)

