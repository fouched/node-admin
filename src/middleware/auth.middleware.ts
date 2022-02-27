import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { nextTick } from "process";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
	try {
		const jwt = req.cookies['jwt']
		const payload: any = verify(jwt, process.env.SECRET_KEY)

		if (!payload) {
			return res.status(401).send({
				message: 'Unauthenticated'
			})
		}

		const repository = getManager().getRepository(User)
		const user = await repository.findOne(payload.id)
		
		// add the user to the request object
		req["user"] = user
		// call the next function
		next()

	} catch (e) {
		return res.status(401).send( {
			message: 'Unauthenticated'
		})
	}
}