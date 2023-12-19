const mongoose = require("mongoose");

uri = 
"mongodb+srv://yogaclasses:coolabhi@yogaclasses.gpjps6h.mongodb.net/YOGACLASSES?retryWrites=true&w=majority";

const connectDB = () => {
    //console.log("connect db");
    return mongoose.connect(uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
};

module.exports = connectDB;