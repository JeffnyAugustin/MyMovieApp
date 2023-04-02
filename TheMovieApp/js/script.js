const API_KEY = "api_key=b1bb009f89a909c0ae0b65bc17104e0e";
const BASE_URL= "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}&language=fr-fr`;

const IMG_URL = "https://image.tmdb.org/t/p/w500"; 

// Barre de recherche
const searchURL = `${BASE_URL}/search/movie?${API_KEY}&language=fr-fr`;

// Récuperer genre film
const movieType =`${BASE_URL}/genre/movie/list?${API_KEY}&language=fr-fr`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
getMovies(API_URL);

function getMovies(url) {
       // json : tableau qui contient des objets
    // data c'est mon tableau

    // Fetch retourne une promesse. tant que la promesse n'est pas faite alors les autres actions ne peuvent pas se faire. Pour récuperer la promesse, on va récuperer la fonction then et then va nous retourner la réponse de notre fetch, sauf que la réponse n'est pas lisible pour la rendre + lisible on la transforme en Json, json ça permet de transformer notre réponse en un objet javascript qui est interpretable par notre navigateur, quand on essaie de lire la réponse json on voit que la promesse est en attente on va donc utiliser un autre then pour récuperer notre réponse qu'on va nommer data. Lorsqu'on fait un 1er then on ne peut pas récuperer la réponse tout de suite, il faut donc utiliser un 2ème then pour récuperer quelque chose d'exploitable.
    fetch(url).then(res => res.json()).then(data => {
        showMovies(data.results);   
        // console.log(data.results);
    });
}
function showMovies(data) {
    main.innerHTML = "";
    data.forEach(movie => {
    const {title, poster_path, vote_average, overview, id} = movie;
    const movieE1 = document.createElement("div");
    movieE1.classList.add("movie");

    const imgE1 = document.createElement("img");
    imgE1.src = `${IMG_URL+poster_path}`;
    imgE1.alt = title;

    const movieInfoE1 = document.createElement("div");
    movieInfoE1.classList.add("movie-info");

    const titleE1 = document.createElement("h3");
    titleE1.textContent = title;

    const ratingE1 = document.createElement("span");
    ratingE1.classList.add(getColor(vote_average));
    ratingE1.textContent = Math.floor(vote_average);

    const overviewE1 = document.createElement("div");
    overviewE1.classList.add("overview");

    const overviewTitleE1 = document.createElement("h3");
    overviewTitleE1.textContent = "Synopsis";

    const overviewTextE1 = document.createElement("p");
    overviewTextE1.textContent = overview;

    const moreinfoButtonE1 = document.createElement("button");
    moreinfoButtonE1.classList.add("moreinfo");
    moreinfoButtonE1.id = `moreinfo-${id}`;

    const moreinfoSpanE1 = document.createElement("span");
    moreinfoSpanE1.textContent = "En savoir ";

    const moreinfoIconE1 = document.createElement("i");
    moreinfoIconE1.classList.add("fa-solid", "fa-plus");

    moreinfoSpanE1.appendChild(moreinfoIconE1);
    moreinfoButtonE1.appendChild(moreinfoSpanE1);

    movieInfoE1.appendChild(titleE1);
    movieInfoE1.appendChild(ratingE1);
    overviewE1.appendChild(overviewTitleE1);
    overviewE1.appendChild(overviewTextE1);
    overviewE1.appendChild(moreinfoButtonE1);
    movieE1.appendChild(imgE1);
    movieE1.appendChild(movieInfoE1);
    movieE1.appendChild(overviewE1);
    main.appendChild(movieE1);

    // Add an event listener to the button to open the modal
    const modalButton = document.getElementById(`moreinfo-${id}`);
    modalButton.addEventListener('click', () => {
      // Call createMovieModal function with the movie object as argument
        createMovieModal(movie);
        });
    });
}

function createMovieModal(movie) {
  // Create modal elements
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.textContent = "X"
    modalContent.appendChild(closeButton);

    const modalBTitle = document.createElement("div")
    modalBTitle.classList.add("BTitle");
    const modalTitle = document.createElement("h2");
    modalTitle.textContent = movie.title;
    modalBTitle.appendChild(modalTitle);
    modalContent.appendChild(modalBTitle);

    // Ajout bande annonce
    const modalVideo = document.createElement("div");
    modalVideo.classList.add("trailer-movie");
    const trailer = `${BASE_URL}/movie/${movie.id}?${API_KEY}&language=fr-fr&append_to_response=videos`
    fetch(trailer).then(res => res.json()).then(data => {
    const keyTrailer = data.videos.results[0].key;
    const iframe = document.createElement("iframe");
    iframe.src=`https://www.youtube.com/embed/${keyTrailer}`;
    iframe.width = 650;
    iframe.height = 400;
    console.log(data.videos.results[0].key);
    modalVideo.appendChild(iframe);
    });
    modalContent.appendChild(modalVideo);

    const modalTextImg = document.createElement("div");
    modalTextImg.classList.add("text-img");

    const modalImage = document.createElement("img");
    modalImage.src = `${IMG_URL+movie.poster_path}`;
    modalImage.alt = movie.title;
    modalTextImg.appendChild(modalImage);

    const modalOverview = document.createElement("p");
    modalOverview.textContent = movie.overview;
    modalTextImg.appendChild(modalOverview);

    modalContent.appendChild(modalTextImg);

// const cast =`${BASE_URL}/movie/${id}/credits?${API_KEY}&language=fr-fr&append_to_response=videos`;

// fetch(cast).then(res =>res.json()).then(data => {
//     console.log(data.cast.id);
// })


    const modalRating = document.createElement("span");
    modalRating.classList.add(getColor(movie.vote_average));
    modalRating.textContent = Math.floor(movie.vote_average);
    modalContent.appendChild(modalRating);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

  // Add event listener to close modal on click
    closeButton.addEventListener("click", () => {
        modal.remove();
    });

    closeButton.addEventListener("mouseover", () => {
        closeButton.style.color = "#000";
    });

    closeButton.addEventListener("mouseout", () => {
        closeButton.style.color = "#aaa";
    });
}


function getColor(vote) {
    if(vote > 8) {
        return "green"
    } else if(vote > 5) {
        return "orange"
    } else {
        return "red";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    console.log(searchTerm);
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    } else {
        getMovies(API_URL);
    }
})

// Changer de catégorie de film
function categoryShow(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const selectCategory = document.getElementById("moviecategory");
        data.genres.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            selectCategory.appendChild(option);
        })
    });
}

categoryShow(movieType);

const eventSelectCategory = document.getElementById("moviecategory");
eventSelectCategory.addEventListener("input", changeCategory);

function changeCategory() {
    const selectValue = eventSelectCategory.value;
    const categoryURL = `${BASE_URL}/discover/movie?${API_KEY}&language=fr-fr&sort_by=popularity.desc&with_genres=${selectValue}`;
    getMovies(categoryURL);
}

