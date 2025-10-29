
const User = require("../models/user.js");
const { required } = require("joi");

module.exports.userpost=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const reguser = await User.register(newuser, password);
      console.log(reguser);
      req.login(reguser,(err)=>{
         if(err){
      return next(err);
    }
    req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
      })
     
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

  module.exports.signupform=(req, res) => {
  res.render("users/signup.ejs");
}

module.exports.loginform=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginpost=async(req,res)=>{
req.flash("success","welcome back to wanderlust! you are logedin")
let redirecturl=res.locals.redirecturl ||"/listings"
res.redirect(redirecturl);
}

module.exports.logout=(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","logout successfully");
    res.redirect("/listings");
  })
}