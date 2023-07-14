import type { Request, Response, NextFunction } from "express";
import { autoInjectable } from "tsyringe";
import TripService from "../services/trip.service";
import ApiError from "../utils/ApiError";

@autoInjectable()
class TripController {
	private tripService: TripService;

	constructor(tripService: TripService) {
		this.tripService = tripService;
	}

	addTrip = async (req: Request, res: Response, next: NextFunction) => {
		const {
			from,
			to,
			day,
			train_id,
			departure_time,
			arrival_time,
			price,
		}: ITrip = req.body;

		try {
			const trip = await this.tripService.addTrip({
				from,
				to,
				day,
				train_id,
				departure_time,
				arrival_time,
				price,
			});
			return res.status(201).json(trip);
		} catch (error) {
			return next(ApiError.badRequest(error));
		}
	};

	search = async (req: SearchRequest, res: Response) => {
		const { from, to, goDay, backDay } = req.query;

		try {
			const result = await this.tripService.search({
				from,
				to,
				goDay,
				backDay,
			});

			return res.status(200).json(result);
		} catch (error) {
			return ApiError.badRequest(error);
		}
	};
}
export default TripController;

interface ITrip {
	from: string;
	to: string;
	day: number;
	train_id: number;
	departure_time: string;
	arrival_time: string;
	price: number;
}

interface SearchRequest extends Request {
	query: {
		from: string;
		to: string;
		goDay: string;
		backDay: string;
	};
}
