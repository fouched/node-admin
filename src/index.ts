import express, { Request, Response } from 'express'
import cors from 'cors'
import { routes } from './routes';
import { createConnection } from 'typeorm';

// connect to the database first, before running the app
createConnection().then(connection => {
	const app = express();

	// work in json mode
	app.use(express.json()) 
	
	// allow cross side scripting
	app.use(cors({
		origin: ["http://localhost:3000"]
	}))
	
	routes(app)
	
	app.listen(8000, () => {
		console.log('listening on port 8000')
	})
})

