
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.postreviews=async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newre=new Review(req.body.review);
newre.author=req.user._id;
listing.reviews.push(newre);
await newre.save();
await listing.save();
console.log("new rewiew saved");
// res.send("saved to database");
   req.flash("success","New review is Added!");

res.redirect(`/listings/${listing._id}`);
}

module.exports.deletereview=async(req,res)=>{
let{id,reviewId}=req.params;

await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
console.log("deleted");
   req.flash("success","Review is deleted!");

res.redirect(`/listings/${id}`);
}