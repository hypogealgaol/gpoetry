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

		//for flickr request photos.search
		var options = { 
  			"api_key": "2e48d389d7a260ad8c03dc8ca43fd59d",
  			"method": "flickr.photos.search", // You can replace this with whatever method,
  			"format": "json",
 			"nojsoncallback": "1",
  			"text": "<your search text here>",  // This is where you'll put your "file name"
  			"content-type": "7",
  			"extras":"original_format"
  			//i can use tags as well
		}

		//these are the options for flickrfeed
		var feedOptions = {
			"format":"json",
			"tags":"<my tag here>",
			"jsoncallback": "?"
		}

		options.text = textInp; //get from textbox
		feedOptions.tags = textInp; 

		//request for simple photo search method
		flickrRequest(options, function(data) { 
			//parse json
			parsedJSON = JSON.parse(data); 

			var allPhotos = parsedJSON["photos"].photo; 
			var newJSON = findSquareImages(allPhotos); 

			//find square image

			// 100 photos default, can go to 300 in the options

			//build photo URL as per flickr specifies in photoURL var
			var randomSeed = Math.floor(Math.random()*5)+1; //gets a random of the top 5 results
			var item = parsedJSON["photos"].photo[randomSeed]; 
			var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';	

			//options for get sizes method so w can get the biggest picture
			var sizesOptions = {
  				"api_key": "2e48d389d7a260ad8c03dc8ca43fd59d",
  				"method": "flickr.photos.getSizes",
  				"format": "json",
  				"nojsoncallback":"1",
  				"photo_id":"xxx" //fill this in
			}	

			//Request to geSizes to find url of biggest picture
			sizesOptions.photo_id = item.id; 
			flickrRequest(sizesOptions, function(data) {
				parsedJSON = JSON.parse(data);
				var bigURL = processPhotoSize(data);
				createPhotoDiv(bigURL); 
			});			
			//now we want to make sure we only get square images
		});

	})//end of button

	var flickrRequest = function(options, cb) {

		var url = generateFlickrPhotoURL(options); 

		var xhr = new XMLHttpRequest();
  		xhr.onload = function() { cb(this.response); };
  		xhr.open('get', url, true);
		xhr.send();

	}

	var generateFlickrPhotoURL = function(options) {

		var url, item, first;
		url = "https://api.flickr.com/services/rest/";
		first = true;
		for (item in options) {
			if (options.hasOwnProperty(item)) {
				url += (first ? "?" : "&") + item + "=" + options[item]; //parses to search equest; 
				first = false;
			}
		}
		return url; 
	}; 

	var processPhotoSize = function(photoJSON) {
		photoJSON = JSON.parse(photoJSON); 
		console.log(photoJSON); 
		var last = photoJSON.sizes.size.length;
		return photoJSON.sizes.size[last-1].source;
	}

	createPhotoDiv = function(photoURL) {
		container.appendChild(imgp)	 
		imgp.src = photoURL; 
		imageArea.appendChild(container); 

	}

	//reparses the json to not include anything that doesn't have square dimensions
	var findSquareImages = function(photoJSON) {
		for(var i = 0; i<photoJSON.length; i++) {
			var item = photoJSON[i]; 
			var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
			var dimensions = getMeta(photoURL, function(dimensions) {
				if(dimensions.w == dimensions.h) {
				}
			}); 
		}

	}

	//stackoverflow answer to get image after loading (doesn't process till after load)
	var getMeta = function(url, cb){
		$('<img/>').attr('src', url).load(function() {
			s = {w:this.width, h:this.height};
			cb(s); 
  		});  
	}

}); //end of doc ready

