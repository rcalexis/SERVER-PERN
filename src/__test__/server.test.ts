import server from "../server";
import  request  from "supertest";

describe('mi primer prueba de ts',()=>{
    it('1+1 must give 2', () => {
        expect(1+1).toBe(2);
        expect(1+1).not.toBe(3);
        
    });

   
    
});

describe('Get / api', () => {
    it('should send back a json response', async () => {
        const res = await request(server).get('/api')
        // console.log(res);
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch(/json/)

        
        //contrareas 
        expect(res.status).not.toBe(400)
        
    });
    
    
});


