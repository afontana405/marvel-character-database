document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-bar').value;
    searchMarvelCharacter(searchTerm);
    updateSearchHistory(searchTerm);
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
        .catch(error => console.error('Error fetching data:', error));
}

  

  
  
