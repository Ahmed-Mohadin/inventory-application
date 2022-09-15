const Movie = require('../models/movie');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all movies.
exports.movie_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie list');
};

// Display detail page for a specific movie.
exports.movie_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Movie detail: ${req.params.id}`);
};

// Display movie create form on GET.
exports.movie_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie create GET');
};

// Handle movie create on POST.
exports.movie_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie create POST');
};

// Display movie delete form on GET.
exports.movie_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie delete GET');
};

// Handle movie delete on POST.
exports.movie_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie delete POST');
};

// Display movie update form on GET.
exports.movie_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie update GET');
};

// Handle movie update on POST.
exports.movie_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie update POST');
};
