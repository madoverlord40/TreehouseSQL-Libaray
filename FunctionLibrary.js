var BookModel = require('./models').Book;

class FunctionLibrary {
    /* Handler function to wrap each Async call. */
    asyncHandler(cb) {
        return async(req, res, next) => {
            try {
                await cb(req, res, next);
            } catch (error) {
                // Forward error to the global error handler
                next(error);
            }
        }
    }

    //Async function to initially load the database
    async fetchBooks() {

        try {
            // ... All model instances
            let books = await BookModel.findAll();

            return { success: true, bookData: books, errors: [] };
        } catch (error) {
            //error page...
            return { success: false, bookData: [], errors: error.erros };
        }

        //should never get here but all controll paths should return a value
        return null;
    }

    //Async function that takes form sumbission data to create and add a new book into the database
    async addBook(formData) {

        if (formData !== null && typeof formData === 'object') {

            const bookData = {
                title: formData.title,
                author: formData.author,
                genre: formData.genre,
                year: formData.year
            };

            try {

                let newBook = await BookModel.create(bookData);
                return { data: newBook, errors: [], success: true };

            } catch (error) {
                if (error.name === "SequelizeValidationError") {
                    newBook = await BookModel.build(data);
                    return { data: newBook, errors: error.errors, success: false };
                } else {
                    throw error;
                }
            }
        }

        return { data: null, errors: null, success: false };
    }

    //Async function that takes form submission data along with the book object to modify in the database
    async modifyBook(formData, bookObject = null) {

        if ((formData !== null && typeof formData === 'object') &&
            (bookObject !== null && typeof bookObject === 'object')) {

            const bookData = {
                title: formData.title,
                author: formData.author,
                genre: formData.genre,
                year: formData.year
            };

            try {
                if (bookObject !== null) {
                    let newBook = await bookObject.update(bookData, {
                        where: { id: bookObject.id }
                    });
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
    }
}

module.exports = FunctionLibrary;