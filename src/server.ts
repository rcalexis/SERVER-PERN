import router from "./router";
import express from 'express';
import db from "./config/db";
import  colors  from "colors";
import { methods } from "./middleware/methods";

import swaggerUi from 'swagger-ui-express'

import swaggerSpect,{swaggerUiOptions} from "./config/swagger";


export async function connectionDB() {

    try {

        await db.authenticate()
        db.sync()
        console.log(colors.rainbow("conexion exitosa"));
        
    } catch (error) {
        console.log(error);
        console.log(colors.white.bgRed.bold("hubo un error"));
        
    }
    
}


connectionDB()

//instancia del servidor 
const server = express()

//Leer datos de formularios 
server.use(express.json())
server.use(methods);

server.use('/api', router);

server.use('/docs', swaggerUi.serve,swaggerUi.setup(swaggerSpect,swaggerUiOptions))

export default server


