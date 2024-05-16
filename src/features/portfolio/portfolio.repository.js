import mongoose from "mongoose";
import { portFolioSchema } from "./portfolio.schema.js";
import { StocksRepository } from "../stocks/stocks.repository.js";
import { ObjectId } from "mongodb";

const portFolioModel = mongoose.model("Portfolio" , portFolioSchema);

export class portFolioRepository{

    async createPortFolio(portfolio){
        try{
            const newPortFolio = new portFolioModel(portfolio);
            await newPortFolio.save();
            return newPortFolio;
        }catch(err){
            throw new Error(err);
        }
    }

    async getHoldings(portFolioId){
        try{
            const response = await portFolioModel.findById(portFolioId);
            if(response)
            {
                const stocksData = await new StocksRepository().getStocks(portFolioId);
                return { owner : response.username , stocks : stocksData  };
            }
            else
            {
                return { success : false , message : "Portfolio doesn't exist" }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    async getPortfolio(portFolioId)
    {
        try{
            const result = await portFolioModel.aggregate([
                {
                    $match : {_id : new ObjectId(portFolioId)}   
                },
                {
                    $lookup : {
                        from : 'stocks',
                        localField : '_id',
                        foreignField : 'portfolioId',
                        as : 'stocks'
                    }
                },
                {
                    $lookup : {
                        from : 'trades',
                        localField : 'stocks._id',
                        foreignField : 'stockid',
                        as : 'trades'
                    }
                }
            ]);

           return result;
        }
        catch(err)
        {
            throw new Error(err);
        }
    }
}