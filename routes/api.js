/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({})
           .select({'_id':1, 'title':1, 'comments':1, 'commentcount':1}) // seem to need 'comments' for virtual 'commentcount'
           .exec(function(err, allBooks){
               if (err) {return next(err); }
              
               // Delete the comments.
               let bookDisplay = allBooks.map( (bookObj) => {
                   return {'_id': bookObj._id, 'title': bookObj.title, 'commentcount': bookObj.commentcount}; 
               });
	       res.send(bookDisplay);
           });
    })
    
    /* POST a book title to /api/books  */
    .post(function (req, res, next){
      
      // Create a book object with the new title.
      var book = new Book(
          { title: req.body.title}
      );

      // Search to see if book already exists...
      Book.findOne({'title': req.body.title})
          .exec(function (err, foundBook){ 
              if (err) {return next(err); }

              // If the book exists, let the user know.
              if (foundBook){
                  res.send('title already exists');
              } else {
                  // The book doesn't exist, so save it.
                  book.save(function(err) {
                      if (err) {return next(err);}
                      
                      // Give the json response.
                      res.json({'title': book.title, 'comments': book.comments, '_id': book._id});
                  });              

              }
          }); 
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
