const express = require("express");
const router = express.Router( {mergeParams:true});
const  wrapAsync = require("../Utils/wrapAsync.js");
const  ExpressError = require("../Utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

//Review 
  //post  review route
router.post(
    "/",
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview ));
   
    // Delete review Route
   router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
     wrapAsync(reviewController.destroyReview ));
 
   module.exports = router;


