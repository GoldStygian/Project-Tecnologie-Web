import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthSchema } from "../schemas/Auth.js"

export const authenticationRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Credentials:
 *       type: object
 *       properties:
 *         usr:
 *           type: string
 *           example: mario_rossi
 *         pwd:
 *           type: string
 *           example: password123
 *       required:
 *         - usr
 *         - pwd
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Effettua login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credentials'
 *     responses:
 *       200:
 *         description: Token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT da usare per endpoint protetti
 *       400:
 *         description: Dati non validi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: object
 *       401:
 *         description: Credenziali errate
 */
authenticationRouter.post("/auth", async (req, res) => {

  const parseResult = AuthSchema.safeParse({...req.body});

  if (!parseResult.success) { // l'utente ha inviato dati non validi
    const errors = parseResult.error.format();
    return res.status(400).json({ message: "Dati non validi", errors });
  }
  console.log(parseResult.data);
  console.log(req.body);
  let isAuthenticated = await AuthController.checkCredentials(req);
  if(isAuthenticated){
    res.json(AuthController.issueToken(req.body.usr));
  } else {
    res.status(401);
    res.json( {error: "Invalid credentials. Try again."});
  }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credentials'
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usr:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *       400:
 *         description: Dati non validi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: object
 *       409:
 *         description: Utente già esistente
 */

authenticationRouter.post("/signup", async (req, res, next) => {

  const parseResult = AuthSchema.safeParse({...req.body}); // email non inserita

  if (!parseResult.success) { // l'utente ha inviato dati non validi
    const errors = parseResult.error.format();
    return res.status(400).json({ message: "Dati non validi", errors });
  }

  try {
    const user = await AuthController.saveUser(req);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    if(err.status==409){return res.status(409).json({ message: "Username gia registrato" });}
    next(err);
  }
  
});