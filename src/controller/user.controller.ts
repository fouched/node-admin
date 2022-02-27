import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs"

export const Users = async (req: Request, res: Response) => {
	const repository = getManager().getRepository(User)

	const users = (await repository.find({
		relations: ['role']
	}))

	res.send(users.map(u => {
		const {password, ...data} = u
		return data
	}))
}

export const CreateUser = async (req: Request, res: Response) => {
	// split role_id out to use it separately during persistence
	const {role_id, ...body} = req.body
	// set default password for user
	const hashedPassword = await bcryptjs.hash('1234', 10)

	const repository = getManager().getRepository(User)

	const {password, ...user} = await repository.save({
		...body,
		password: hashedPassword,
		role: { // must match property name on entity
			id: role_id
		}
	})

	res.status(201).send(user)
}

export const GetUser = async (req: Request, res: Response) => {
	const repository = getManager().getRepository(User)

	const {password, ...user} = await repository.findOne(req.params.id, {
		relations: ['role']
	})

	res.send(user)
}

export const UpdateUser = async (req: Request, res: Response) => {
	// split role_id out to use it separately during persistence
	const {role_id, ...body} = req.body
	
	const repository = getManager().getRepository(User)
	await repository.update(req.params.id, {
		...body,
		role: {
			id: role_id
		}
	})

	const {password, ...user} = await repository.findOne(req.params.id, {
		relations: ['role']
	})
	
	res.status(202).send(user)
}

export const DeleteUser = async (req: Request, res: Response) => {

	const repository = getManager().getRepository(User)
	await repository.delete(req.params.id)

	res.status(204).send(null)
}