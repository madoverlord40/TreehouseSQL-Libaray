var express = require('express');
var router = express.Router();
var BookModel = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {

    fetchBooks();

    //res.render('index', { title: 'Express' });
    res.redirect('/Books');
});

router.get('/Books', asyncHandler(async(req, res) => {
    const books = await BookModel.findAll();

    res.render("index", { books });
}));

router.get('/Books/new', (req, res, next) => {

    res.render('new');
});

router.post('/Books', asyncHandler(async(req, res) => {
    const result = await addModifyBook(req.body);

    if (result.success) {
        res.redirect("/Books");
    } else {
        res.render("formerror", { newBook: result.data, errors: result.errors })
    }
}));

router.get('/Books/:id', asyncHandler(async(req, res, next) => {
    const book = await BookModel.findByPk(req.params.id);
    if (book) {
        res.render("details", { book });
    } else {
        res.sendStatus(404);
    }
}));

router.post("/Books/:id/edit", asyncHandler(async(req, res, next) => {
    const book = await BookModel.findByPk(req.params.id);
    if (book) {
        result = await addModifyBook(req.body, book);

        if (result.success) {
            res.redirect("/Books");
        }
    } else {
        res.sendStatus(404);
    }
}));

router.post('/Books/:id/delete', asyncHandler(async(req, res, next) => {
    try {
        const book = await BookModel.findByPk(req.params.id);
        if (book) {
            BookModel.destroy({
                where: {
                    id: book.id
                }
            });
            res.redirect("/Books");

        } else {
            res.sendStatus(404);
        }

    } catch (error) {

    }
}));

fetchBooks = async() => {

    try {
        // ... All model instances

        const Books = await BookModel.findAll();
        console.log(Books.map(Books => Books.toJSON()));

    } catch (error) {
        console.error(error);
    }
}

addModifyBook = async(formData, bookObject = null) => {
    let bookData = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        year: formData.year
    };

    try {
        if (bookObject !== null) {
            newBook = await bookObject.update(bookData, {
                where: { id: bookObject.id }
            });
            return { data: newBook, errors: [], success: true };
        } else {
            newBook = await BookModel.create(bookData);
            return { data: newBook, errors: [], success: true };
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            newBook = await BookModel.build(data);
            return { data: newBook, errors: error.errors, success: false };
        } else {
            throw error;
        }
    }
}

module.exports = router;