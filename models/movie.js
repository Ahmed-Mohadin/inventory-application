var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  genre: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Genre',
    },
  ],
});

// Virtual for this movie instance URL.
MovieSchema.virtual('url').get(function () {
  return '/catalog/movie/' + this._id;
});

// Export model.
module.exports = mongoose.model('Movie', MovieSchema);
