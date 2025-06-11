import router from "./router.js";
import express from 'express';

const server = express();



server.use('/',router);

// server.listen(4000, () => {
//     console.log('Servidor escuchando en http://localhost:3000');
// });

export default server