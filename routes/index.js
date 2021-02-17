var express = require('express');
var router = express.Router();
var BookModel = require('../models').Book;

//import the function library
var library = require('../FunctionLibrary.js');
//some functions are wrapped up into a library class for organization
var FuncLib = new library();
//local stored books object
var StoredBooks = null;


/* GET home page. 
    redirect to books.
*/
router.get('/', (req, res, next) => {
    res.redirect('/books');
});


/* GET generated error route - create and throw 500 server error */
router.get('/error', (req, res, next) => {

    // Log out custom error handler indication
    console.log('Custom error route called');

    const err = new Error();
    err.message = `Custom 500 error thrown`
    err.status = 500;
    throw err;
});

/* GET books page. 
    load and store the database in the StoredBooks object and show listing.
*/
router.get('/books', FuncLib.asyncHandler(

    async(req, res) => {
        let result = await FuncLib.fetchBooks();

        if (result.success) {
            StoredBooks = result.bookData;
            res.render("index", { books: StoredBooks });
        }
    }
));

router.get('/books/new', (req, res, next) => {

    res.render('new-book');
});

/* POST added new book. 
    Uses function library to handle async callbacks.
*/
router.post('/books', FuncLib.asyncHandler(
    async(req, res) => {

        const result = await FuncLib.addBook(req.body);

        if (result.success) {
            res.redirect("/books");
        } else {
            res.render("formerror", { formData: result.data, errors: result.errors })
        }

    }
));

/* GET book id for a book details page. 
    Check for the id param passed down from the url and see if that book exists, if so, pass the data to the details page.
*/
router.get('/books/:id', FuncLib.asyncHandler(
    async(req, res, next) => {

        const book = await BookModel.findByPk(req.params.id);
        if (book != null) {
            res.render("update-book", { book });
        } else {
            const error = FuncLib.createErrorMessage(404, "Ooops! Something went wrong! The book id was not found!");
            next(error);
        }
    }
));

/* POST modify an existing book id. 
    Check for the id param passed down from the url and see if that book exists, if so, try to modify that database entry.
*/
router.post("/books/:id/edit", FuncLib.asyncHandler(async(req, res, next) => {

    const book = await BookModel.findByPk(req.params.id);
    if (book !== null) {
        try {
            result = await FuncLib.modifyBook(req.body, book);

            if (result.success) {
                res.redirect('/books');
            }
        } catch (error) {
            const err = FuncLib.createErrorMessage(500, error.message);
            next(err);
        }
    } else {
        const error = FuncLib.createErrorMessage(404, "Ooops! Something went wrong! The book id was not found!");
        next(error);
    }

}));

/* POST delete an existing book id. 
    Check for the id param passed down from the url and see if that book exists, if so, try to delete that database entry.
*/
router.post('/books/:id/delete', FuncLib.asyncHandler(
    async(req, res, next) => {

        const book = await BookModel.findByPk(req.params.id);
        if (book !== null) {
            try {
                BookModel.destroy({
                    where: {
                        id: book.id
                    }
                });
                res.redirect('/books');
            } catch (error) {
                const err = FuncLib.createErrorMessage(500, "Ooops! Something went wrong!");
                next(err);
            }
        } else {
            const error = FuncLib.createErrorMessage(404, "Ooops! Something went wrong! The book id was not found!");
            next(error);
        }
    }
));

module.exports = router;