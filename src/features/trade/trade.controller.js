import { TradeRepository } from "./trade.repository.js";

export class TradeController{

    constructor()
    {
        this.tradeRepository = new TradeRepository();
    }

    async addTrade(req,res,next){
        try{
            const response = await this.tradeRepository.addTrade(req.body);
            return res.status(201).json({
                success : true,
                data : response        
            });
        }catch(err){
            console.log(err);
        }
    }

    async removeTrade(req,res,next){
        try{
            const response = await this.tradeRepository.removeTrade(req.body);
            if(response.success !== undefined && response.success === false)    
            {
                return res.status(400).json({
                            success : response.success,
                            data : {
                                error : response.message
                            }
                        })
            }
            else
            {
                return res.status(200).json({
                    success : true,
                    data : response        
                });
            }
        }catch(err){
            console.log(err);
        }
    }

    async updateTrade(req,res,next){
        try{
            const tradeId = req.params.tradeId;
            const response = await this.tradeRepository.updateTrade(req.body,tradeId);
            if(response.success !== undefined && response.success === false)
            {
                return res.status(404).json({
                    success : response.success,
                    data : {
                        error : response.message
                    }                   
                })
            }
            else{
                res.status(200).json({
                    success : true,
                    data : response
                })
            }
        }catch(err){
            console.log(err);
        }
    }

    async averageBuyingPrice(req,res,next){
        try{
            const response = await this.tradeRepository.averageBuyingPrice();
            return res.status(200).json({
                success : true,
                data : response
            })
        }
        catch(err)
        {
            console.log(err);
        }
    }

    async cumulativeReturn(req,res,next){
        try{
            const response = await this.tradeRepository.cumulativeReturn();
            return res.status(200).json({
                success : true,
                data : response
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}