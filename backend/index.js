import morgan from 'morgan';
import express from "express";
import multer from 'multer';
import path from 'path';

// import "./models/database.js"
import { rootRouter } from "./routes/routes.js";
import { catRouter } from "./routes/catRouter.js";
import { authenticationRouter } from "./routes/authRouter.js";
import { serve, setup } from './swagger.js';
import cors from 'cors';

// -- LIST --
// - DB ok
// - montato swagger ok
// - auth OK
// - jwt OK
// - routing
// - nodemon OK

const app = express();
const SERVER_PORT = 3000;

// ====MULTER====

// Configuro lo storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');           // cartella di destinazione
  },
  filename: function (req, file, cb) {
    // es. 1616161616161-abcdef123.png
    const uniqueName = Date.now() + '-' + Math.round(Math.random()*1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});
// Init multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // limite 5MB
  fileFilter: function (req, file, cb) {
    // accetta solo immagini
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo immagini sono ammesse'), false);
    }
    cb(null, true);
  }
});
export { upload };
// ====MULTER====

app.use(express.json()); // Parse incoming requests with a JSON payload
app.use(morgan('dev')); // log
app.use(express.static("static")); // File Statici
app.use(cors());
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