import morgan from 'morgan';
import express from "express";

// import "./models/database.js"
import { rootRouter } from "./routes/routes.js";
import { catRouter } from "./routes/catRouter.js";
import { authenticationRouter } from "./routes/authRouter.js";
import { serve, setup } from './swagger.js';
import cors from 'cors';

//https
import https from "https";
import fs from "fs";
import path from "path";

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
app.use('/uploads', express.static("uploads"));
app.use(cors());
app.use('/api-docs', serve(), setup());

app.use(authenticationRouter);
app.use(rootRouter);
app.use("/cats", catRouter);

const keyPath = path.resolve("cert", "key.pem");
const certPath = path.resolve("cert", "cert.pem");

const privateKey = fs.readFileSync(keyPath, 'utf8');
const certificate = fs.readFileSync(certPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

https.createServer(credentials, app).listen(SERVER_PORT, () => {
  console.log("HTTPS Server running at:");
  console.log("https://localhost:" + SERVER_PORT);
});

// app.listen(SERVER_PORT);


console.log("Server are listening at:", SERVER_PORT);
console.log("http://localhost:"+SERVER_PORT);