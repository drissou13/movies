const API_KEY = 'ee5b9babb756eae4defc4d0a0003824f';  // Remplacez par votre clé API TMDb
const BASE_URL = 'https://api.themoviedb.org/3';
const moviesContainer = document.getElementById('movies-container');
const modal = document.getElementById('trailer-modal');
const modalClose = document.querySelector('.close');
const trailerVideo = document.getElementById('trailer-video');

// 📅 Vérification du jour actuel pour une mise à jour chaque mercredi
const today = new Date();
const dayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 3 = Mercredi
const lastWednesday = new Date(today);
lastWednesday.setDate(today.getDate() - (dayOfWeek === 3 ? 0 : (dayOfWeek + 4) % 7));

// 🎬 Charger les films actuellement à l'affiche en France
async function fetchMovies() {
    const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1&region=FR`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

// 🖼️ Afficher les films à l'affiche
function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" data-id="${movie.id}">
            <h3>${movie.title}</h3>
        `;
        movieElement.addEventListener('click', () => fetchTrailer(movie.id));
        moviesContainer.appendChild(movieElement);
    });
}

// 🎥 Récupérer la bande-annonce d'un film
async function fetchTrailer(movieId) {
    const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`;
    const response = await fetch(url);
    const data = await response.json();
    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");

    if (trailer) {
        trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}`;
        modal.style.display = "flex";
    }
}

// ❌ Fermer la modale de la bande-annonce
modalClose.addEventListener('click', () => {
    modal.style.display = "none";
    trailerVideo.src = "";
});

// Fonction qui s'assure de mettre à jour les films chaque mercredi
function checkForUpdate() {
    const currentDay = new Date();
    const currentDayOfWeek = currentDay.getDay();
    
    // Si aujourd'hui est mercredi, rafraîchir les films
    if (currentDayOfWeek === 3) {
        fetchMovies();
    }
}

// Initialiser le chargement des films
fetchMovies();

// Vérification du jour et mise à jour des films chaque mercredi
checkForUpdate();