$(document).ready(function() {
	data = []
	//var request = require('request')
	getPlaylists()
	//makeButtons()
	var current;

	function getPlaylists() {
	  $.ajax({
        url: '/playlists',
      	type: 'GET',
      	success: function(res) {
        data = res.playlists
        console.log(res)
      	}
    	})
	}


	var buttons = document.getElementsByTagName('button')
	console.log(buttons)
	for (var i = 4; i < buttons.length; i++) {
		var id = buttons[i].id
		var p = '#' + id
		$(p).on('click', function() {
      	  for (var j = 8; j < data.length; j++) {
      		var pList = data[j]
      		  if (pList.name === id) {
      			var track = {
              	url: ""+pList.tracks ,
              	headers: { 'Authorization': 'Bearer ' + 'BQD4tzu2iW0Oi8_ucrLXisVqpNNlUTmnbYKInnV2kZ8RRMHvfygUIc3ZOrCTmzZlrs9ZwadLvUrmkiAqXNBhYT4fOV5pmzoxU3nnYwp3UOcSJvIPXnzbyGNzxLoNQp-0ULBNe6zbdy3UBThcQWfQHREbXoPZ&refresh_token=AQCa7zs2FuCPFao_YPAnQnweS4iAjBAJLXuCdHWltsLEZn93eDAiI90-gM50AvcU6sDxprBDHo2ciPpFSSUlMIOUL0xgCnYu2GCRWToqbUyIy3Sf-cSwNYiUDbHpWsVJldw' },
              	json: true
            	}
              console.log(track)
              $.ajax({
              url: '/playlist',
              data: { tracks: track},
              type: 'POST',
              success: function(res) {
              console.log(res)
            }
          })
      			} else if (i >= 23) {
                console.log(id)
                $.ajax({
                url: '/tracks',
                data: { song: id},
                type: 'POST',
                success: function(res) {
                console.log(res)
              }
            })
            }
      		}
    	})
	}

  $('#homepage').click(function() {
      window.location.href = '/home';
      return false;
  });

  $('#lgout').click(function() {
      window.location.href = '/';
      return false;
  });
	
})


