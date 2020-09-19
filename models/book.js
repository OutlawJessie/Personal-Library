var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Book schema has a title and an array of strings for comments.
var BookSchema = new Schema({
    title: {type: String, required: true},
    comments: [String] 
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// Book schema has a virtual for the number of comments.
BookSchema.virtual('commentcount').get(function(){
    return this.comments.length;
});


// Export model as Book.
module.exports = mongoose.model('Book', BookSchema);


