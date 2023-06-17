const express = require("express");
require("express-async-errors");
const cors = require("cors");
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const { errorHandler } = require("./middlewares/error");
const { handleNotFound } = require("./utils/helper");
require("dotenv").config();
require("./db");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/user/", userRouter);
app.use("/api/actor/", actorRouter);

app.use("/*", handleNotFound);
app.use(errorHandler);
app.listen(8000, () => {
	console.log("The port is listening on port 8000");
});
