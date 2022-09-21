const async = require('async');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/movie');
const Genre = require('../models/genre');
const path = require('path');
var fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
  limits: { fileSize: 1000000 },
});

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
exports.movie_detail = (req, res, next) => {
  async.parallel(
    {
      movie(callback) {
        Movie.findById(req.params.id)
          .populate('title')
          .populate('genre')
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.movie == null) {
        // No results.
        const err = new Error('Movie not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('movie/movie_detail', {
        title: results.movie.title,
        movie: results.movie,
      });
    }
  );
};

// Display movie create form on GET.
exports.movie_create_get = (req, res, next) => {
  // Get all genres, which we can use for adding to our movie.
  async.parallel(
    {
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('movie/movie_form', {
        title: 'Create Movie',
        genres: results.genres,
      });
    }
  );
};

// Handle movie create on POST.
exports.movie_create_post = [
  upload.single('imageUrl'),
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('director', 'Director must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('releaseDate', 'Release date must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Movie object with escaped and trimmed data.
    const movie = new Movie({
      title: req.body.title,
      director: req.body.director,
      releaseDate: req.body.releaseDate,
      imageUrl: req.file.filename,
      summary: req.body.summary,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all genres for form.
      async.parallel(
        {
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (movie.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }

          res.render('movie/movie_form', {
            title: 'Create Movie',
            movieTitle: results.title,
            director: results.director,
            releaseDate: results.releaseDate,
            imageUrl: req.file.filename,
            genres: results.genres,
            movie,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    // Data from form is valid. Save movie.
    movie.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new movie record.
      res.redirect(movie.url);
    });
  },
];

// Display movie delete form on GET.
exports.movie_delete_get = function (req, res, next) {
  async.parallel(
    {
      movie: function (callback) {
        Movie.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.movie == null) {
        // No results.
        res.redirect('/catalog/movies');
      }
      // Successful, so render.
      res.render('movie/movie_delete', {
        title: 'Delete movie',
        movie: results.movie,
      });
    }
  );
};

// Handle movie delete on POST.
exports.movie_delete_post = function (req, res, next) {
  async.parallel(
    {
      movie: function (callback) {
        Movie.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      else {
        // Movie has no movie genres. Delete object and redirect to the list of movies.
        Movie.findByIdAndRemove(req.params.id, function deleteMovie(err) {
          if (err) {
            return next(err);
          }
          // Delete stored image from server
          fs.unlink(
            path.join(
              __dirname,
              '..',
              'public',
              'images',
              results.movie.imageUrl
            ),
            (err) => {
              if (err) {
                return next(err);
              }
            }
          );
          // Success - go to movie list
          res.redirect('/catalog/movies');
        });
      }
    }
  );
};

// Display movie update form on GET.
exports.movie_update_get = (req, res, next) => {
  // Get movie, and genres for form.
  async.parallel(
    {
      movie(callback) {
        Movie.findById(req.params.id)
          .populate('title')
          .populate('genre')
          .exec(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.movie == null) {
        // No results.
        const err = new Error('Movie not found');
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      for (const genre of results.genres) {
        for (const movieGenre of results.movie.genre) {
          if (genre._id.toString() === movieGenre._id.toString()) {
            genre.checked = 'true';
          }
        }
      }
      res.render('movie/movie_form', {
        title: 'Update Movie',
        genres: results.genres,
        movie: results.movie,
      });
    }
  );
};

// Handle movie update on POST.
exports.movie_update_post = [
  upload.single('imageUrl'),
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('director', 'Director must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('releaseDate', 'Release date must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const movie = new Movie({
      title: req.body.title,
      director: req.body.director,
      releaseDate: req.body.releaseDate,
      imageUrl: req.file.filename,
      summary: req.body.summary,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      async.parallel(
        {
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (movie.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }
          res.render('movie/movie_form', {
            title: 'Update Movie',
            genres: results.genres,
            movie,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    // Data from form is valid. Update the record.
    Movie.findByIdAndUpdate(req.params.id, movie, {}, (err, themovie) => {
      if (err) {
        return next(err);
      }
      // Delete stored image from server
      fs.unlink(
        path.join(__dirname, '..', 'public', 'images', themovie.imageUrl),
        (err) => {
          if (err) {
            return next(err);
          }
        }
      );

      // Successful: redirect to movie detail page.
      res.redirect(themovie.url);
    });
  },
];
