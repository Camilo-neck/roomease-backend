export interface ITask {
	name: string;
	description: string;
	house_id: string;
	users_id: string[];
	done: boolean;
	crated_by: string;

	days: string[];
	hours: {
		start: string;
		end: string;
	};
	repeat: boolean;
	from_date: Date;
	to_date: Date;
}
