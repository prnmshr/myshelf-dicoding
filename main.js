document.addEventListener('DOMContentLoaded', function () {

    // Fungsi untuk menyimpan data buku ke dalam localStorage
    function saveData() {
        localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
        localStorage.setItem('completeBooks', JSON.stringify(completeBooks));
    }

    // Fungsi untuk mendapatkan data buku dari localStorage
    function loadData() {
        incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
        completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];
    }

    // Fungsi untuk mengupdate tampilan rak buku
    function updateBookshelf() {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');

        // Kosongkan rak buku sebelum mengupdate tampilan
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        // Tambahkan buku ke rak yang sesuai
        for (const book of incompleteBooks) {
            const bookItem = createBookItem(book, true);
            incompleteBookshelfList.appendChild(bookItem);
        }

        for (const book of completeBooks) {
            const bookItem = createBookItem(book, false);
            completeBookshelfList.appendChild(bookItem);
        }
    }

    // Fungsi untuk membuat elemen buku
    function createBookItem(book, isIncomplete) {
        const bookItem = document.createElement('article');
        bookItem.classList.add('book_item');

        const h3 = document.createElement('h3');
        h3.innerText = book.title;

        const authorParagraph = document.createElement('p');
        authorParagraph.innerText = `Penulis: ${book.author}`;

        const yearParagraph = document.createElement('p');
        yearParagraph.innerText = `Tahun: ${book.year}`;

        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action');

        const actionButton = document.createElement('button');
        actionButton.classList.add(isIncomplete ? 'green' : 'red');
        actionButton.innerText = isIncomplete ? 'Selesai dibaca' : 'Belum selesai di Baca';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';

        actionButton.addEventListener('click', function () {
            toggleBookStatus(book);
        });

        deleteButton.addEventListener('click', function () {
            deleteBook(book);
        });

        actionDiv.appendChild(actionButton);
        actionDiv.appendChild(deleteButton);

        bookItem.appendChild(h3);
        bookItem.appendChild(authorParagraph);
        bookItem.appendChild(yearParagraph);
        bookItem.appendChild(actionDiv);

        return bookItem;
    }

    // Fungsi untuk menambahkan buku baru
    function addBook(title, author, year, isComplete) {
        const book = {
            id: Date.now(),
            title,
            author,
            year,
            isComplete,
        };

        if (isComplete) {
            completeBooks.push(book);
        } else {
            incompleteBooks.push(book);
        }

        saveData();
        updateBookshelf();
    }

    // Fungsi untuk menghapus buku
    function deleteBook(book) {
        if (book.isComplete) {
            completeBooks = completeBooks.filter((b) => b.id !== book.id);
        } else {
            incompleteBooks = incompleteBooks.filter((b) => b.id !== book.id);
        }

        saveData();
        updateBookshelf();
    }

    // Fungsi untuk mengubah status buku (selesai atau belum selesai dibaca)
    function toggleBookStatus(book) {
        if (book.isComplete) {
            book.isComplete = false;
            incompleteBooks.push(book);
            completeBooks = completeBooks.filter((b) => b.id !== book.id);
        } else {
            book.isComplete = true;
            completeBooks.push(book);
            incompleteBooks = incompleteBooks.filter((b) => b.id !== book.id);
        }

        saveData();
        updateBookshelf();
    }

    // Event listener untuk form tambah buku
    const inputBookForm = document.getElementById('inputBook');
    inputBookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        if (title && author && year) {
            addBook(title, author, year, isComplete);
            inputBookForm.reset();
        }
    });

    // Memfungsikan form pencarian buku (opsional)
    // Event listener untuk form cari buku
    const searchBookForm = document.getElementById('searchBook');
    searchBookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchText = document.getElementById('searchBookTitle').value.toLowerCase();

        // Memanggil fungsi untuk melakukan pencarian berdasarkan judul
        searchBooksByTitle(searchText);
    });

    // Fungsi untuk melakukan pencarian buku berdasarkan judul
    function searchBooksByTitle(query) {
        const matchingBooks = [];

        // Cari buku yang sesuai dengan query dalam rak yang belum selesai dibaca
        for (const book of incompleteBooks) {
            if (book.title.toLowerCase().includes(query)) {
                matchingBooks.push(book);
            }
        }

        // Cari buku yang sesuai dengan query dalam rak yang selesai dibaca
        for (const book of completeBooks) {
            if (book.title.toLowerCase().includes(query)) {
                matchingBooks.push(book);
            }
        }

        // Tampilkan hasil pencarian
        displaySearchResults(matchingBooks);
    }

    // Fungsi untuk menampilkan hasil pencarian
    function displaySearchResults(results) {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');

        // Mengosongkan konten dari rak buku sebelum mengupdate tampilan
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        if (results.length === 0) {
            // Jika tidak ada hasil pencarian, tampilkan rak buku kosong
            const emptyMessage = document.createElement('p');
            emptyMessage.innerText = 'Tidak ada hasil pencarian.';
            incompleteBookshelfList.appendChild(emptyMessage);
            completeBookshelfList.appendChild(emptyMessage);
        } else {
            // Jika ada hasil pencarian, lakukan loop melalui hasil pencarian dan tambahkan ke rak yang sesuai
            for (const book of results) {
                const bookItem = createBookItem(book, !book.isComplete);
                if (book.isComplete) {
                    completeBookshelfList.appendChild(bookItem);
                } else {
                    incompleteBookshelfList.appendChild(bookItem);
                }
            }
        }
    }

    // Variabel untuk menyimpan data buku
    let incompleteBooks = [];
    let completeBooks = [];

    // Load data dari localStorage dan tampilkan rak buku saat halaman dimuat
    loadData();
    updateBookshelf();


});
