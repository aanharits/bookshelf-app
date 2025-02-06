const STORAGE_KEY = "FILMSHELF_DATA";
let filmCollection = [];

document.addEventListener("DOMContentLoaded", () => {
    const formAddFilm = document.getElementById("filmForm");
    const formSearchFilm = document.getElementById("searchFilm");

    formAddFilm.addEventListener("submit", handleAddFilm);
    formSearchFilm.addEventListener("submit", handleSearchFilm);

    loadFilmsFromLocalStorage();
});

// Simpan data film ke local storage
function saveFilmsToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filmCollection));
}

// Fungsi untuk menambah film baru
function handleAddFilm(event) {
    event.preventDefault();

    const titleInput = document.getElementById("filmFormTitle").value;
    const producerInput = document.getElementById("filmFormProducer").value;
    const yearInput = parseInt(document.getElementById("filmFormYear").value);
    const isCompleted = document.getElementById("filmFormIsComplete").checked;

    const newFilm = {
        id: Date.now(),
        title: titleInput,
        producer: producerInput,
        year: yearInput,
        isComplete: isCompleted,
    };

    filmCollection.push(newFilm);
    saveFilmsToLocalStorage();
    displayFilms();
}

// Memuat film dari local storage
function loadFilmsFromLocalStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        filmCollection = JSON.parse(storedData);
        displayFilms();
    }
}

// Menampilkan film di rak 
function displayFilms(filteredFilms = filmCollection) {
    const incompleteSection = document.getElementById("incompleteFilmList");
    const completeSection = document.getElementById("completeFilmList");

    incompleteSection.innerHTML = "";
    completeSection.innerHTML = "";

    filteredFilms.forEach((film) => {
        const filmCard = createFilmCard(film);
        if (film.isComplete) {
            completeSection.appendChild(filmCard);
        } else {
            incompleteSection.appendChild(filmCard);
        }
    });
}

// Mengubah status film
function toggleFilmCompletion(filmId) {
    const targetFilm = filmCollection.find((film) => film.id === filmId);
    if (targetFilm) {
        targetFilm.isComplete = !targetFilm.isComplete;
        saveFilmsToLocalStorage();
        displayFilms();
    }
}

// Menghapus film
function removeFilm(filmId) {
    filmCollection = filmCollection.filter((film) => film.id !== filmId);
    saveFilmsToLocalStorage();
    displayFilms();
}

// Mencari film
function handleSearchFilm(event) {
    event.preventDefault();
    const searchQuery = document.getElementById("searchFilmTitle").value.toLowerCase();
    const searchResults = filmCollection.filter((film) =>
        film.title.toLowerCase().includes(searchQuery)
    );
    displayFilms(searchResults);
}

// Membuat elemen film
function createFilmCard({ id, title, producer, year, isComplete }) {
    const filmCard = document.createElement("div");
    filmCard.classList.add("film-item");
    filmCard.setAttribute("data-filmid", id);
    filmCard.setAttribute("data-testid", "filmItem");

    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    titleElement.setAttribute("data-testid", "filmItemTitle");
    filmCard.appendChild(titleElement);

    const producerElement = document.createElement("p");
    producerElement.textContent = `Producer: ${producer}`;
    producerElement.setAttribute("data-testid", "filmItemProducer");
    filmCard.appendChild(producerElement);

    const yearElement = document.createElement("p");
    yearElement.textContent = `Tahun: ${year}`;
    yearElement.setAttribute("data-testid", "filmItemYear");
    filmCard.appendChild(yearElement);

    const buttonContainer = document.createElement("div");
    filmCard.appendChild(buttonContainer);

    const toggleButton = document.createElement("button");
    toggleButton.classList.add('toggleButton')
    toggleButton.textContent = isComplete ? "Belum selesai ditonton" : "Selesai ditonton";
    toggleButton.setAttribute("data-testid", "filmItemIsCompleteButton");
    toggleButton.addEventListener("click", () => toggleFilmCompletion(id));
    buttonContainer.appendChild(toggleButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add('deleteButton')
    deleteButton.textContent = "Hapus Film";
    deleteButton.setAttribute("data-testid", "filmItemDeleteButton");
    deleteButton.addEventListener("click", () => removeFilm(id));
    buttonContainer.appendChild(deleteButton);

    return filmCard;
}
