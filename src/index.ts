import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express();

// work in json mode
app.use(express.json()) 

// allow cross side scripting
app.use(cors({
	origin: ["http://localhost:3000"]
}))

// add route
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World')
})


app.listen(8000, () => {
	console.log('listening on port 8000')
})