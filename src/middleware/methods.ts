import {Request, Response,NextFunction} from 'express'
import colors from "colors";

export function methods(req: Request, res: Response, next: NextFunction){
    console.log(colors.magenta.bold("Peticion recibida:"), colors.yellow(req.method), colors.rainbow(req.url));
    next();
}

