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
    This is the only route that loads the database. If we come here first, load the database and redirect to books.
*/
router.get('/', FuncLib.asyncHandler(
    async(req, res) => {
        let result = await FuncLib.fetchBooks();

        if (result.success) {
            StoredBooks = result.bookData;
            res.redirect('/Books');
        }
    }
));

/* GET books page. 
    We assume the database has been loaded an stored in the StoredBooks object.
*/
router.get('/Books', (req, res, next) => {
    //just incase the database is not loaded, handle it.
    if (StoredBooks === null) {
        res.render('error', { message: "Ooops! Something went wrong! The Database has not been loaded, please click home below!", status: '' });
    } else {
        res.render("index", { books: StoredBooks });
    }
});

router.get('/Books/new', (req, res, next) => {

    res.render('new');
});

/* POST added new book. 
    Uses function library to handle async callbacks.
*/
router.post('/Books', FuncLib.asyncHandler(
    async(req, res) => {
        try {
            const result = await FuncLib.addBook(req.body);

            if (result.success) {
                res.redirect("/");
            } else {
                res.render("formerror", { newBook: result.data, status: result.errors.status })
            }
        } catch (error) {
            res.render('error', { message: "Ooops! Something went wrong!", status: error.status });
        }
    }
));

/* GET book id for a book details page. 
    Check for the id param passed down from the url and see if that book exists, if so, pass the data to the details page.
*/
router.get('/Books/:id', FuncLib.asyncHandler(
    async(req, res, next) => {

        const book = await BookModel.findByPk(req.params.id);
        if (book != null) {
            res.render("details", { book });
        } else {
            res.render('error', { message: "Ooops! Something went wrong! The book id was not found!", status: '' });
        }
    }
));

/* POST modify an existing book id. 
    Check for the id param passed down from the url and see if that book exists, if so, try to modify that database entry.
*/
router.post("/Books/:id/edit", FuncLib.asyncHandler(async(req, res, next) => {

    const book = await BookModel.findByPk(req.params.id);
    if (book !== null) {
        result = await FuncLib.modifyBook(req.body, book);

        if (result.success) {
            res.redirect("/");
        }
    } else {
        res.render('error', { message: "Ooops! Something went wrong! The book id was not found!", status: '' });
    }

}));

/* POST delete an existing book id. 
    Check for the id param passed down from the url and see if that book exists, if so, try to delete that database entry.
*/
router.post('/Books/:id/delete', FuncLib.asyncHandler(
    async(req, res, next) => {

        const book = await BookModel.findByPk(req.params.id);
        if (book !== null) {
            try {
                BookModel.destroy({
                    where: {
                        id: book.id
                    }
                });
                res.redirect("/");
            } catch (error) {
                res.render('error', { message: "Ooops! Something went wrong!", status: error.status });
            }
        } else {
            res.render('error', { message: "Ooops! Something went wrong! The book id was not found!", status: '' });
        }


    }
));

module.exports = router;