import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column()
	description: string

	@Column()
	image: string

	@Column("decimal", { precision: 10, scale: 2 })
	price: number

}