document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-bar').value;
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
    const publicKey = 'e6147ab9f31c4a7dd0d2c6bf68649dd9';
    const privateKey = 'd6401c906417dabe0cd8d8948f027ea7f6513378';
    const ts = new Date().getTime();
    const hash = md5(ts + privateKey + publicKey);

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
            const searchTerm = document.getElementById('search-bar').value;
            updateSearchHistory(searchTerm);
        }
        
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ""; // Clear previous results
        
        data.data.results.forEach(character => {
            const resultElement = document.createElement('p');
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
    const publicKey = 'e6147ab9f31c4a7dd0d2c6bf68649dd9';
    const privateKey = 'd6401c906417dabe0cd8d8948f027ea7f6513378';
    const ts = new Date().getTime();
    const hash = md5(ts + privateKey + publicKey);

    fetch(`https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&hash=${hash}&ts=${ts}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const resultsContainer = document.getElementById('results');

        if (data.data.results.length === 0) {
            var comicAppearance = document.getElementById('comic-appearance');
            comicAppearance.innerHTML = '<h2>Comic Appearances</h2>' + 'No comics found for this character.';
            return;
        }

        data.data.results.forEach(comic => {
            const comicElement = document.createElement('div');
            var comicAppearance = document.getElementById('comic-appearance');
            comicAppearance.innerHTML = '<h2>Comic Appearances</h2>'
            
            // Creates an image element
            const comicImage = document.createElement('img');
            comicImage.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
            comicImage.alt = comic.title;
            comicImage.style.width = '100px'; 
            comicElement.appendChild(comicImage);

            const comicTitle = document.createElement('p');
            comicTitle.textContent = comic.title;
            comicElement.appendChild(comicTitle);

            comicTitle.addEventListener('click', function() {
                document.getElementById('modalTitle').textContent = comic.title;
                document.getElementById('modalDescription').textContent = comic.description || 'No description available.';
                showModal();
            });

            comicAppearance.appendChild(comicElement);
        });
    })
    .catch(error => console.error('Error fetching comics:', error));
}

function showModal() {
    const backdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modalBox');
    const closeModal = document.getElementById('modalClose');

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
        const historyContainer = document.getElementById('search-history');
        const buttons = historyContainer.getElementsByTagName('button');
        
        let termExists = false;
        for (let i = 0; i < buttons.length; i++) {
          if (buttons[i].textContent === term) {
            termExists = true;
            break;
          }
        }
        
        if (!termExists) {
          const historyItem = document.createElement('button');
          historyItem.className = 'searchHistoryBtn';
          historyItem.textContent = term;
          historyContainer.appendChild(historyItem);
        }
      }

    // Function to update the search history and save it to local storage
    function updateSearchHistory(term) {
        const historyContainer = document.getElementById('search-history');
        const historyItems = historyContainer.getElementsByClassName('searchHistoryBtn');

        // Check if the term already exists in the search history
        for (let i = 0; i < historyItems.length; i++) {
            if (historyItems[i].textContent === term) {
                return; 
            }
        }

    const historyItem = document.createElement('button');
    historyItem.className = 'searchHistoryBtn';
    historyItem.textContent = term;
    historyContainer.appendChild(historyItem);

    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    searchHistory.push(term);

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function populateSearchHistory() {
    const historyContainer = document.getElementById('search-history');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    for (const term of searchHistory) {
        const historyItem = document.createElement('button');
        historyItem.className = 'searchHistoryBtn';
        historyItem.textContent = term;
        historyContainer.appendChild(historyItem);
    }
}

window.addEventListener('load', populateSearchHistory);

document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-bar').value;
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
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    });
}

  
  
