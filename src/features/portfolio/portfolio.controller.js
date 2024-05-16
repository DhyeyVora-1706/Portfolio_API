import { portFolioRepository } from "./portfolio.repository.js";

export class PortFolioController{
    constructor(){
        this.portfolioRepository = new portFolioRepository();
    }

    async createPortFolio(req,res,next){
        try{
            let userObj = {};
            userObj.username = req.body.username;
            const response = await this.portfolioRepository.createPortFolio(userObj);
            return res.status(201).json({
                success : true,
                data : response
            })
        }catch(err){
            console.log(err);
        }
    }

    async getHoldings(req,res,next)
    {
        try{
            const holdings = await this.portfolioRepository.getHoldings(req.params.portfolioId);
            if(holdings.success !== undefined && holdings.success === false)
            {
                return res.status(404).send({ 
                    success : holdings.success , 
                    data : {
                        error : response.message
                    }
                })
            }
            else
            {
                return res.status(200).send({
                    success : true,
                    data : {
                        owner : holdings.owner,
                        stocks : holdings.stocks
                    }
                })
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    async getPortfolio(req,res,next)
    {
        try{
            const response = await this.portfolioRepository.getPortfolio(req.params.portfolioId);
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
}