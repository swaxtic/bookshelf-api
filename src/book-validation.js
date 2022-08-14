let bookRequest = require('./models/request/book-model');
const validationResponse = require('./models/response/validation-response');

const doValidateBook = async (request) => {
  bookRequest = request;
  let validationResult =  validationResponse;
  validationResult.result = true;
  if(bookRequest.name == null || bookRequest.name === "") {
    validationResult.responseCode = 400;
    validationResult.valDesc = "Gagal menambahkan buku. Mohon isi nama buku";
    validationResult.result = false;
    return validationResult;
  }
  if(bookRequest.readPage > bookRequest.pageCount) {
    validationResult.responseCode = 400;
    validationResult.valDesc = "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
    validationResult.result = false;
    return validationResult;
  }
  return validationResult;
};

const doValidateEditBook = async (request) => {
  bookRequest = request;
  let validationResult =  validationResponse;
  validationResult.result = true;
  if(bookRequest.name == null || bookRequest.name === "") {
    validationResult.responseCode = 400;
    validationResult.valDesc = "Gagal memperbarui buku. Mohon isi nama buku";
    validationResult.result = false;
    return validationResult;
  }
  if(bookRequest.readPage > bookRequest.pageCount) {
    validationResult.responseCode = 400;
    validationResult.valDesc = "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
    validationResult.result = false;
    return validationResult;
  }
  return validationResult;
};

const checkIsFinished = (request) => {
  bookRequest = request;
  return (bookRequest.pageCount === bookRequest.readPage)
}

module.exports = {
  doValidateBook,
  doValidateEditBook,
  checkIsFinished
};