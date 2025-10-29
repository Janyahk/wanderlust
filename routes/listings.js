const express=require("express");
const route=express.Router();
const wrapasync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");


const listingController=require("../controllers/listings.js")

//index Router
route.get("/",wrapasync(listingController.index));

//new route
route.get("/new",isLoggedIn,listingController.newForm);

// creat route
route.post("/",isLoggedIn,validateListing,wrapasync(listingController.addlist));

//showlist
route.get("/:id",wrapasync(listingController.showlist));

//deletelist
route.delete("/:id",isLoggedIn,isOwner,wrapasync(listingController.deletelist))

//edit the list
route.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingController.editlist))

//update the list
route.put("/:id",isLoggedIn,isOwner,validateListing,wrapasync(listingController.updatelist))

module.exports=route;