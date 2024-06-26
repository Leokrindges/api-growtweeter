import { NextFunction, Request, Response } from "express";


export class CreateTweetMiddleware{
    public static validate(req: Request, res: Response, next: NextFunction){
        const { content } = req.body;

        if(!content) {
            return res.status(400).json({
                ok: false,
                message: "Informe um conteudo para o Tweet"
            })
        }
         
        return next()
    }
}