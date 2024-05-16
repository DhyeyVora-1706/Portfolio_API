import { TradeSchema } from "./trade.schema.js";
import { StocksRepository } from "../stocks/stocks.repository.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const Trademodel = mongoose.model('trade',TradeSchema);

export class TradeRepository {
    async addTrade(trade){
        try{
            let request = { stockname : trade.stockname , portfolioId : trade.portfolioId , quantity : trade.quantity , action : trade.action };
            const stockDetails = await new StocksRepository().modifyStock(request);
            const newTrade = new Trademodel({quantity : trade.quantity , stockid : stockDetails._id , action : 'BUY' , price : trade.price});
            await newTrade.save();
            return newTrade;
        }catch(err){
            throw new Error(err);
        }
    }

    async updateTrade(trade,id){
        try{    
            let response = await Trademodel.find({_id : new ObjectId(id)});
            if(response.length > 0)
            {   
                response = response[0];
                if(response.action === 'BUY')
                {
                    const absoluteValue = Math.abs(response.quantity - trade.quantity)
                    if(response.quantity > trade.quantity)
                    {
                       await new StocksRepository().updateStock({_id : response.stockid} , response.action , -absoluteValue); 
                    }
                    else
                    {
                        await new StocksRepository().updateStock({_id : response.stockid} , response.action , absoluteValue);
                    }
                }
                else if(response.action === 'SELL')
                {
                    const absoluteValue = Math.abs(response.quantity - trade.quantity)
                    if(response.quantity > trade.quantity)
                    {
                        await new StocksRepository().updateStock({_id : response.stockid},response.action,-absoluteValue);
                    }
                    else
                    {
                        const res = await new StocksRepository().updateStock({_id : response.stockid},response.action,absoluteValue)
                        if( res !== undefined && res.success === false )
                        {
                            return { success:res.success , message : res.message }
                        }    
                    }
                }
                
                const updatedTradeObject = await Trademodel.findOneAndUpdate(
                    {_id : id},
                    {quantity : trade?.quantity , price : trade?.price},
                    {returnOriginal:false}
                )

                return updatedTradeObject;
            }            
            else
            {
                return { success : false , message : "Incorrect TradeId Provided" }
            }
        }catch(err){
            throw new Error(err);
        }
    }

    async removeTrade(trade){
        try{
            let request = { stockname : trade.stockname , portfolioId : trade.portfolioId , quantity : trade.quantity , action : trade.action};
            const stockDetails = await new StocksRepository().modifyStock(request);
            if(stockDetails.success !== undefined && stockDetails.success === false ){
                return stockDetails;
            }
            else
            {
                const newTrade = new Trademodel({quantity : trade.quantity , stockid : stockDetails._id , action : 'SELL' , price : trade.price});
                await newTrade.save();
                return newTrade;
            }
        }catch(err){
            throw new Error(err);
        }
    }

    async averageBuyingPrice()
    {
        try{
           const avgPrice = await Trademodel.aggregate([
                {
                    $match : { action : 'BUY' }
                },
                {
                    $lookup : {
                        from : "stocks",
                        localField : "stockid",
                        foreignField : "_id",
                        as : "stocks"
                    }
                },
                {
                    $unwind : "$stocks"
                },
                {
                    $group: {
                        _id: '$stockid', 
                        stockname: { $first: '$stocks.stockname' }, 
                        averagePrice: { $avg: '$price' } 
                      }
                },
                {
                    $project : {
                        stockname: 1, 
                        averagePrice: 1 ,
                        _id : 0
                    }
                }
            ])
            return avgPrice;
        }catch(err)
        {
            console.log(err);
        }
    }

    async cumulativeReturn()
    {
        try{
            let response = await this.averageBuyingPrice();
            const returns = response.map(function(item){
                return {
                    name : item.stockname,
                    price : (100 - item.averagePrice)
                }
            });
            const cumulativeReturnValue = await new StocksRepository().calculate(returns);
            return cumulativeReturnValue;
        }
        catch(err)
        {

        }
    }
}