export interface ITask {
	name: string;
	description: string;
	house_id: string;
	users_id: string[];
	done: boolean;
	crated_by: string;

	days?: string[];
	start_date: Date;
	end_date: Date;
	repeat: boolean;
	until_date?: Date;
}
