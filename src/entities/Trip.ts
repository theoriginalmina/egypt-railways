import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("trips")
export class Trip {
	@PrimaryGeneratedColumn()
		id: number;

	@Column()
		from: string;

	@Column()
		to: string;

	@Column()
		day: number;

	@Column()
		train_id: number;

	@Column({ type: "time without time zone" })
		departure_time: string;

	@Column({ type: "time without time zone" })
		arrival_time: string;

	@Column()
		price: number;
}
