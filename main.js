// Fungsi untuk membuat objek buku
function createBook(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }
  
  // Fungsi untuk menyimpan data buku ke localStorage
  function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
  }
  
  // Fungsi untuk mengambil data buku dari localStorage
  function getBooks() {
    const booksData = localStorage.getItem('books');
    return booksData ? JSON.parse(booksData) : [];
  }
  
  // Fungsi untuk membuat elemen buku
  function createBookItem(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book_item');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');
  
    const title = document.createElement('h3');
    title.innerText = book.title;
    title.setAttribute('data-testid', 'bookItemTitle');
  
    const author = document.createElement('p');
    author.innerText = `Penulis: ${book.author}`;
    author.setAttribute('data-testid', 'bookItemAuthor');
  
    const year = document.createElement('p');
    year.innerText = `Tahun: ${book.year}`;
    year.setAttribute('data-testid', 'bookItemYear');
  
    const action = document.createElement('div');
    action.classList.add('action');
  
    const completeButton = document.createElement('button');
    completeButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    completeButton.classList.add(book.isComplete ? 'green' : 'red');
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    completeButton.addEventListener('click', () => {
      moveBookToCompleted(book.id);
      renderBooks();
    });
  
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.classList.add('red');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.addEventListener('click', () => {
      deleteBook(book.id);
      renderBooks();
    });
  
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit buku';
    editButton.classList.add('yellow');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.addEventListener('click', () => {
      showEditForm(book.id);
    });
  
    action.append(completeButton, deleteButton, editButton);
    bookItem.append(title, author, year, action);
  
    return bookItem;
  }
  
  // Fungsi untuk menampilkan form edit buku
  function showEditForm(bookId) {
    const books = getBooks();
    const book = books.find((book) => book.id === bookId);
  
    if (book) {
      document.getElementById('bookFormTitle').value = book.title;
      document.getElementById('bookFormAuthor').value = book.author;
      document.getElementById('bookFormYear').value = book.year;
      document.getElementById('bookFormIsComplete').checked = book.isComplete;
  
      const submitButton = document.getElementById('bookFormSubmit');
      submitButton.innerText = 'Edit Buku';
  
      bookForm.setAttribute('data-editing-bookid', bookId);
      bookForm.addEventListener('submit', editBook);
    }
  }
  
  // Fungsi untuk menangani submit form edit buku
  function editBook(event) {
    event.preventDefault();
  
    const bookId = parseInt(bookForm.getAttribute('data-editing-bookid'));
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
  
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === bookId);
  
    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        title,
        author,
        year,
        isComplete,
      };
      saveBooks(books);
      renderBooks();
    }
  
    bookForm.reset();
    const submitButton = document.getElementById('bookFormSubmit');
    submitButton.innerText = 'Masukkan Buku ke rak Belum selesai dibaca';
  
    bookForm.removeEventListener('submit', editBook);
    bookForm.removeAttribute('data-editing-bookid');
  }
  
  // Fungsi untuk memindahkan buku antar rak
  function moveBookToCompleted(bookId) {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex].isComplete = !books[bookIndex].isComplete;
      saveBooks(books);
    }
  }
  
  // Fungsi untuk menghapus buku
  function deleteBook(bookId) {
    const books = getBooks();
    const newBooks = books.filter((book) => book.id !== bookId);
    saveBooks(newBooks);
  }
  
  // Fungsi untuk menampilkan buku di rak
  function renderBooks(filteredBooks = null) {
    const incompleteBookshelf = document.getElementById('incompleteBookList');
    const completeBookshelf = document.getElementById('completeBookList');
  
    incompleteBookshelf.innerHTML = '';
    completeBookshelf.innerHTML = '';
  
    const books = filteredBooks || getBooks();
    for (const book of books) {
      const bookItem = createBookItem(book);
  
      if (book.isComplete) {
        completeBookshelf.append(bookItem);
      } else {
        incompleteBookshelf.append(bookItem);
      }
    }
  }
  
  // Fungsi untuk mencari buku
  function searchBooks(title) {
    const books = getBooks();
    return books.filter((book) => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  
  // Event listener untuk form tambah buku
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', (event) => {
    if (!bookForm.getAttribute('data-editing-bookid')) {
      event.preventDefault();
  
      const id = new Date().getTime();
      const title = document.getElementById('bookFormTitle').value;
      const author = document.getElementById('bookFormAuthor').value;
      const year = parseInt(document.getElementById('bookFormYear').value);
      const isComplete = document.getElementById('bookFormIsComplete').checked;
  
      const newBook = createBook(id, title, author, year, isComplete);
  
      const books = getBooks();
      books.push(newBook);
      saveBooks(books);
  
      bookForm.reset();
      renderBooks();
    }
  });
  
  // Event listener untuk form cari buku
  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
  
    const searchTitle = document.getElementById('searchBookTitle').value;
    const filteredBooks = searchBooks(searchTitle);
  
    renderBooks(filteredBooks); 
  });
  
  // Menampilkan buku saat halaman dimuat
  document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
  
    // Kode untuk mengubah teks tombol submit
    const isCompleteCheckbox = document.getElementById('bookFormIsComplete');
    const submitButton = document.getElementById('bookFormSubmit');
  
    isCompleteCheckbox.addEventListener('change', () => {
      if (isCompleteCheckbox.checked) {
        submitButton.innerText = 'Masukkan Buku ke rak Selesai dibaca';
      } else {
        submitButton.innerText = 'Masukkan Buku ke rak Belum selesai dibaca';
      }
    });
  });