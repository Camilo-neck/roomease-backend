export interface IUser {
	username: string;
	email: string;
	password: string;
	birth_date: Date;
	phone: string;
	description: string;
	profile_picture: string;
	tags: string[];
	scores: string[];
	tasks: string[];
	houses: string[];
	encryptPassword(password: string): Promise<string>;
	validatePassword(password: string): Promise<boolean>;
}
