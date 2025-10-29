const express=require("express");
const route=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isAuthorOwner}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js")

route.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postreviews))

//delete rewieroute
route.delete("/:reviewId",isLoggedIn,isAuthorOwner,wrapAsync(reviewController.deletereview))

module.exports=route;