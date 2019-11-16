var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var request = require('request')


var client_id = 'CLIENT_ID'
var client_secret = 'CLIENT_SECRET'
var redirect_uri = 'REDIRECT_URI'




app.get('/login', function(req, red)) {
	res.redirect('http://accounts.spotify.spotify.com/authorize?')
}




app.use(function(err, _, res) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})