'use strict';

const searchRecipesURL = 'https://api.spoonacular.com/food/videos/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayRecipesResults(responseJson, query, number) {
  document.getElementById('recipes-results').scrollIntoView();
  // if there are previous results, remove them
  $('#recipes-list').empty();
  if ((responseJson.videos === undefined) ||(responseJson.videos.length == 0)){
    $('#recipes-list').html('<p>Sorry, we did not find any result. Please try another query. </p>')
  };
  // iterate through the items array
  for (let i = 0; i < responseJson.videos.length && i < number; i++){
     // for each object in the videos
    //array and if the title matches the query, add a list item to the results 
    //list with the title, thumbnail
    let videoTitle = responseJson.videos[i].title.toLowerCase();
      if (videoTitle.includes(query)){
        console.log(videoTitle);
        $('#recipes-list').append(
          `<li><h3>'${responseJson.videos[i].title}'</h3>
          <a href='https://youtube.com/watch?v=${responseJson.videos[i].youTubeId}' target = '_blank'><img src = '${responseJson.videos[i].thumbnail}'></a>
          </li>`);
      };
  };
  //display the results section  
  $('#recipes-results').removeClass('hidden');
};

function getRecipes(query, number) {
  const apiKey = '752a9b6e69854094b6c34d48a6cabe31';

  const params = {
    'query': query,
    'number': number
  };

  const queryString = formatQueryParams(params)
  const url = searchRecipesURL + '?' + queryString + '&apiKey=' + apiKey;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayRecipesResults(responseJson, query, number))
    .catch(err => {
      $('#js-recipes-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const query = $('#js-search-food').val().toLowerCase();
    const number = $('#js-number').val();
    $('#recipes-list').empty();
    getRecipes(query, number);
  });
}

$(watchForm);
