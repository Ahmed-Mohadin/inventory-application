const async = require('async');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/movie');
const Genre = require('../models/genre');
const mongoose = require('mongoose');

// Display list of all Genre.
exports.genre_list = function (req, res) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) {
        return next(err);
      }
      res.render('genre/genre_list', {
        title: 'Genre List',
        genre_list: list_genres,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_movies(callback) {
        Movie.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render('genre/genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_movies: results.genre_movies,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render('genre/genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre/genre_form', {
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_movies: function (callback) {
        Movie.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        res.redirect('/catalog/genres');
      }
      // Successful, so render.
      res.render('genre/genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genre_movies: results.genre_movies,
      });
    }
  );
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_movies: function (callback) {
        Movie.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.genre_movies.length > 0) {
        // Genre has books. Render in same way as for GET route.
        res.render('genre/genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genre_movies: results.genre_movies,
        });
        return;
      } else {
        // Genre has no movies. Delete object and redirect to the landing page
        Genre.findByIdAndRemove(req.params.id, function deleteGenre(err) {
          if (err) {
            return next(err);
          }
          // Success - go to genre list
          res.redirect('/catalog/genres');
        });
      }
    }
  );
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render('genre/genre_form', {
        title: 'Update Genre',
        genre: results.genre,
      });
    }
  );
};

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validation and Sanitization
  body('name', 'Genre must not be empty.').trim().isLength({ min: 1 }).escape(),
  // Process post validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    var genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          genre: function (callback) {
            Genre.findById(req.params.id).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          res.render('genre/genre_form', {
            title: 'Update Genre',
            genre: results.genre,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid
      // Check if Genre with same name already exists
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) {
          return next(err);
        }
        if (found_genre) {
          // Genre exists, redirect to its detail page
          res.redirect(found_genre.url);
        } else {
          Genre.findByIdAndUpdate(
            req.params.id,
            genre,
            {},
            function (err, thegenre) {
              if (err) return next(err);
              res.redirect(thegenre.url);
            }
          );
        }
      });
    }
  },
];
