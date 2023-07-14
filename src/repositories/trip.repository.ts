import AppDataSource from "../app-data-source";
import type { Repository } from "typeorm";
import { Trip } from "../entities/Trip";

class TripRepository {
	private tripRepository: Repository<Trip>;

	constructor() {
		this.tripRepository = AppDataSource.getRepository(Trip);
	}

	addTrip = async (args: ITrip) => {
		const trip = new Trip();
		trip.from = args.from;
		trip.to = args.to;
		trip.day = args.day;
		trip.train_id = args.train_id;
		trip.departure_time = args.departure_time;
		trip.arrival_time = args.arrival_time;
		trip.price = args.price;

		await this.tripRepository.save(trip);

		return trip;
	};

	searchOneWay = async ({ from, to, goDay }: ISearch) => {
		return await this.tripRepository.findBy({
			from,
			to,
			day: Number(goDay),
		});
	};

	searchBothWays = async ({ from, to, goDay, backDay }: ISearch) => {
		const goTrips = await this.tripRepository.findBy({
			from,
			to,
			day: Number(goDay),
		});

		const backTrips = await this.tripRepository.findBy({
			from: to,
			to: from,
			day: Number(backDay),
		});

		return {
			goTrips,
			backTrips,
		};
	};
}

export default TripRepository;

interface ISearch {
	from: string;
	to: string;
	goDay: string;
	backDay?: string;
}

interface ITrip {
	from: string;
	to: string;
	day: number;
	train_id: number;
	departure_time: string;
	arrival_time: string;
	price: number;
}
