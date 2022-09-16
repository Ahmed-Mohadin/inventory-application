const async = require('async');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/movie');
const Genre = require('../models/genre');

exports.index = (req, res) => {
  async.parallel(
    {
      movie_count(callback) {
        // Pass an empty object as match condition to find all documents of this collection
        Movie.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Inventory Application',
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all movies.
exports.movie_list = (req, res, next) => {
  Movie.find({}, '')
    .sort({ title: 1 })
    .populate('title')
    .exec(function (err, movie_lists) {
      if (err) return next(err);
      //Successful, so render
      res.render('movie/movie_list', {
        title: 'Movie List',
        movie_list: movie_lists,
      });
    });
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
