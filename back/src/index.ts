import express, { Express, Request, Response } from 'express'
import stagiareRoutes from './routes/stagiareRoutes'
import authRoutes from './routes/authRoutes'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import dotenv from 'dotenv'
dotenv.config()

import './database/index'
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'

const app: Express = express()
const port = process.env.PORT
app.use(cors())
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})

app.get('/', (req:Request, res:Response) => {
    res.send('Application Web du Gestion Des Stagiares 😎');
  });

  app.use(bodyParser.json())
  app.use('/stagiares', stagiareRoutes)
  app.use('/auth', authRoutes)


  const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
      title: 'Gestion des Stagiares API',
      version: '2.0.0',
      description: 'API pour gérer les stagiaires',
    },
    servers: [
      {
        url: process.env.DOCS_API_BASE_URL,
        description: 'Local server',
      },
    ],
  }

  const options ={
    swaggerDefinition,
    apis : [path.resolve(__dirname, '../docs/**/*.yaml')],
  }
  const swaggerDoc = swaggerJsDoc(options)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

