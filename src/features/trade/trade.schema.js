import mongoose from "mongoose";

const schemaOptions = {
    timestamps : {
        createdAt : 'created_at',
        updatedAt : 'updated_at'
    }
}

export const TradeSchema = new mongoose.Schema({
    quantity : {
        type:Number,
        required : [true , "Quantity is required"],
        min : [ 0 , "Quantity should be greater than or equal 0"]
    },
    stockid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'stock'
    },
    action : {
        type : String,
        enum : ['BUY','SELL'],
        required : [true , "Action is required"]
    },
    price : {
        type : Number,
        required : [ true , "Price is required" ]  
    }
} , schemaOptions);