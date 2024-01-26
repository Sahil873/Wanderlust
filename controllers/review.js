const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  newReview.author = req.user._id;

  await newReview.save();
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
};
