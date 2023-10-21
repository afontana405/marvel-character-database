window.addEventListener('load', populateWikiHistory)

//event listener for the Wikipedia search button to perform a Wikipedia search
document.getElementById('wiki-search-btn').addEventListener('click', function () {
    var searchterm = document.getElementById('wiki-search-bar').value;
    searchWikiApi(searchterm)
});

document.getElementById('wiki-clear-search').addEventListener('click', function () {
    clearWikiResult();
});

// event listener for wiki search history buttons
document.addEventListener('click', function () {
    if (event.target.className === 'wiki-search-btn') {
        var searchterm = event.target.textContent;
        searchWikiApi(searchterm);
    }
});

// pulls requested data from wiki api
function searchWikiApi(searchTerm) {
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${searchTerm}`)
    .then(response => {
        return response.json();
    })
    .then(data => WikiResults(data))
    .catch(error => console.error('Error fetching data:', error));
}

// displays results with their links
function WikiResults(data) {
    var wikiContainer = document.getElementById('wiki-results');
    var header = wikiContainer.querySelector('h2'); // Find the header inside the container

    if (data[1] && data[1].length > 0) {
        var searchTerm = document.getElementById('wiki-search-bar').value;
        updateWikiSearchHistory(searchTerm);

        // Clear the existing search results
        wikiContainer.innerHTML = "";
        // Reinsert the header
        wikiContainer.appendChild(header);

        for (let i = 0; i < data[1].length; i++) {
            var resultElement = document.createElement('p');
            // resultElement.textContent = data[1][i];

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
        
        wikiContainer.innerHTML = "No results found.";
    }
}

// adds btn with value of user input and adds it to local storage
function updateWikiSearchHistory(searchTerm) {
    var wikiLocalStorage = JSON.parse(localStorage.getItem('wikiSearchHistory')) || [];
    // wont create history btn if already searched
    if (!wikiLocalStorage.includes(searchTerm)) {
        var searchHistoryEl = document.getElementById('wiki-search-history');
        var searchHistoryBtn = document.createElement('button');
        searchHistoryBtn.className = 'wiki-search-btn';
        searchHistoryBtn.textContent = searchTerm;
        wikiLocalStorage.push(searchTerm);
        localStorage.setItem('wikiSearchHistory', JSON.stringify(wikiLocalStorage));
        searchHistoryEl.appendChild(searchHistoryBtn);
    }
}

// clears results from wiki results
function clearWikiResult() {
    console.log('clear');
    var wikiResultsEl = document.getElementById('wiki-results');
    wikiResultsEl.innerHTML = '<h2>Wiki Results</h2>';
}

// pulls info from localStorage and creates history btns
function populateWikiHistory() {
    var wikiLocalStorage = JSON.parse(localStorage.getItem('wikiSearchHistory')) || [];
    for (var term of wikiLocalStorage) {
        var searchHistoryEl = document.getElementById('wiki-search-history');
        var searchHistoryBtn = document.createElement('button');
        searchHistoryBtn.className = 'wiki-search-btn';
        searchHistoryBtn.textContent = term;
        searchHistoryEl.appendChild(searchHistoryBtn);
    };
}
