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
    movieInfoE1.append(titleE1, ratingE1,);
    overviewE1.append(overviewTitleE1, overviewTextE1, moreinfoButtonE1);
    movieE1.append(imgE1, movieInfoE1, overviewE1);
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
  closeButton.textContent = "X";
  

  const modalTitle = document.createElement("h2");
   closeButton.classList.add("title-movie");
  modalTitle.textContent = movie.title;


  // Add actors with their images
  const modalCast = document.createElement("div");
  modalCast.classList.add("modal-cast");
  const castUrl = `${BASE_URL}/movie/${movie.id}/credits?${API_KEY}&language=fr-fr`;
  fetch(castUrl).then((res) => res.json()).then((data) => {
      const castList = data.cast.slice(0, 5);
      const castItems = castList.map(
        (cast) =>
          `<li><img src="${IMG_URL + cast.profile_path}" alt="${cast.name}"><span class = "role" >${cast.name} <br>Rôle : ${cast.character}</span></li>`
      ).join("");
      const castListContainer = document.createElement("ul");
      castListContainer.classList.add("cast-List")
      castListContainer.innerHTML = castItems;
      modalCast.appendChild(castListContainer);
    });



// add runtime + release date + genre

  // Add genre information
  const modalGenres = document.createElement("div");
  modalGenres.classList.add("modal-genres");
  const genresUrl = `${BASE_URL}/movie/${movie.id}?${API_KEY}&language=fr-fr`;
  fetch(genresUrl).then((res) => res.json()).then((data) => {
      const genreList = data.genres.map(genre => genre.name).join(", ");
      const genreText = document.createElement("p");
      genreText.textContent = genreList;
      modalGenres.appendChild(genreText);
    });


//  Add runtime movie
  const modalDate = document.createElement("div");
  modalDate.classList.add("modal-date");
  const modalDateUrl = `${BASE_URL}/movie/${movie.id}?${API_KEY}&language=fr-fr`;
  fetch(modalDateUrl).then((res) => res.json()).then((data) => {
    const modalDateruntime = data.runtime;
    const modalDateText = document.createElement("p");
      modalDateText.textContent = "Durée :    "  + "                     " + modalDateruntime + "  " + "minutes";
      modalDate.appendChild(modalDateText);
    
    });



  //  Add release movie

   const modalRelease = document.createElement("div");
  modalRelease.classList.add("modal-release");
  const modalReleaseUrl = `${BASE_URL}/movie/${movie.id}?${API_KEY}&language=fr-fr`;
  fetch(modalReleaseUrl).then((res) => res.json()).then((data) => {
    console.log(data.release_date);
    const modalReleasedate = data.release_date;
    const modalReleaseText = document.createElement("p");
      modalReleaseText.textContent = "Date de sortie   "  +  " :  "  +  "    " + modalReleasedate;
      modalRelease.appendChild(modalReleaseText);
    
    });




  // Add trailer
  const modalTrailer = document.createElement("div");
  modalTrailer.classList.add("modal-trailer");
  const trailerUrl = `${BASE_URL}/movie/${movie.id}/videos?${API_KEY}&language=fr-fr`;
  fetch(trailerUrl).then((res) => res.json()).then((data) => {
      const key = data.results[0].key;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${key}`;
      iframe.width = 760;
      iframe.height = 500;
      modalTrailer.appendChild(iframe);
    });
 

  const text_img = document.createElement("div");
  text_img.classList.add("text-img");

 

  // Partie modal image
  const modalImg = document.createElement("div");
  modalImg.classList.add("img-movie");

  const modalImage = document.createElement("img");
  modalImage.id = "modalimg";
  modalImage.src = `${IMG_URL + movie.poster_path}`;
  modalImage.alt = movie.title;
  modalImg.appendChild(modalImage);


  const containInfo = document.createElement("div");
  containInfo.classList.add("containInfo");
  

 // Partie modal synopsis
  const divOverview = document.createElement("div");
  divOverview.id = "synopsis";
  const modalOverview = document.createElement("p");
  modalOverview.classList.add("modaltext")
  modalOverview.textContent = movie.overview;
  
  divOverview.appendChild(modalOverview)
  text_img.append(modalImg, containInfo);

  const infoMovie = document.createElement("div");
  infoMovie.id = "infoMovie";
  infoMovie.append(modalDate, modalRelease)

  const modalRating = document.createElement("span");
  modalRating.id = "get_Color";
  modalRating.classList.add(getColor(movie.vote_average));
  modalRating.textContent = " Note  " + " : " + Math.floor(movie.vote_average) + " / " + "10 ";

  containInfo.append(modalGenres, divOverview, infoMovie);
  modalContent.append(closeButton, modalTitle, modalTrailer, text_img, modalCast, modalRating,);
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

const button = document.querySelector('.btn');

const displayButton = () => {
  window.addEventListener('scroll', () => {
    console.log(window.scrollY);
  
    if (window.scrollY > 100) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });
};

const scrollToTop = () => {
  button.addEventListener("click", () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    }); 
    console.log(event);
  });
};

displayButton();
scrollToTop();
