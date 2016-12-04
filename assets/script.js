document.addEventListener('DOMContentLoaded', () => {
	let suggestedTopics = ['Lions', 'Tigers', 'Bears'];
	const queryLimit = 9;
	const featuredQuery = "http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC";
	const searchQuery = 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC';
	let prefetchArray = []; //Array to prefetch the gifs in so there is no delay on mouseover swap
	//Generate the images to be displayed in the 
	const generateImageElements = (response) => {
		console.log(response);
		let fragment = document.createDocumentFragment();
		//add data attributes for static and animated files
		response.map((x) => {
			fragment.appendChild(createImageElement(
				x.images.fixed_height_still.url,
				x.images.fixed_height.url,
				x.rating
			));
		});
		document.getElementById('gifContainer').innerHTML = "";
		document.getElementById('gifContainer').appendChild(fragment);
		// console.log(fragment)

	}
	//Parse topics from the topics array and generate 
	const createImageElement = (staticURL, animatedURL, rating) => {
		//Create the individual image block
		let eachDiv = document.createElement('div');
		let eachImage = document.createElement('img');
		let eachRating = document.createElement('p');
		eachRating.className = 'text-center text-muted small';
		eachRating.innerHTML = `Rating: ${rating.toUpperCase()}`;
		eachImage.dataset.static = staticURL;
		eachImage.dataset.animated = animatedURL;
		eachImage.src = staticURL;
		eachImage.className = 'img-thumbnail img-responsive center-block';
		eachDiv.appendChild(eachImage);
		eachDiv.appendChild(eachRating);
		eachDiv.className = 'col-xs-12 col-sm-6 col-md-4';
		return eachDiv;
	}

	const handleResponse = (response) => {
		generateImageElements(response);
	    	// console.log(response)
    	let gifArray = Array.from(document.querySelectorAll('#gifContainer > div > img'));
    	if (gifArray) {    		
    		gifArray.map((gif) => {
    			let prefetchImage = new Image;
	    		prefetchImage.src = gif.dataset.animated;
	    		prefetchArray.push(prefetchImage)

	    		gif.addEventListener('mouseleave', (event) => {
	    			event.currentTarget.src = event.currentTarget.dataset.static;
	    		});
	    		gif.addEventListener('mouseover', (event) => {
	    			event.currentTarget.src = event.currentTarget.dataset.animated;
	    		});
			}); //map
    	}
	}

	document.getElementById('searchButton').addEventListener('click', (event) => {
		const inputFieldValue = document.getElementById('inputField').value.trim();
		if (inputFieldValue !== "") {
			
			console.log(inputFieldValue);
			$.ajax({url: `${searchQuery}&q=${inputFieldValue}&limit=${queryLimit}`, method: 'GET'})
			.done((response) => handleResponse(response.data)); 
		}
		return false;
	});

	const init = () => {
		$.ajax({url: `${featuredQuery}&limit=${queryLimit}`, method: 'GET'})
			.done((response) => handleResponse(response.data)); 
	}

	init();




});