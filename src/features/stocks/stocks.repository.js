import mongoose from "mongoose";
import { StocksSchema } from "./stocks.schema.js";

const stocksModel = mongoose.model('stock' , StocksSchema);

export class StocksRepository {
        
    async modifyStock(stockDetails){
        try{
            const response = await stocksModel.find({
                stockname : stockDetails.stockname,
                portfolioId : stockDetails.portfolioId,    
            });

            if(response.length > 0)
            {
                if(stockDetails.action === 'SELL')
                {
                    if(!this.validateStock(response[0].quantity , stockDetails.quantity))
                    {
                        return { success : false , message : "You can't sell more quantity of stocks than you have purchase , Please refer your holdings for each stock" };
                    }else{
                        const updatedStock = await this.updateStock(response[0],stockDetails.action,stockDetails.quantity);
                        return updatedStock;
                    }
                }
                else{
                    const updatedStock = await this.updateStock(response[0],stockDetails.action,stockDetails.quantity);
                    return updatedStock;
                }
            }
            else
            {  
                if(stockDetails.action === 'SELL')
                {
                    return { success : false , message : "Stock with particular name not found in the portfolio." }
                }
                else{
                    const newStock = await this.createStock({
                        stockname : stockDetails.stockname,
                        quantity  : stockDetails.quantity,
                        portfolioId : stockDetails.portfolioId
                    });
                    return newStock;
                }
                
            }
        }catch(err){
            console.log(err);
        }
    }

    async createStock(stock){
        try{    
            const newStock = new stocksModel(stock);
            await newStock.save();
            return newStock;
        }catch(err){
            console.log(err);
        }
    }

    async updateStock(stock,action,newQuantity){
        try{
            if(action === 'BUY')    
            {
                await stocksModel.updateOne(
                    {_id : stock._id},
                    { $inc : { quantity : newQuantity }}    
                )

            }
            else if(action === 'SELL')
            {
                if(stock.quantity === undefined)
                {
                    const fetchedStock = await stocksModel.findById(stock._id);
                    stock.quantity = fetchedStock.quantity;
                }
                if(! this.validateStock(stock.quantity , newQuantity))
                {
                    return { success : false , message : "You can't sell more quantity of stocks than you have purchase , Please refer your holdings for each stock" }
                }
                else
                {
                    await stocksModel.updateOne(
                        { _id : stock._id },
                        { $inc : { quantity : -newQuantity } }
                    )
                }
            }
            return stock;
        }catch(err){
            console.log(err);
        }
    }

    async getStocks(portfolioId){
        try
        {
            return await stocksModel.find({portfolioId} , {stockname : 1 , quantity : 1 , _id : 0});
        }
        catch(err)
        {
            throw new Error(err);
        }

    }

    async calculate(returns){
        try{    
            let totalReturns = 0;
            for(let i = 0 ; i < returns.length ; i++)
            {
                const stockDetails = await stocksModel.find({stockname : returns[i].name});                
                 totalReturns += (parseInt(returns[i].price) * parseInt(stockDetails[0].quantity));
            }
            console.log(totalReturns);
            return totalReturns;
        }
        catch(err)
        {
            console.log(err);
        }
    }

     validateStock(existingquantity , incomingQuantity){
        try{
            if(incomingQuantity > existingquantity)
            {
                return false;
            }
            else
            {
                return true;
            }
        }catch(err){
            console.log(err);
        }
    }

}
