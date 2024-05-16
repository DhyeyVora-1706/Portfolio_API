import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.MongoDB_URL;

export async function connectToMongoDB(){
    try{
        await mongoose.connect(URL,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        console.log('Connected to MongoDB');
    }catch(err){
        console.log(err);
    }
}