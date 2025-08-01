import db from "../config/db";
import server from "../server";
import  request  from "supertest";

import { connectionDB } from "../server";

jest.mock('../config/db');

// describe('Get / api', () => {
//     it('should send back a json response', async () => {
//         const res = await request(server).get('/api')
//         // console.log(res);
//         expect(res.status).toBe(200)
//         expect(res.header['content-type']).toMatch(/json/)
//         //contrareas 
//         expect(res.status).not.toBe(400)
//     });
    
    
// });

describe('conexion to database',()=>{
    it('should handle databse conection error', async()=>{
        jest.spyOn(db,'authenticate')
        .mockRejectedValueOnce(new Error("hubo un error"))

        const consoleSpy = jest.spyOn(console,'log')
        await connectionDB()

        
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("hubo un error")
        )

    })

})

