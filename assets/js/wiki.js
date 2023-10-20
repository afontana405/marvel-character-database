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

  
  
