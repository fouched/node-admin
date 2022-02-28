import { createConnection, getManager } from "typeorm";
import { Product } from "../entity/product.entity";
import { randomInt } from "crypto";

createConnection().then(async connection => {

	const repository = getManager().getRepository(Product)

	for (let i = 1; i <= 100; i++) {
		await repository.save({
			title: 'Product ' + i,
			description: 'A product description ' + i,
			image: 'http://placeimg.com/200/300/tech',
			price: randomInt(10, 100)
		})
	}

	process.exit(0)
})