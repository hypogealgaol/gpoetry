$(document).ready(function() {
	//Code reference for flickr http requests: http://stackoverflow.com/questions/17071187/get-flickr-images-depending-on-a-search-result

	$('#button').live('click', function() {


		var parsedJSON; 
		var textInp = document.getElementById('inputT').value;
		console.log(textInp); 

		//for flickr request
		var options = { 
  			"api_key": "2e48d389d7a260ad8c03dc8ca43fd59d",
  			"method": "flickr.photos.search", // You can replace this with whatever method,
                                  // flickr.photos.search fits your use case best, though.
  			"format": "json",
 			"nojsoncallback": "1",
  			"text": "<your search text here>"  // This is where you'll put your "file name"
		}

		options.text = textInp; //get from textbox
		alert(options.text); 

		flickrRequest(options, function(data) { 
			parsedJSON = JSON.parse(data); //is definitely json
			console.log(parsedJSON); 

			//change photo 0 to something random 
			console.log("Num photos " + parsedJSON.photos.photo.length); 
			var item = parsedJSON["photos"].photo[0]; 
			console.log(item); 

			//build photo URL
			var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';	
			console.log(photoURL); 
		});
	})//end of button

	var flickrRequest = function(options, cb) {
		var url, xhr, item, first;
		url = "https://api.flickr.com/services/rest/";
		first = true;

		for (item in options) {
			if (options.hasOwnProperty(item)) {
				url += (first ? "?" : "&") + item + "=" + options[item]; //parses to search equest; 
				first = false;
			}
		}
		//XMLHttpRQ to flickr
		xhr = new XMLHttpRequest();
	  	xhr.onload = function() { cb(this.response); };
	  	xhr.open('get', url, true);
	  	xhr.send();
	}

}); //end of doc ready

