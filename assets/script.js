document.addEventListener('DOMContentLoaded', () => {
	let suggestedTopics = ['Lions', 'Tigers', 'Bears', 'Oh myyy'];
	const queryLimit = 9;
	const featuredQuery = "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC";
	const searchQuery = 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC';
	let prefetchArray = []; //Array to prefetch the gifs in so there is no delay on mouseover swap
	
	const generateImageElements = (response) => {
		let gifContainer = document.getElementById('gifContainer');
		let fragment = document.createDocumentFragment();
		//add data attributes for static and animated files
		response.map((x) => {
			fragment.appendChild(createImageElement(
				x.images.fixed_height_still.url,
				x.images.fixed_height.url,
				x.rating
			));
		});
		gifContainer.innerHTML = "";
		gifContainer.appendChild(fragment);
	}

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
    	let gifArray = Array.from(document.querySelectorAll('#gifContainer > div > img'));
    	if (!gifArray) return false;  		
		gifArray.map((gif) => {
			let prefetchImage = new Image;
    		prefetchImage.src = gif.dataset.animated;
    		prefetchArray.push(prefetchImage);

    		gif.addEventListener('mouseleave', (event) => {
    			event.currentTarget.src = event.currentTarget.dataset.static;
    		});
    		gif.addEventListener('mouseover', (event) => {
    			event.currentTarget.src = event.currentTarget.dataset.animated;
    		});
		}); //map
    }

	const createSearchItem = (value, recentSearches = true, active = false) => {
		let elementSelector = (recentSearches) ? 'recentSearches' : 'trendingTopics';
		let parent = document.getElementById(elementSelector);
		let element = document.createElement('a');
		element.className = active ? 'list-group-item active' :'list-group-item';
		element.dataset.search = value;
		element.innerHTML = value;
		element.href = '#';
		element.addEventListener('click', buttonEvent)
		parent.insertBefore(element, parent.firstChild);
	}

	const buttonEvent = (event) => {
		query(event.currentTarget.dataset.search, queryLimit);
		clearActiveState();
		event.currentTarget.classList.add('active');
	}

	const clearActiveState = () => {
		Array.from(document.querySelectorAll('.list-group-item'))
			.map((x) => x.classList.remove('active'));
	}

	const query = (inputFieldValue, limit, search = true) => {
		$.ajax({
			url: `${search ? searchQuery : featuredQuery}&q=${inputFieldValue}&limit=${limit}`,
			method: 'GET'})
			.done((response) => handleResponse(response.data));
	}	

	const init = () => {
		//Search button click listener
		document.getElementById('searchButton').addEventListener('click', (event) => {
			const inputFieldValue = document.getElementById('inputField').value.trim();
			if (inputFieldValue !== "") {
				clearActiveState();
				createSearchItem(inputFieldValue, true, true);
				query(inputFieldValue, queryLimit);
			}
			document.getElementById('inputField').value = '';
			return false;
		});
		//More gifs click listener
		document.getElementById('buttonMore').addEventListener('click', (event) => {
			const activeSearch = document.querySelector('a.active');
			const currentLength = document.getElementById('gifContainer').childElementCount;
			//If there is an active search, a search query is called with its value;
			//otherwise a featured gif query is called.
			query(activeSearch ? activeSearch.dataset.search : null,
				currentLength + queryLimit,
				activeSearch ? true : false
			);
		})
		suggestedTopics.reverse().forEach((topic) => createSearchItem(topic, false));
		//Initial featured gifs
		query(null, queryLimit, false);
	}

	init();

});