var superHeroes = ['iron man', 'spider-man', 'she-hulk', 'black widow', 'captain marvel', 'captain america'];
$('#search-bar').autocomplete({
    source: superHeroes
});

document.getElementById('search-button').addEventListener('click', function () {
    var searchTerm = document.getElementById('search-bar').value;
    searchMarvelCharacter(searchTerm);
});

document.getElementById('wiki-search-btn').addEventListener('click', function () {
    var searchterm = document.getElementById('wiki-search-bar').value;
    searchWikiApi(searchterm)
});

document.addEventListener('click', function () {
    if (event.target.className === 'searchHistoryBtn') {
        var searchTerm = event.target.textContent;
        searchMarvelCharacter(searchTerm);
    }
    // console.log(event.target.textContent);
});

function searchMarvelCharacter(query) {
    var publicKey = 'e6147ab9f31c4a7dd0d2c6bf68649dd9';
    var privateKey = 'd6401c906417dabe0cd8d8948f027ea7f6513378';
    var ts = new Date().getTime();
    var hash = md5(ts + privateKey + publicKey);

    fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&apikey=${publicKey}&hash=${hash}&ts=${ts}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
            return response.json();
        })
        .then(data => displayResults(data))
        // .catch(error => console.error('Error fetching data:', error));
    }
    
    function displayResults(data) {
        if (data.data.total !== 0) {
            var searchTerm = document.getElementById('search-bar').value;
            updateSearchHistory(searchTerm);
        }
        
        console.log(data);
        var resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ""; // Clear previous results
        
        data.data.results.forEach(character => {
            var resultElement = document.createElement('p');
            resultElement.textContent = character.name;
            resultsContainer.appendChild(resultElement);

            // Bind a click event to each character name
        resultElement.addEventListener('click', function() {
            displayComics(character.id);
        });

        resultElement.style.cursor = 'pointer';
        resultElement.style.display = 'block';
        resultElement.style.marginBottom = '10px';

        resultsContainer.appendChild(resultElement);
    });
}

function displayComics(characterId) {
    var publicKey = 'e6147ab9f31c4a7dd0d2c6bf68649dd9';
    var privateKey = 'd6401c906417dabe0cd8d8948f027ea7f6513378';
    var ts = new Date().getTime();
    var hash = md5(ts + privateKey + publicKey);

    fetch(`https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&hash=${hash}&ts=${ts}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        var comicAppearance = document.getElementById('comic-appearance');
        
        if (data.data.results.length === 0) {
            comicAppearance.innerHTML = '<h2>Comic Appearances</h2>' + 'No comics found for this character.';
            return;
        }
        
        comicAppearance.innerHTML = '<h2>Comic Appearances</h2>'
        
        data.data.results.forEach(comic => {
            var comicElement = document.createElement('div');
            var comicAppearance = document.getElementById('comic-appearance');
            
            // Creates an image element
            var comicImage = document.createElement('img');
            comicImage.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
            comicImage.alt = comic.title;
            comicImage.style.width = '100px'; 
            comicElement.appendChild(comicImage);

            var comicTitle = document.createElement('p');
            comicTitle.textContent = comic.title;
            comicElement.appendChild(comicTitle);

            comicTitle.addEventListener('click', function() {
                document.getElementById('modalTitle').textContent = comic.title;
                document.getElementById('modalDescription').textContent = comic.description || 'No description available.';
                var creatorList =document.getElementById('modalCreators');
                creatorList.innerHTML = '';
                if (comic.creators && comic.creators.items && comic.creators.items.length > 0){
                    comic.creators.items.forEach(creator => {
                        var creatorItem = document.createElement('li');
                        creatorItem.textContent = `${creator.name} (${creator.role})`;
                        creatorList.appendChild(creatorItem);
                    });
                } else {
                    var noCreators = document.createElement('li');
                    noCreators.textContent = 'No creators listed for this comic';
                    creatorList.appendChild(noCreators);
                }
                showModal();
            });

            comicAppearance.appendChild(comicElement);
        });
    })
    .catch(error => console.error('Error fetching comics:', error));
}

function showModal() {
    var backdrop = document.getElementById('modalBackdrop');
    var modal = document.getElementById('modalBox');
    var closeModal = document.getElementById('modalClose');

    backdrop.style.display = 'block';
    modal.style.display = 'block';

    closeModal.addEventListener('click', function() {
        backdrop.style.display = 'none';
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    backdrop.addEventListener('click', function(event) {
        if (event.target === backdrop) {
            backdrop.style.display = 'none';
            modal.style.display = 'none';
        }
    });
}


    function updateSearchHistory(term) {
        var historyContainer = document.getElementById('search-history');
        var buttons = historyContainer.getElementsByTagName('button');
        
        let termExists = false;
        for (let i = 0; i < buttons.length; i++) {
          if (buttons[i].textContent === term) {
            termExists = true;
            break;
          }
        }
        
        if (!termExists) {
          var historyItem = document.createElement('button');
          historyItem.className = 'searchHistoryBtn';
          historyItem.textContent = term;
          historyContainer.appendChild(historyItem);
        }
      }

    // Function to update the search history and save it to local storage
function updateSearchHistory(term) {
    var historyContainer = document.getElementById('search-history');
    var historyItems = historyContainer.getElementsByClassName('searchHistoryBtn');
    
    // Check if the term already exists in the search history
    for (let i = 0; i < historyItems.length; i++) {
        if (historyItems[i].textContent === term) {
            return; 
        }
    }

    var historyItem = document.createElement('button');
    historyItem.className = 'searchHistoryBtn';
    historyItem.textContent = term;
    historyContainer.appendChild(historyItem);

    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    searchHistory.push(term);

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function populateSearchHistory() {
    var historyContainer = document.getElementById('search-history');
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    for (var term of searchHistory) {
        var historyItem = document.createElement('button');
        historyItem.className = 'searchHistoryBtn';
        historyItem.textContent = term;
        historyContainer.appendChild(historyItem);
    }
}

window.addEventListener('load', populateSearchHistory);

document.getElementById('search-button').addEventListener('click', function () {
    var searchTerm = document.getElementById('search-bar').value;
    searchMarvelCharacter(searchTerm);
});

document.addEventListener('click', function (event) {
    if (event.target.className === 'searchHistoryBtn') {
        var searchTerm = event.target.textContent;
        searchMarvelCharacter(searchTerm);
    }
});

function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    // Clear search and comic results from the UI
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    const comicAppearance = document.getElementById('comic-appearance');
    comicAppearance.innerHTML = '<h2>Comic Appearances</h2>';
}
document.getElementById('clear-search').addEventListener('click', function () {
    clearSearchHistory()   
});

function searchWikiApi(searchTerm) {
    console.log(searchTerm);
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${searchTerm}`)
    .then(response => {
        return response.json();
    })
    .then(data => WikiResults(data))
    .catch(error => console.error('Error fetching data:', error));
}

function WikiResults(data) {
    var wikiContainer = document.getElementById('wiki-results');
    var header = wikiContainer.querySelector('h2'); // Find the header inside the container

    if (data[1] && data[1].length > 0) {
        var searchTerm = document.getElementById('search-bar').value;
        updateSearchHistory(searchTerm);

        // Clear the existing search results
        wikiContainer.innerHTML = "";
        // Reinsert the header
        wikiContainer.appendChild(header);

        for (let i = 0; i < data[1].length; i++) {
            var resultElement = document.createElement('p');
            resultElement.textContent = data[1][i];

            // Apply styling
            resultElement.style.cursor = 'pointer';
            resultElement.style.display = 'block';
            resultElement.style.marginBottom = '10px';

            var resultLink = document.createElement('a');
            resultLink.textContent = data[1][i];
            resultLink.href = data[3][i]; // Link to the Wikipedia page
            resultLink.target = '_blank'; // Open the link in a new tab

            resultElement.appendChild(resultLink);
            wikiContainer.appendChild(resultElement);
        }
    } else {
        // Display a message when no results are found
        wikiContainer.innerHTML = "No results found.";
    }
}


  
