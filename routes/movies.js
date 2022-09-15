const express = require('express');
const router = express.Router();

// Require controller modules.
const movie_controller = require('../controllers/movieController');
const review_controller = require('../controllers/reviewController');
const genre_controller = require('../controllers/genreController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', movie_controller.index);

// GET request for creating a Movie. NOTE This must come before routes that display Movie (uses id).
router.get('/movie/create', movie_controller.movie_create_get);

// POST request for creating Movie.
router.post('/movie/create', movie_controller.movie_create_post);

// GET request to delete Movie.
router.get('/movie/:id/delete', movie_controller.movie_delete_get);

// POST request to delete Movie.
router.post('/movie/:id/delete', movie_controller.movie_delete_post);

// GET request to update Movie.
router.get('/movie/:id/update', movie_controller.movie_update_get);

// POST request to update Movie.
router.post('/movie/:id/update', movie_controller.movie_update_post);

// GET request for one Movie.
router.get('/movie/:id', movie_controller.movie_detail);

// GET request for list of all Movie items.
router.get('/movies', movie_controller.movie_list);

/// AUTHOR ROUTES ///

// GET request for creating Review. NOTE This must come before route for id (i.e. display review).
router.get('/review/create', review_controller.review_create_get);

// POST request for creating Review.
router.post('/review/create', review_controller.review_create_post);

// GET request to delete Review.
router.get('/review/:id/delete', review_controller.review_delete_get);

// POST request to delete Review.
router.post('/review/:id/delete', review_controller.review_delete_post);

// GET request to update Review.
router.get('/review/:id/update', review_controller.review_update_get);

// POST request to update Review.
router.post('/review/:id/update', review_controller.review_update_post);

// GET request for one Review.
router.get('/review/:id', review_controller.review_detail);

// GET request for list of all Reviews.
router.get('/reviews', review_controller.review_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

module.exports = router;