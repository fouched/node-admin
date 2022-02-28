import { Request, Response } from "express"
import multer from "multer"
import { extname } from "path"

export const Upload = async (req: Request, res: Response) => {

	// configure multer and set random filename
	const storage = multer.diskStorage({
		destination: './uploads',
		filename(_, file, callback) { // we don't use req so 1st are is _
			const randomName = Math.random().toString(20).substring(2, 12)
			return callback(null, `${randomName}${extname(file.originalname)}`)
		}
	})

	// get a handle on the multer middleware
	// image is the form data key that will be posted
	const upload = multer({storage}).single('image') 

	// manually execute the middleware function
	upload(req, res, (err: any) => {

		if (err) {
			return res.status(400).send(err)
		}

		res.send({
			url: `http://localhost:8000/api/uploads/${req.file.filename}`
		})
	})

}