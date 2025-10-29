const mongoose=require("mongoose");
const { Schema } = mongoose;   // <-- add this line
const Review=require("./review.js")
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
        type:String,
        default:"https://unsplash.com/photos/photo-of-seashore-d7M5Xramf8g",
        set:(v)=> v===""?"https://unsplash.com/photos/photo-of-seashore-d7M5Xramf8g":v,
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
        }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
await Review.deleteMany({_id:{$in:listing.reviews}})}
})
const Listing=mongoose.models.List ||mongoose.model("List",listingSchema);

module.exports=Listing;