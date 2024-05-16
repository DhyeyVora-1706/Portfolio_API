import mongoose from "mongoose";

export const portFolioSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true,"Username is required"]
    }
});