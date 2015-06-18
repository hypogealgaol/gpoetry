$(document).ready(function() {
	//Code referenced for flickr http requests: http://stackoverflow.com/questions/17071187/get-flickr-images-depending-on-a-search-result


	var imageArea;
	var initImage = 0; 
	var imgp; 
	//setting initial variables
	window.onload = function() {

		//set initial variables for where photo will go 
		imageArea = document.getElementById("imgArea"); 
		container = document.createElement("div"); 
		imgp = document.createElement("img"); 
	}

	$('#button').live('click', function() {

		var parsedJSON; 
		var textInp = document.getElementById('inputT').value;
		console.log(textInp); 
		console.log(imageArea);

		//for flickr request
		var options = { 
  			"api_key": "2e48d389d7a260ad8c03dc8ca43fd59d",
  			"method": "flickr.photos.search", // You can replace this with whatever method,
  			"format": "json",
 			"nojsoncallback": "1",
  			"text": "<your search text here>",  // This is where you'll put your "file name"
  			"content-type": "7"
  			//i can use tags as well
		}

		var feedOptions = {
			"format":"json",
			"tags":"<my tag here>",
			"jsoncallback": "?"
		}

		options.text = textInp; //get from textbox
		feedOptions.tags = textInp; 

		flickrRequest(options, function(data) { 
			parsedJSON = JSON.parse(data); //is definitely json
			//console.log(parsedJSON);

			//change photo 0 to something random 
			//console.log("Num photos " + parsedJSON.photos.photo.length);  // is always 100
			var item = parsedJSON["photos"].photo[0]; 

			var randomSeed = Math.floor(Math.random()*5)+1; //you can use this for item 2

			var item = parsedJSON["photos"].photo[randomSeed]; //finds a random photo
			//build photo URL
			var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';	


			console.log(photoURL); 
			container.appendChild(imgp)	 

			imgp.src = photoURL; 

			//don't need this iff anymore	
			if (initImage == 0) {
				imageArea.appendChild(container); 
			}

			/*force square image? img.onload = function(){
  				var height = img.height;
 			 	var width = img.width;
			}
			img.src = url

			*/

		});

		var feedRQ = flickrFeedRQ(feedOptions);
		$.getJSON(feedRQ).done(function(data) {
			console.log(data); 
		})
		console.log(feedRQ); 
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

	var flickrFeedRQ = function(options, cb) {
		var url, xhr, item, first;
		url = "https://api.flickr.com/services/feeds/photos_public.gne";
		first = true; 

		for (item in options) {
			if (options.hasOwnProperty(item)) {
				url += (first ? "?" : "&") + item + "=" + options[item]; //parses to search equest; 
				first = false;
			}
		}
		return url; 
	}

}); //end of doc ready

