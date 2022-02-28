import { randomInt } from "crypto";
import { createConnection, getManager } from "typeorm";
import { OrderItem } from "../entity/order-item.entity";
import { Order } from "../entity/order.enity";

createConnection().then(async connection => {

	const orderRepository = getManager().getRepository(Order)
	const orderItemRepository = getManager().getRepository(OrderItem)

	for (let i = 1; i <= 30; i++) {
		let name = 'a'
		if (i % 2 === 0) {
			name = 'b'
		}
		const order = await orderRepository.save({
			first_name: name,
			last_name: name,
			email: name + '@' + name + '.com'
		})

		for (let j = 0; j < randomInt(1, 5); j++) {
			await orderItemRepository.save({
				order,
				product_title: 'Product ' + i,
				price: randomInt(10, 100),
				quantity: randomInt(1, 5)
			})
		}
	}

	process.exit(0)
})