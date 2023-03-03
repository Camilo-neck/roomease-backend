class HelloService {
	async hello(): Promise<string> {
		return "OK";
	}
}

export default new HelloService();
