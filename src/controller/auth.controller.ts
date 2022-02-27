import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { RegisterValidation } from "../validation/register.validation";
import bcryptjs from "bcryptjs"
import { sign, verify } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
	const body = req.body
	// deconstruct validator response and use only error property
	const {error} = RegisterValidation.validate(body)

	if (error) {
		return res.status(400).send(error.details)
	}

	// express validation cannot do the password check, do manually
	if (body.password !== body.password_confirm) {
		return res.status(400). send( {
			message: "Password's do not match"
		})
	}

	const repository = getManager().getRepository(User)

	// save the user and decontruct it to not return password
	const {password, ...user} = await repository.save( {
		first_name: body.first_name,
		last_name: body.last_name,
		email: body.email,
		password: await bcryptjs.hash(body.password, 10)
	})

	res.send(user)
}

export const Login = async (req: Request, res: Response) => {
	const repository = getManager().getRepository(User)
	const user = await repository.findOne({email: req.body.email})

	if (!user || !await bcryptjs.compare(req.body.password, user.password)) {
		return res.status(400).send({
			message: 'Invalid credentials'
		})
	}

	// create JWT payload
	const payload = {
		id: user.id
	}
	// generate JWT token
	const token = sign(payload, process.env.SECRET_KEY)
	// store in HTTP only cookie
	res.cookie('jwt', token, {
		httpOnly: true, // why httpOnly? not accessible by frontend, only backend
		maxAge: 24*60*60*1000 // one day
	})

	const {password, ...data} = user

	res.send({
		message: 'success'
	});
}

export const AuthenticatedUser  = async (req: Request, res: Response) => {
	const {password, ...user} = req['user']
	res.send(user)
}

export const Logout  = async (req: Request, res: Response) => {
	// only way to remove cookie, set expiry in the past
	res.cookie('jwt', '', {maxAge: 0})

	res.send({
		message: 'logout success'
	})
}

export const UpdateInfo = async (req: Request, res: Response) => {
	const user = req['user']	
	const repository = getManager().getRepository(User)

	await repository.update(user.id, req.body)
	const {password, ...data} = await repository.findOne(user.id)

	res.send(data)
}

export const UpdatePassword = async (req: Request, res: Response) => {
	const user = req['user']	

	if (req.body.password !== req.body.password_confirm) {
		return res.status(400). send( {
			message: "Password's do not match"
		})
	}

	const repository = getManager().getRepository(User)
	await repository.update(user.id, {
		password: await bcryptjs.hash(req.body.password, 10)
	})

	const {password, ...data} = user

	res.send(data)
}