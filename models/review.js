var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  }, // Reference to the associated movie.
  text: {
    type: String,
    required: true,
  },
});

// Virtual for this review object's URL.
ReviewSchema.virtual('url').get(function () {
  return '/catalog/review/' + this._id;
});

// Export model.
module.exports = mongoose.model('Review', ReviewSchema);
