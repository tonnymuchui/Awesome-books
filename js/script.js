/* eslint-disable max-classes-per-file */
const btn = document.querySelector('#btn');
const myBooks = document.querySelector('.myBooks');
const form = document.querySelector('form');

class BookObject {
  constructor(title, author) {
    this.title = title.value;
    this.author = author.value;
  }
}

class ClassLocalStorage {
  static storageAvailable(type) {
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

  static getBooks() {
    let book;
    if (this.storageAvailable('localStorage')) {
      if (localStorage.getItem('booksData') == null) {
        book = [];
      } else {
        book = JSON.parse(localStorage.getItem('booksData'));
      }
    }
    return book;
  }

  static addBooks(book) {
    const booksList = this.getBooks();
    booksList.push(book);
    localStorage.setItem('booksData', JSON.stringify(booksList));
  }
}

const createBookElement = () => {
  const bookData = ClassLocalStorage.getBooks();
  bookData.forEach((book) => {
    const bookContainer = document.createElement('div');
    bookContainer.className = 'books';
    bookContainer.innerHTML = `<h2 id="title-name">${book.title}</h2><p id="author-name">${book.author}</p> <button class="remove-btn">Remove</button>`;
    myBooks.appendChild(bookContainer);
  });
};

createBookElement();
btn.addEventListener('click', (event) => {
  event.preventDefault();
  const title = document.querySelector('#title');
  const author = document.querySelector('#author');
  let status = true;
  const bookCard = new BookObject(title, author);
  const booksList = ClassLocalStorage.getBooks();
  for (let i = 0; i < booksList.length; i += 1) {
    if (title.value === booksList[i].title && author.value === booksList[i].author) {
      status = false;
      alert('Book already exists please add a new one');
    }
  }
  if (status) {
    ClassLocalStorage.addBooks(bookCard);
    const bookContainer = document.createElement('div');
    bookContainer.className = 'books';
    bookContainer.innerHTML = `<h2 id="title-name">${bookCard.title}</h2><p id="author-name">${bookCard.author}</p> <button class="remove-btn">Remove</button>`;
    myBooks.appendChild(bookContainer);
  }
  form.reset();
});

const removeBtn = document.querySelector('.myBooks');
removeBtn.addEventListener('click', (event) => {
  event.target.parentElement.className = 'delete';
  const title = event.target.parentElement.firstElementChild.textContent;
  event.target.parentElement.remove();
  const author = event.target.parentElement.firstElementChild.nextElementSibling.textContent;
  const books = ClassLocalStorage.getBooks();
  const filtered = books.filter((book) => book.title !== title || book.author !== author);
  localStorage.setItem('booksData', JSON.stringify(filtered));
});

// Adding Navigation
const navLinksContainer = document.querySelector('.nav-links');
const navListContent = document.querySelectorAll('.nav-list-content');

navLinksContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.nav-link');
  if (!clicked) return;
  clicked.classList.add('nav-link-active');

  navListContent.forEach((c) => c.classList.remove('nav-list-content-active'));

  document.querySelector(`.nav-list-content-${clicked.dataset.link}`).classList.add('nav-list-content-active');
});