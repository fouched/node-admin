import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.enity";

@Entity()
export class OrderItem {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	product_title: string

	@Column("decimal", { precision: 10, scale: 2 })
	price: number

	@Column()
	quantity: number

	@ManyToOne(() => Order)
	@JoinColumn({name: 'order_id'})
	order: Order

}