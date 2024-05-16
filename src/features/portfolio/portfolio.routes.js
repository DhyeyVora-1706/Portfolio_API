import express from 'express';
import { PortFolioController } from "./portfolio.controller.js";

export const portFolioRouter = express.Router();

const portfolioController = new PortFolioController();

portFolioRouter.post("/",(req,res,next) => {
    portfolioController.createPortFolio(req,res,next);
})

portFolioRouter.get("/:portfolioId", (req,res,next) =>{
    portfolioController.getPortfolio(req,res,next);
})

portFolioRouter.get("/holdings/:portfolioId",(req,res,next) =>{
    portfolioController.getHoldings(req,res,next);
})