#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Movie = require('./models/movie');
const Genre = require('./models/genre');
const Review = require('./models/review');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var movies = [];
var genres = [];
var reviews = [];

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function movieCreate(title, releaseDate, summary, imageUrl, genre, cb) {
  moviedetail = {
    title: title,
    releaseDate: releaseDate,
    summary: summary,
    imageUrl: imageUrl,
  };
  if (genre != false) moviedetail.genre = genre;

  var movie = new Movie(moviedetail);
  movie.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Movie: ' + movie);
    movies.push(movie);
    cb(null, movie);
  });
}

function reviewCreate(movie, text, cb) {
  reviewdetail = {
    movie: movie,
    text: text,
  };

  var review = new Review(reviewdetail);
  review.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Review: ' + review);
      cb(err, null);
      return;
    }
    console.log('New Review: ' + review);
    reviews.push(review);
    cb(null, review);
  });
}

function createGenre(cb) {
  async.series(
    [
      function (callback) {
        genreCreate('Action', callback);
      },
      function (callback) {
        genreCreate('Comedy', callback);
      },
      function (callback) {
        genreCreate('Drama', callback);
      },
      function (callback) {
        genreCreate('Fantasy', callback);
      },
      function (callback) {
        genreCreate('Horror', callback);
      },
      function (callback) {
        genreCreate('Romance', callback);
      },
      function (callback) {
        genreCreate('Thriller', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createMovie(cb) {
  async.parallel(
    [
      function (callback) {
        movieCreate(
          'The Matrix',
          '1999',
          'In the near future, Computer hacker Neo is contacted by underground freedom fighters who explain that reality as he understands it is actually a complex computer simulation called the Matrix. Created by a malevolent Artificial Intelligence, the Matrix hides the truth from humanity, allowing them to live a convincing, simulated life in 1999 while machines grow and harvest people to use as an ongoing energy source. The leader of the freedom fighters, Morpheus, believes Neo is The One who will lead humanity to freedom and overthrow the machines. Together with Trinity, Neo and Morpheus fight against the machines enslavement of humanity as Neo begins to believe and accept his role as The One.',
          'https://image.tmdb.org/t/p/original/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg',
          [genres[0], genres[3], genres[6]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'The Lord of the Rings: The Fellowship of the Ring',
          '2001',
          "'One ring to rule them all, One ring to find them. One ring to bring them all and in the darkness bind them.' In this part of the trilogy, the young Hobbit Frodo Baggins inherits a ring; but this ring is no mere trinket. It is the One Ring, an instrument of absolute power that could allow Sauron, the dark Lord of Mordor, to rule Middle-earth and enslave its peoples. Frodo, together with a Fellowship that includes his loyal Hobbit friends, Humans, a Wizard, a Dwarf and an Elf, must take the One Ring across Middle-earth to Mount Doom, where it first was forged, and destroy it forever. Such a journey means venturing deep into territory manned by Sauron, where he is amassing his army of Orcs. And it is not only external evils that the Fellowship must combat, but also internal dissension and the corrupting influence of the One Ring itself. The course of future history is entwined with the fate of the Fellowship.",
          'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg',
          [genres[0], genres[3]],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createReview(cb) {
  async.parallel(
    [
      function (callback) {
        reviewCreate(
          movies[0],
          `The Matrix" is a visually dazzling cyberadventure, full of kinetic excitement, but it retreats to formula just when it's getting interesting.`,
          callback
        );
      },
      function (callback) {
        reviewCreate(
          movies[1],
          `"The Lord of the Rings" trilogy is among the most perfect movie trilogies of all time. Against all odds, Peter Jackson's meticulous adaptation of J.R.R. Tolkien's beloved trilogy of novels lived up to the significant hype, pleasing both fans of the books and complete newcomers.`,
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createGenre, createMovie, createReview],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Movies: ' + movies);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
