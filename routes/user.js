const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirctUrl }=require("../middleware.js");
const userController=require("../controllers/user.js")


router.get("/signup", userController.signupform);

router.post("/signup",wrapAsync(userController.userpost));

router.get("/login",userController.loginform)

router.post("/login",saveRedirctUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userController.loginpost)

router.get("/logout",userController.logout)

module.exports = router;
