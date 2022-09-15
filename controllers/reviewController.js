const Review = require('../models/review');

// Display list of all Reviews.
exports.review_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Review list');
};

// Display detail page for a specific Review.
exports.review_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Review detail: ${req.params.id}`);
};

// Display Review create form on GET.
exports.review_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Review create GET');
};

// Handle Review create on POST.
exports.review_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Review create POST');
};

// Display Review delete form on GET.
exports.review_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Review delete GET');
};

// Handle Review delete on POST.
exports.review_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Review delete POST');
};

// Display Review update form on GET.
exports.review_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Review update GET');
};

// Handle Review update on POST.
exports.review_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Review update POST');
};
