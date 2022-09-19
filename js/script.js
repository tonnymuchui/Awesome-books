const btn = document.querySelector("#btn");
const myBooks = document.querySelector("#myBooks");
const form = document.querySelector("form");
const storage = window.localStorage;

function bookObject(title,author){
    const books = {
        title: title.value,
        author: author.value,
    };

    return books;
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        const { code, name } = e;
        return (
            e instanceof DOMException
            && (code === 22
                || code === 1014
                || name === 'QuotaExceededError'
                || name === 'NS_ERROR_DOM_QUOTA_REACHED')
            && storage.length !== 0
        );
    }
}

function getBooks(){
    let book;
    if (storageAvailable('localStorage')) {

        if(localStorage.getItem('booksData') == null){
            book = [];
        }
        else{
            book = JSON.parse(localStorage.getItem('booksData'));
        }
        
    }  
    return book;
}

function addBooks(book){
    const booksList =  getBooks();
    booksList.push(book);
    localStorage.setItem('booksData', JSON.stringify(booksList));
}

const createBookElement = (book) => {
    const bookData = getBooks();

    bookData.forEach((book) => {
        const bookContainer = document.createElement('div');
        bookContainer.className = 'books';
        bookContainer.innerHTML = `<h2 id="title-name">${book.title}</h2><p id="author-name">${book.author}</p> <button class="remove-btn">Remove</button>`;
        myBooks.appendChild(bookContainer);
    })
}

createBookElement();
btn.addEventListener('click', (event) => {
    event.preventDefault();
    var title = document.querySelector("#title");
    var author = document.querySelector("#author");

    const bookCard = bookObject(title,author);

    addBooks(bookCard);

    const bookContainer = document.createElement('div');
    bookContainer.className = 'books';
    bookContainer.innerHTML = `<h2 id="title-name">${bookCard.title}</h2><p id="author-name">${bookCard.author}</p> <button class="remove-btn">Remove</button>`;
    myBooks.appendChild(bookContainer);

    form.reset();

});

const removeBtn = document.querySelector("#myBooks");

removeBtn.addEventListener('click',(event) => {
    event.target.parentElement.remove();
    var title = event.target.parentElement.firstElementChild.textContent;
    const books = getBooks();
    let filtered;
    filtered = books.filter((book) => book.title !== title);
    localStorage.setItem('booksData', JSON.stringify(filtered));
});