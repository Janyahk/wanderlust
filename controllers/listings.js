const ExpressError = require("../utils/ExpressError");

const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index=async (req,res)=>{
    const datas=await Listing.find({});
    res.render("listings/listing.ejs",{datas});
}

module.exports.newForm=(req,res)=>{
    res.render("listings/add.ejs");
}

module.exports.addlist=async(req,res)=>{
    // if (!req.body.listing){
    //         throw new ExpressError(400,"send valid data for the list")
    //     }

  let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()
  let url=req.file.path;
  let filename=req.file.filename;
  
// let{title,description,image,price,location,country}=req.body;
let listing=new Listing(req.body.listing);
listing.owner=req.user._id;
listing.image={url,filename};
listing.geometry=response.body.features[0].geometry;
// console.log(req.body.listing);
//    try{ const add=await new Listing({
//         title:title,
//         description:description,
//         image:image,
//         price:price,
//         location:location,
//         country:country,
//     })
 let s= await listing.save();
 console.log(s);
   req.flash("success","New Place is Added!");

        res.redirect("/listings");
    }


    module.exports.showlist=async(req,res)=>{
    let {id}=req.params;
    const place=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!place){
     req.flash("error","place you requested for doesnot exists");
    return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{place});
}

module.exports.deletelist=async(req,res)=>{
    let{id}=req.params;

    await Listing.findByIdAndDelete(id);
       req.flash("success","successfully Deleted!");

            res.redirect("/listings");

}

module.exports.editlist=async(req,res)=>{
 let{id}=req.params;
const list=await Listing.findById(id).populate("reviews");
    if(!list){
     req.flash("error","place you requested for edit does not exists");
    return res.redirect("/listings");
    }
    let original=list.image.url;
    original=original.replace("/upload","/upload/h_300,w_350")

res.render("listings/edit.ejs",{list,original});
}

module.exports.updatelist=async(req,res)=>{
      
     if (!req.body.listing){
            throw new ExpressError(400,"send valid data for the list")
        }
     let{id}=req.params;
    //  let{title,description,image,price,location,country}=req.body;
    // const up=Listing.findByIdAndUpdate(id,{
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country,
    // })
    // up.then((r)=>{
    //     console.log("updated ");
    // }).catch((err)=>{
    //     console.log(err);
    // })
   
  let listing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!=="undefined"){
 let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
    
       req.flash("success","Edited Successfully!");

    res.redirect(`/listings/${id}`);
}