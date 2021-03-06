/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);


suite('Functional Tests', function() {


   // Declare variable for tests.
    var testDummy;
    

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      /* This tests populating the library with a book. The book id here is used in other tests. */
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({title: 'No One Will Read This Book'})
            .end(function(err, res){
                testDummy = res.body._id;       // Needs to be deleted in 2nd to last test.
                assert.equal(res.status, 200);
                assert.equal(res.body.title, 'No One Will Read This Book');
                done();
            });
      });

      /* This tests populating the library with another book that will be deleted later. */
      test('Test POST /api/books with title 2', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({title: 'No One Will Read This Book 2'})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.title, 'No One Will Read This Book 2');
                done();
            });
      });


      /* This tests populating the library with yet another book that will be deleted later. */
      test('Test POST /api/books with title 3', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({title: 'No One Will Read This Book 3'})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.title, 'No One Will Read This Book 3');
                done();
            });
      });
	
      /* This tests posting a book with no title given. */
      test('Test POST /api/books with no title given', function(done) {
          chai.request(server)
              .post('/api/books')
              .send({title: ''})
              .end(function(err,res){
                  assert.equal(res.status, 200);
                  assert.equal(res.text, 'missing title');
                  done();
              });
      });
      
    });


    suite('GET /api/books => array of books', function(){

      /* This tests getting a list of books in the library. */
      test('Test GET /api/books',  function(done){
          chai.request(server)
              .get('/api/books')
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.isArray(res.body, 'needs to be an array');
                  assert.isObject(res.body[0], 'needs to be an object');
                  assert.property(res.body[0], '_id', 'object needs an _id');
                  assert.property(res.body[0], 'title', 'object needs a title');
                  assert.property(res.body[0], 'commentcount', 'object needs a commentcount');
                  assert.isString(res.body[0]._id, '_id value must be string');
                  assert.isString(res.body[0].title, 'title value must be string');
                  assert.isNumber(res.body[0].commentcount, 'commentcount value must be number');
                  done();
              });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      /* This tests getting an invalid book id. */
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
              .get('/api/books/7f666897a3a0719ad5da38ff')
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.strictEqual(res.text, 'no book exists');
                  done();
              });
      });

      /* This tests getting a book by a valid id that exists in the database. */
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
              .get('/api/books/' + testDummy)
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.isObject(res.body);
                  done();
              });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

     /* This tests posting a comment for a valid id. */
      test('Test POST /api/books/[id] with comment', function(done){
          chai.request(server)
	      .post('/api/books/' + testDummy)
              .send({comment: 'what an amazing book'})	  
	      .end(function(err, res){
		  assert.equal(res.status, 200);
		  assert.isObject(res.body);
		  assert.strictEqual(res.body._id, testDummy);
		  assert.strictEqual(res.body.title, 'No One Will Read This Book');
		  assert.isArray(res.body.comments);
		  assert.strictEqual(res.body.comments[0], 'what an amazing book');
		  done();
	      });
      });
      
    }); 



    suite('POST /api/books/[id] => add blank comment for book id/expect missing comment', function(){

      /* This tests posting a blank comment (i.e. no comment) for a valid book id. */
      test('Test POST /api/books/[id] without comment', function(done){
          chai.request(server)
	      .post('/api/books/' + testDummy)
              .send({comment: ''})	  
	      .end(function(err, res){
		  assert.equal(res.status, 200);
                  assert.strictEqual(res.text, 'missing comment');
		  done();
	      });
      });
      
    });




      
      /* This tests deleting a book by its id. */
      suite('DELETE /api/books/[id] => delete a book by id', function(){
      
            test('Test DELETE /api/books/[id]', function(done){
                chai.request(server)
	            .delete('/api/books/' + testDummy)
	            .end(function(err, res){
                        assert.equal(res.status, 200)
                        assert.strictEqual(res.text, 'delete successful');
                        done();
                    });
      });
      
      }); 

      /* This tests deleting all the books in the library. */
      suite('DELETE /api/books/ => delete all books', function(){
              
            test('Test DELETE /api/books/[id]', function(done){
                chai.request(server)
	            .delete('/api/books/')
	            .end(function(err, res){
                        assert.equal(res.status, 200)
                        assert.strictEqual(res.text, 'complete delete successful');
                        done();
                    });
      });
      
      });

      


  });







    
    suite('Security tests', function() {
	
        suite('GET headers', function() {
      
          /* This tests that the x-powered-by header does not reveal we are using Express. */
          test('GET x-powered-by header key/ expect PHP 4.2.0', function(done) {
            chai.request(server)
                .get('/')
                .end(function(err, res){
                    assert.equal(res.status, 200);
		    assert.strictEqual(res.headers['x-powered-by'], 'PHP 4.2.0');
                    done();
                });
          });

        
          /* This tests that the website is not caching information from the client. 
              For the 4 assertions used here, see https://www.npmjs.com/package/nocache. */
          test('GET caching header keys/ expect no caching', function(done) {
            chai.request(server)
                .get('/')
                .end(function(err, res){
                    assert.equal(res.status, 200);
		    assert.equal(res.headers['cache-control'], 'no-store, no-cache, must-revalidate, proxy-revalidate');
		    assert.equal(res.headers.pragma, 'no-cache');
		    assert.equal(res.headers.expires, '0');
		    assert.equal(res.headers['surrogate-control'], 'no-store');
                    done();
                });
          });


	    
	});

    });
    
});
