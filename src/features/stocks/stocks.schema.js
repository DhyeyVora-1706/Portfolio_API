import mongoose from "mongoose";

export const StocksSchema = new mongoose.Schema({
    stockname : {
        type : String,
        required : [true , "Please Enter StockName"],
        unique : [true , "Stock is already there in portfolio , You can trade for this stock directly"]
    },
    quantity : {
        type : Number,
        required : [true , "Quantity is required"],
        min : [ 0 , "Quantity should be greater than or equal 0"]
    },
    portfolioId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'portfolio',
        required : [true,"PortfolioId is required"]
    }
});