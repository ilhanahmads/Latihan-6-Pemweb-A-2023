const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
    const movieId = 'tt3896198'; 
    const apiKey = 'a78997d9'; 
    const URL = `https://omdbapi.com/?i=${movieId}&apikey=${apiKey}&s=${searchTerm}&page=1`;
    const res = await fetch(URL);
    const data = await res.json();
    if (data.Response === "True") {
        displayMovieList(data.Search);
    }
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let i = 0; i < movies.length; i++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[i].imdbID; 
        movieListItem.classList.add('search-list-item');
        if(movies[i].Poster != "N/A")
            moviePoster = movies[i].Poster;
        else 
            moviePoster = "notfound.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[i].Title}</h3>
            <p>${movies[i].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            const imdbId = movie.dataset.id; 
            const apiKey = 'a78997d9';
            const URL = `https://omdbapi.com/?i=${imdbId}&apikey=${apiKey}`;
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(URL);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}


function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "notfound.png"}" alt = "">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year : ${details.Year}</li>
            <li class = "rated">Ratings : ${details.Rated}</li>
            <li class = "released">Released : ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre :</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer :</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors : </b>${details.Actors}</p>
        <p class = "plot"><b>Plot :</b> ${details.Plot}</p>
        <p class = "duration"><b>Duration :</b> ${details.Runtime}</p><br>
        <p class = "language"><b>Language :</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});