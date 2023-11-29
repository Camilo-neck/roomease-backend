import "dotenv/config";

import express from "express";

const port = process.env.PORT || 5001;
const app = express();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Server listening on  http://localhost:${port}`);
});
