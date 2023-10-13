document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-bar').value;
    searchMarvelCharacter(searchTerm);
    updateSearchHistory(searchTerm);
});


  
  
