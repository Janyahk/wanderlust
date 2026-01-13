require("dotenv").config({ path: "../.env" });

const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

async function main() {
await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}



main().then(()=>{
console.log("the DB connected");
console.log("MAP TOKEN:", maptoken);

}).catch((err)=>{console.log(err)});

const initdb=async()=>{
    await Listing.deleteMany({});
//             let response= await geocodingClient.forwardGeocode({
//   query: req.body.listing.location,
//   limit: 1,
// })
//   .send()
//     initdata.data=initdata.data.map((obj)=>({

//         ...obj,
//         owner:"68d3a36cb0e5ba7cfb4402ae",
//         geometry:response.body.features[0].geometry,
//     }));

const newData = [];

  for (let obj of initdata.data) {
    const response = await geocodingClient.forwardGeocode({
      query: obj.location,   // ✅ use data file
      limit: 1,
    }).send();

    newData.push({
      ...obj,
      owner: "68d3a36cb0e5ba7cfb4402ae",
      geometry: response.body.features[0].geometry,
    });
  }
// await  Listing.insertMany(initdata.data);
  await Listing.insertMany(newData);

console.log("data was initalized");
};
initdb();