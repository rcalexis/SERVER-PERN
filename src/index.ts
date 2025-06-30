// import { sumar } from "./funciones.js";
// console.log("hola van a reprobar ");
// sumar();



import server from "./server";

const port = process.env.PORT ||4000
server.listen(port,()=>{
    console.log(`Corre patito en mi puerto: ${port}`);
})
