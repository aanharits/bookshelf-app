const STORAGE_KEY = "BOOKSHELF_DATA";
let bookCollection = [];

document.addEventListener("DOMContentLoaded", () => {
    const formAddBook = document.getElementById("bookForm");
    const formSearchBook = document.getElementById("searchBook");

    formAddBook.addEventListener("submit", handleAddBook);
    formSearchBook.addEventListener("submit", handleSearchBook);

    loadBooksFromLocalStorage();
});

// Simpan data buku ke local storage
function saveBooksToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookCollection));
}

// Fungsi untuk menambah buku baru
function handleAddBook(event) {
    event.preventDefault();

    const titleInput = document.getElementById("bookFormTitle").value;
    const authorInput = document.getElementById("bookFormAuthor").value;
    const yearInput = parseInt(document.getElementById("bookFormYear").value);
    const isCompleted = document.getElementById("bookFormIsComplete").checked;

    const newBook = {
        id: Date.now(),
        title: titleInput,
        author: authorInput,
        year: yearInput,
        isComplete: isCompleted,
    };

    bookCollection.push(newBook);
    saveBooksToLocalStorage();
    displayBooks();
}

// Memuat buku dari local storage
function loadBooksFromLocalStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        bookCollection = JSON.parse(storedData);
        displayBooks();
    }
}

// Menampilkan buku di rak
function displayBooks(filteredBooks = bookCollection) {
    const incompleteSection = document.getElementById("incompleteBookList");
    const completeSection = document.getElementById("completeBookList");

    incompleteSection.innerHTML = "";
    completeSection.innerHTML = "";

    filteredBooks.forEach((book) => {
        const bookCard = createBookCard(book);
        if (book.isComplete) {
            completeSection.appendChild(bookCard);
        } else {
            incompleteSection.appendChild(bookCard);
        }
    });
}

// Mengubah status buku
function toggleBookCompletion(bookId) {
    const targetBook = bookCollection.find((book) => book.id === bookId);
    if (targetBook) {
        targetBook.isComplete = !targetBook.isComplete;
        saveBooksToLocalStorage();
        displayBooks();
    }
}

// Menghapus buku
function removeBook(bookId) {
    bookCollection = bookCollection.filter((book) => book.id !== bookId);
    saveBooksToLocalStorage();
    displayBooks();
}

// Mencari buku
function handleSearchBook(event) {
    event.preventDefault();
    const searchQuery = document.getElementById("searchBookTitle").value.toLowerCase();
    const searchResults = bookCollection.filter((book) =>
        book.title.toLowerCase().includes(searchQuery)
    );
    displayBooks(searchResults);
}

// Membuat elemen buku
function createBookCard({ id, title, author, year, isComplete }) {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-item");
    bookCard.setAttribute("data-bookid", id);
    bookCard.setAttribute("data-testid", "bookItem");

    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    titleElement.setAttribute("data-testid", "bookItemTitle");

    const authorElement = document.createElement("p");
    authorElement.textContent = `Producer: ${author}`;
    authorElement.setAttribute("data-testid", "bookItemAuthor");

    const yearElement = document.createElement("p");
    yearElement.textContent = `Tahun: ${year}`;
    yearElement.setAttribute("data-testid", "bookItemYear");

    const buttonContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add('toggleButton')
    toggleButton.textContent = isComplete ? "Belum selesai ditonton" : "Selesai ditonton";
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.addEventListener("click", () => toggleBookCompletion(id));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add('deleteButton')
    deleteButton.textContent = "Hapus Film";
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.addEventListener("click", () => removeBook(id));

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(deleteButton);

    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorElement);
    bookCard.appendChild(yearElement);
    bookCard.appendChild(buttonContainer);

    return bookCard;
}
