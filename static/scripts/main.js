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

	function getTracks() {
	  $.ajax({
      	url: '/playlist',
      	data: { tracks: current},
      	type: 'POST',
      	success: function(res) {
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
      		//console.log(pList)
      		  if (pList.name === id) {
      			// var tracks = {
         //      	url: ""+pList.tracks ,
         //      	headers: { 'Authorization': 'Bearer ' + 'BQD4tzu2iW0Oi8_ucrLXisVqpNNlUTmnbYKInnV2kZ8RRMHvfygUIc3ZOrCTmzZlrs9ZwadLvUrmkiAqXNBhYT4fOV5pmzoxU3nnYwp3UOcSJvIPXnzbyGNzxLoNQp-0ULBNe6zbdy3UBThcQWfQHREbXoPZ&refresh_token=AQCa7zs2FuCPFao_YPAnQnweS4iAjBAJLXuCdHWltsLEZn93eDAiI90-gM50AvcU6sDxprBDHo2ciPpFSSUlMIOUL0xgCnYu2GCRWToqbUyIy3Sf-cSwNYiUDbHpWsVJldw' },
         //      	json: true
         //    	}
         //    	current = tracks
         //      getTracks()
            	// window.location.href = '/playlist';
             //  return false;
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


