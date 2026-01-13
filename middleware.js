const { listingSchema }=require("./views/schema.js")
const ExpressError=require("./utils/ExpressError.js");
const Listing=require("./models/listing.js")
const {reviewSchema}=require("./views/schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
        if(!req.isAuthenticated()){
            req.session.redirecturl=req.originalUrl;
        req.flash("error","you must logged in to create listing ");
        return res.redirect("/login");
}
next();
}

module.exports.saveRedirctUrl=(req,res,next)=>{
    if( req.session.redirecturl){
        res.locals.redirecturl= req.session.redirecturl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
 let listing=await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currentuser._id)){
        req.flash("error","you dont have permission to edit");
       return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
 let {err}= listingSchema.validate(req.body)
   if(err){
    let errmes=err.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmes);
   }else{
    next();
   }
}

module.exports.validateReview=(req,res,next)=>{
 let {err}= reviewSchema.validate(req.body)
   if(err){
    let errmes=err.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmes);
   }else{
    next();
   }
}

module.exports.isAuthorOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
 let review=await Review.findById(reviewId);
    if( !review.author.equals(res.locals.currentuser._id)){
        req.flash("error","you dont have permission to delete");
       return res.redirect(`/listings/${id}`);
    }
    next()
}
