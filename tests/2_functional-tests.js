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
    
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({title: 'No One Will Read This Book'})
            .end(function(err, res){
                testDummy = res.body._id;       // Needs to be deleted in final test.
                assert.equal(res.status, 200);
                assert.equal(res.body.title, 'No One Will Read This Book');
                done();
            });
      });
      
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
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
              .get('/api/books/7f666897a3a0719ad5da38ff')
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.strictEqual(res.text, 'no book exists');
                  done();
              });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
              .get('/api/books/5f666897a3a0714ad5da38ff')
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.isObject(res.body);
                  done();
              });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
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



    suite('POST /api/books/ => add blank comment for book id/expect missing comment', function(){
      
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



  });

});
