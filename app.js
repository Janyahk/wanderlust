const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const listingRouter=require("./routes/listings.js")
const reviewRouter=require("./routes/reviews.js")
const userRouter=require("./routes/user.js");

const session=require("express-session")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.engine('ejs',ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));//static file link
app.use(express.urlencoded({extended:true}))

app.listen(8080,()=>{
    console.log("the port is listing");
})

main().then(()=>{
console.log("the DB connected");
}).catch((err)=>{console.log(err)});

app.get("/",(req,res)=>{
    res.send("its working")
})

const sessionOptions={
    secret:"myscreatecode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
    res.locals.currentuser=req.user;
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeuser=new User({
//         email:"janya@gmail.com",
//         username:"janya",
//     });
//  let reguser=  await User.register(fakeuser,"j1a2n3y4a5");
//  res.send(reguser);
// })
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use("/listings",listingRouter);

// app.get("/testlisting",async(req,res)=>{
// let sample=new Listing({
//     title:"My New villa",
//     description:"By the side of beach",
//     price:12000,
//     location:"Goa",
//     country:"India",
// })

// await sample.save()
// console.log("sample saved");
// res.send("successful saved");
// });

app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.use((req,res,next)=>{
    next(new ExpressError(404,"page Not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{err});
})


