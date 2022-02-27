import { createConnection, getManager } from "typeorm";
import { Permission } from "../entity/permission.entity";
import { Role } from "../entity/role.entity";

// this file is data loader and can be executed via npm
// normally this is done only once...

createConnection().then(async connection => {
	const permissionRepository = getManager().getRepository(Permission)
	const perms = [
		'view_users',
		'edit_users',
		'view_roles',
		'edit_roles',
		'view_products',
		'edit_products',
		'view_orders',
		'edit_orders'
	]

	let permissions = []
	for (let i = 0; i < perms.length; i++) {
		permissions.push(await permissionRepository.save({
			name: perms[i]
		}))
	}

	const roleRepository = getManager().getRepository(Role)
	await roleRepository.save( {
		name: 'Admin',
		permissions // shortcut statement, since the names are the same
	})

	delete permissions[3] // remove edit role
	await roleRepository.save( {
		name: 'Editor',
		permissions
	})

	// only view - we redo idx 3 since it was nulled with delete from above
	delete permissions[1]
	delete permissions[3]
	delete permissions[5]
	delete permissions[7]
	await roleRepository.save({
		name: 'Viewer',
		permissions
	})

	process.exit(0)
})