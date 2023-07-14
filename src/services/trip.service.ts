import { autoInjectable } from "tsyringe";
import TripRepository from "../repositories/trip.repository";

@autoInjectable()
class TripService {
	private tripRepo: TripRepository;

	constructor(tripRepo: TripRepository) {
		this.tripRepo = tripRepo;
	}

	addTrip = async (args: ITrip) => {
		return await this.tripRepo.addTrip({ ...args });
	};

	search = async ({ from, to, goDay, backDay }: ISearch) => {
		if (!backDay) {
			return await this.tripRepo.searchOneWay({ from, to, goDay });
		} else {
			return await this.tripRepo.searchBothWays({ from, to, goDay, backDay });
		}
	};
}

export default TripService;

interface ISearch {
	from: string;
	to: string;
	goDay: string;
	backDay: string;
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
