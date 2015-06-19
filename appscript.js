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

		

		//okay here's what has to happen, get the ID of the individual photo then use another RQ
		//to get the size of the photo and post that one

		options.text = textInp; //get from textbox
		feedOptions.tags = textInp; 


		//request for simple photo search method
		flickrRequest(options, 1, function(data) { 
			parsedJSON = JSON.parse(data); //is definitely json

			// 100 photos default, can go to 300 in the options
			//we need to process a new request inside this

			//build photo URL as per flickr
			var randomSeed = Math.floor(Math.random()*5)+1; //you can use this for item 2
			var item = parsedJSON["photos"].photo[randomSeed]; //finds a random photo
			var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';	

			//options for get sizes method so w can get the biggest picture
			var sizesOptions = {
  				"api_key": "2e48d389d7a260ad8c03dc8ca43fd59d",
  				"method": "flickr.photos.getSizes",
  				"format": "json",
  				"nojsoncallback":"1",
  				"photo_id":"xxx" //fill this in

			}	
			//rQ for geSizes to find url of biggest picture

			//async call in sync method?
			sizesOptions.photo_id = item.id; 

			flickrRequest(sizesOptions, 1, function(data) {
				parsedJSON = JSON.parse(data);
				console.log(parsedJSON); 
				processPhotoSize(data); 
				
			});			

			//static URL
			console.log(photoURL); 
			container.appendChild(imgp)	 
			imgp.src = photoURL; 
			imageArea.appendChild(container); 

			/*force square image? img.onload = function(){
  				var height = img.height;
 			 	var width = img.width;
			}
			img.src = url

			*/

		});

		/*
		//feed photo
		var feedRQ = flickrFeedRQ(feedOptions);
		
		//this is asynchrous so I must process the JSON in this function
		var feedData = $.getJSON(feedRQ).done(function(data) {
			console.log(data); 
			console.log("PHOTO URL: " + data.items[0].link); 

		});
		*/

	})//end of button

	var flickrRequest = function(options, xhrRQ, cb) {


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
		if(xhrRQ == 1 ) { 
			xhr = new XMLHttpRequest();
	  		xhr.onload = function() { cb(this.response); };
	  		xhr.open('get', url, true);
	  		xhr.send();
	  	}
	  	else {

	  	}
	}

	var generateFlickrURL = function() {}; 

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

	var processPhotoSize = function(photoJSON) {
		console.log(photoJSON); 
		var last = photoJSON.sizes.size.length;
		console.log(photoJSON.sizes.size[last-1].source);
		return photoJSON.sizes.size[last-1].source;
	}

}); //end of doc ready

