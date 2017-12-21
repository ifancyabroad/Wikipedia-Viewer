// Global variables for DOM elements
const wikiViewer = document.getElementById('wiki-viewer');
const form = document.getElementById('search');
const searchInput = document.getElementById('search-box');
const articleContainer = document.getElementById('articles');

// Add articles when form is submitted
form.addEventListener("submit", function(e) {
  e.preventDefault();
  wikiViewer.className = 'lift-animation';
  searchWiki(searchInput.value);
});

// Fetch 10 articles from Wikipedia based on search input
const searchWiki = function(input) {
  fetch(`https://en.wikipedia.org/w/api.php?action=query&origin=*&generator=search&gsrsearch=${input}&prop=info|extracts&inprop=url&exsentences=1&exintro=1&format=json`)
  .then(response => response.json())
  .then(addArticles)
  .catch(requestError)
}

// Remove current articles from the page
const removeArticles = function() {
  while (articleContainer.firstChild) {
    articleContainer.removeChild(articleContainer.firstChild);
  }
}

// Add Wikipedia articles to the page
const addArticles = function(data) {
  // First remove current articles
  removeArticles();
  let wikiArticles = document.createElement('ul');
  // If search returned results add an article for each one
  if (data.query) {
    for (let article in data.query.pages) { 
      wikiArticles.insertAdjacentHTML('beforeend', 
      `<a href="${data.query.pages[article].fullurl}"><li class="article">
        <h2>${data.query.pages[article].title}</h2>
        <p>${data.query.pages[article].extract}</p>
      </li></a>`)
    }
  // If no results were returned, inform the user
  } else {
    wikiArticles.insertAdjacentHTML('beforeend', '<li class="text-center">Sorry no articles found.</li>')
  }
  // Append information to the DOM
  articleContainer.appendChild(wikiArticles);
  setTimeout(function () {
    articleContainer.className = 'fadein-animation';
  }, 500);
}

// Inform user if API call fails
const requestError = function() {
  window.alert(`Sorry there was an error retrieving data from Wikipedia`);
}