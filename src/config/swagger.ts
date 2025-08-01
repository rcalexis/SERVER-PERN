import swaggerJSDoc from "swagger-jsdoc"

import { SwaggerUiOptions } from "swagger-ui-express"



const options : swaggerJSDoc.Options={

    swaggerDefinition:{
        openapi:'3.0.2',
        tags :[
            {
            name:'products',
            description:'Operaciones de API PERN con productos'
            },
            {
            name:'Usuarios',
            description:'Operaciones de API PERN con Usuarios'

            }

        ],

        info:{
            title:'REST API Node.js / Express / Typescript',
            version:"1.0.0",
            description: "API Documentacion para productos"
        }
            
    },
    apis:['./src/router.ts']
}
const swaggerSpect =swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss : `
        .topbar-wrapper .link {
            content: url('https://codigoconjuan.com/wp-content/themes/cursosjuan/img/logo.svg');
            height: 80px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #2b3b45;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript'
}
export default swaggerSpect
export {
    swaggerUiOptions
}