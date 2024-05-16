import express from 'express';
import { TradeController } from './trade.controller.js';

const tradeController = new TradeController();

export const tradeRouter = express.Router();

tradeRouter.post("/addTrade",(req,res,next) => {
    tradeController.addTrade(req,res,next);
});

tradeRouter.post("/removeTrade",(req,res,next) => {
    tradeController.removeTrade(req,res,next);
});

tradeRouter.put("/updateTrade/:tradeId" , (req,res,next)=>{
    tradeController.updateTrade(req,res,next);
})

tradeRouter.get("/averageBuyingPrice",(req,res,next) => {
    tradeController.averageBuyingPrice(req,res,next);
})

tradeRouter.get("/returns",(req,res,next) => {
    tradeController.cumulativeReturn(req,res,next);
})