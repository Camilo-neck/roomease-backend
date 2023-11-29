import "dotenv/config";

import { App } from "./app";
import dbConnect from "./db/dbConnect";

// Create a new express application instance
const app = new App();

// Connect to database
dbConnect();

app.app.listen(process.env.PORT, () => {
	console.log(`Server is now listening on PORT ${process.env.PORT}`);
});
