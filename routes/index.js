var express = require('express');
var router = express.Router();
var BookModel = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  fetchBooks();

});

fetchBooks = async () => {
  
  try {
    // ... All model instances

    const Books = await BookModel.findAll();
    console.log( Books.map(Books => Books.toJSON()) );

  } catch(error) {
    console.log(error);
  }
}

module.exports = router;
