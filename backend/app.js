const express = require("express");
require("express-async-errors");
const userRouter = require("./routes/user");
const { errorHandler } = require("./middlewares/error");
require("dotenv").config();
require("./db");

const app = express();
app.use(express.json());
app.use("/api/user/", userRouter);

app.use(errorHandler);
app.listen(8000, () => {
	console.log("The port is listening on port 8000");
});
