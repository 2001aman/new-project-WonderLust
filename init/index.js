const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MANGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
    
    async function main() {
        await mongoose.connect(MANGO_URL);
    }
        const initDB = async () => {
            await Listing.deleteMany({});
            initData.data= initData.data.map((obj) => ({...obj,  owner: "679faa7c804893a7fc745d0f"}));
            await Listing.insertMany(initData.data);
        console.log("Database  was initialized with sample data");
    };
    
    initDB();