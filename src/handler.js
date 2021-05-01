const { nanoid } = require('nanoid');
const books = require('./books');

const postBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  res.code(500);
  return res;
};

const fetchAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  var newBooks = books;

  if (reading) {
    const isReading = reading == 1 ? true : false;
    newBooks = newBooks.filter((book) =>
      isReading ? book.reading === true : book.reading === false
    );
  }

  if (finished) {
    const isFinished = finished == 1 ? true : false;
    newBooks = newBooks.filter((book) =>
      isFinished ? book.finished === true : book.finished === false
    );
  }

  if (name) {
    newBooks = newBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  newBooks = newBooks.map((books) => ({
    id: books.id,
    name: books.name,
    publisher: books.publisher,
  }));

  return {
    status: 'success',
    data: {
      books: newBooks,
    },
  };
};

const getDetailBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((book) => book.id === bookId);

  if (!book) {
    const res = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    res.code(404);
    return res;
  }
  const res = h.response({
    status: 'success',
    data: {
      book: book,
    },
  });
  return res;
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  postBookHandler,
  fetchAllBooksHandler,
  getDetailBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
