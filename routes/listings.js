const express=require("express");
// const route=express.Router();
const wrapasync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const router = express.Router()
const multer  = require('multer');
const{storage}=require("../cloudConfig.js")
const upload = multer({storage})

//index Router
// route.get("/",wrapasync(listingController.index))


router.route("/")
.get(wrapasync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapasync(listingController.addlist));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

//new route
router.get("/new",isLoggedIn,listingController.newForm);

// creat route
// route.post("/",isLoggedIn,validateListing,wrapasync(listingController.addlist));

router.route("/:id")
.get(wrapasync(listingController.showlist))
.delete(isLoggedIn,isOwner,wrapasync(listingController.deletelist))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapasync(listingController.updatelist));


//deletelist

//showlist
// router.get("/:id",wrapasync(listingController.showlist));

// //deletelist
// router.delete("/:id",isLoggedIn,isOwner,wrapasync(listingController.deletelist))

//edit the list
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingController.editlist))

//update the list
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapasync(listingController.updatelist))

module.exports=router;