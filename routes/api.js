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

    /* GET an array of books from /api/books */
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
      // Check if user gave a title.
      if (!req.body.title){
          res.send('missing title');
      } else {
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
          }

    })
    
    /* DELETE all books at /api/books/ */
    .delete(function(req, res, next){
      Book.remove({}, function(err, removeStatus){
           if (err) { return next(err); }
           res.send('complete delete successful');
      });
    });


  /* GET a book by its id at /api/books/ */
  app.route('/api/books/:id')
    .get(function (req, res){
      Book.findById({_id: req.params.id}, function(err, book){
          if (err){ return next(err); }
          if (book) {
              res.json({'_id': book._id, 'title': book.title, 'comments': book.comments});
          } else {
              res.send('no book exists');
          }          
      });
    })
    
    /* POST a comment for a book id at /api/books */
    .post(function(req, res, next){

      // Check if user gave an id.
      if (!req.params.id){
          res.send('missing book id');
      } else {
          // Check if user gave a comment.
          if (!req.body.comment){
              res.send('missing comment');
          } else { // User gave an id and a comment....

              // Find the book by id, and initiate callback function.
              Book.findById({_id: req.params.id}, function(err, book){
                  if (err) {return next(err);}
                  // Check if a book was found.
                  if (!book){
                      res.send('no book exists'); // FCC repl example shows 'null' in their example.
                  } else {
                      // Push the comment to the book that was found.
                      book.comments.push(req.body.comment);

                      // Save the book, and deliver the json response.
                      book.save(function(err, savedBook){
                          if (err) {return next(err);}
                          res.json({'_id': savedBook._id, 'title': savedBook.title, 'comments': savedBook.comments});
                      });
                  }
              });
          }
      }
    })
    
    /* DELETE a book by its id at /api/books */
    .delete(function(req, res, next){

      // Check if book id exists...
      if (!req.params.id){
          res.json('no book exists');
      } else { // Book does exist, so find and delete.
          Book.findOneAndRemove({_id:req.params.id}, function(err, removedBook) {
              if (err) { return next(err); }
              res.send('delete successful');
          });
      }
    });
  
};
