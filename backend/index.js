import morgan from 'morgan';
import express from "express";

// import "./models/database.js"
import { rootRouter } from "./routes/routes.js";
import { catRouter } from "./routes/catRouter.js";
import { authenticationRouter } from "./routes/authRouter.js";
import { serve, setup } from './swagger.js';

// -- LIST --
// - DB ok
// - montato swagger ok
// - auth OK
// - jwt OK
// - routing
// - nodemon OK

const app = express();
const SERVER_PORT = 3000;

app.use(express.json()); // Parse incoming requests with a JSON payload
app.use(morgan('dev')); // log
app.use(express.static("static")); // File Statici
app.use('/api-docs', serve(), setup());

app.use(authenticationRouter);
app.use(rootRouter);
app.use("/cats", catRouter);


app.listen(SERVER_PORT);

// dopo tutti i router
app.use((err, req, res, next) => {
  console.error(err); // logga lo stack in console
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});


console.log("Server are listening at:", SERVER_PORT);
console.log("http://localhost:"+SERVER_PORT);