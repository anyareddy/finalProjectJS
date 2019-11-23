var mongoose = require('mongoose')

var playlistSchema = new mongoose.Schema({
  id: { type: String },
  playlist: { type: String },
})

module.exports = mongoose.model('Playlist', playlistSchema)

