const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/Listing.js");
async function main() {
await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
console.log("the DB connected");
}).catch((err)=>{console.log(err)});

const initdb=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner:"68d3a36cb0e5ba7cfb4402ae"
    }));
await  Listing.insertMany(initdata.data);
console.log("data was initalized");
};
initdb();