const mongoose=require("mongoose");
const { Schema } = mongoose;   // <-- add this line
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

    description:{
    type:String,
    required:true,
    maxLength:[500,"the exceed of words"],
    },
    image:{
        // type:String,
        // default:"https://unsplash.com/photos/photo-of-seashore-d7M5Xramf8g",
        // set:(v)=> v===""?"https://unsplash.com/photos/photo-of-seashore-d7M5Xramf8g":v,
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        },
 geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
        // category:{
        //     type:string,
        //     enum:["mo"]
        // }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
await Review.deleteMany({_id:{$in:listing.reviews}})}
})
const Listing=mongoose.models.List ||mongoose.model("List",listingSchema);

module.exports=Listing;
