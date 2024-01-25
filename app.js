document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '357b9233'; // Remplace par ta clé API OMDb

    const searchForm = document.getElementById('searchForm');
    const moviesContainer = document.getElementById('moviesContainer');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchTerm = document.getElementById('searchInput').value;

        if (searchTerm) {
            searchMovies(searchTerm);
        }
    });

    function searchMovies(searchTerm) {
        const apiUrl = `http://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Search) {
                    displayMovies(data.Search);
                } else {
                    alert('Aucun résultat trouvé.');
                }
            })
            .catch(error => console.error('Erreur de recherche:', error));
    }

    function displayMovies(movies) {
        moviesContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            moviesContainer.appendChild(movieCard);
        });

        observeMovies();
    }

    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card', 'movie-card');

        const imgSrc = movie.Poster !== 'N/A' ? movie.Poster : 'placeholder-image.jpg';

        movieCard.innerHTML = `
            <img src="${imgSrc}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">Date de sortie: ${movie.Year}</p>
                <button class="btn btn-primary read-more" data-toggle="modal" data-target="#movieModal" data-imdbid="${movie.imdbID}">
                    Read more
                </button>
            </div>
        `;

        return movieCard;
    }

    function observeMovies() {
        const movieCards = document.querySelectorAll('.movie-card');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        });

        movieCards.forEach(card => {
            observer.observe(card);
        });
    }

    // Gestion du clic sur le bouton "Read more"
    moviesContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('read-more')) {
            const imdbID = event.target.getAttribute('data-imdbid');
            fetchMovieDetails(imdbID);
        }
    });

    function fetchMovieDetails(imdbID) {
        const detailsUrl = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

        fetch(detailsUrl)
            .then(response => response.json())
            .then(movieDetails => {
                // Afficher les détails dans une popup (modal)
                showMovieDetailsModal(movieDetails);
            })
            .catch(error => console.error('Erreur de récupération des détails du film:', error));
    }

    function showMovieDetailsModal(movieDetails) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h5 class="modal-title">${movieDetails.Title}</h5>
            <p>${movieDetails.Plot}</p>
            <p>Date de sortie: ${movieDetails.Released}</p>
        `;

        // Afficher la modal
        $('#movieModal').modal('show');
    }
});
