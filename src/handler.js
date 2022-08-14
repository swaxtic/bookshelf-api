const { nanoid } = require('nanoid');
let books = require('./books');
const bookValidation = require('./book-validation');
let bookModel = require('./models/request/book-model');
let editBookModel = require('./models/request/edit-book-model')

const addBookHandler = async (request, h) => {
  bookModel = request.payload;
  const id = nanoid(16);
  bookModel.id = id;
  bookModel.insertedAt = new Date().toISOString();
  bookModel.updatedAt = bookModel.insertedAt;
  let response;
  let validationResult = await bookValidation.doValidateBook(bookModel);
  if(!validationResult.result) {
    response = h.response({
      status: 'fail',
      message: validationResult.valDesc
    })
    response.code(validationResult.responseCode);
    return response;
  }
  bookModel.finished = bookValidation.checkIsFinished(bookModel);
  books.push(bookModel);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if(!isSuccess) {
    response = h.response({
      status: 'error',
      message: "Buku gagal ditambahkan"
    })
    response.code(500);
    return response;
  }
  response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const params = request.query;
  let bookRes = books;
  console.log(params);
  if (params != null) {
    if(params.finished == 1) {
      bookRes = books.filter(book => book.finished);
    } else if (params.finished == 0) {
      bookRes = books.filter(book => !book.finished);
    } else if (params.reading == 1) {
      bookRes = books.filter(book => book.reading);
    } else if (params.reading == 0) {
      bookRes = books.filter(book => !book.reading);
    } else if (params.name != null) {
      let textSearch = params.name;
      bookRes = books.filter(book => book.name.toLowerCase().indexOf(textSearch.toLowerCase()) >= 0);
    }
  }
  const response = h.response({
    status: 'success',
    data: {
      books: bookRes.map(x => {
        return {
          id: x.id,
          name: x.name,
          publisher: x.publisher
        }
      }),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((data) => data.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = async (request, h) => {
  const { id } = request.params;
  editBookModel = request.payload;
  editBookModel.updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  let response;

  if (index !== -1) {
    let validationResult = await bookValidation.doValidateEditBook(editBookModel);
    if(!validationResult.result) {
      response = h.response({
        status: 'fail',
        message: validationResult.valDesc
      })
      response.code(validationResult.responseCode);
      return response;
    }
    books[index] = {
      ...books[index],
      ...editBookModel
    };
    response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  let response;
  if (index !== -1) {
    books.splice(index, 1);
    response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};