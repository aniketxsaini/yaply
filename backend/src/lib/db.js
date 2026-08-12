
import dns from "node:dns"

dns.setServers(["1.1.1.1", "8.8.8.8"]);
import mongoose from "mongoose";

export async function connectDB(){
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected ", conn.connection.host);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};
