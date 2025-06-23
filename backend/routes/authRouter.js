import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthSchema } from "../schemas/Auth.js";

export const authenticationRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - usr
 *         - pwd
 *       properties:
 *         userName:
 *           type: string
 *           description: Unique username of the user
 *         password:
 *           type: string
 *           description: SHA-256 hashed password (never stored in plain text)
 *       example:
 *         usr: johndoe
 *         pwd: e3afed0047b08
 *
 *     User:
 *       type: object
 *       required:
 *         - usre
 *         - pwd
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         userName:
 *           type: string
 *           description: Unique username of the user
 *         password:
 *           type: string
 *           description: SHA-256 hashed password (never stored in plain text)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *       example:
 *         id: 1
 *         userName: johndoe
 *         password: e3afed0047b08059d0fada10f400c1e5
 *         createdAt: 2025-06-23T10:00:00Z
 *         updatedAt: 2025-06-23T10:00:00Z
 *
 *     Cat:
 *       type: object
 *       required:
 *         - photo
 *         - longitude
 *         - latitude
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         photo:
 *           type: string
 *           description: Base64-encoded image or URL to the photo
 *         longitude:
 *           type: number
 *           format: float
 *           description: Longitude of the cat sighting
 *         latitude:
 *           type: number
 *           format: float
 *           description: Latitude of the cat sighting
 *         title:
 *           type: string
 *           description: Title of the cat entry
 *         description:
 *           type: string
 *           description: Detailed description of the sighting
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *       example:
 *         id: 10
 *         photo: "https://example.com/cat.jpg"
 *         longitude: 12.4964
 *         latitude: 41.9028
 *         title: "Gatto nel Colosseo"
 *         description: "Un gatto randagio che gira intorno al Colosseo"
 *         createdAt: 2025-06-23T11:00:00Z
 *         updatedAt: 2025-06-23T11:00:00Z
 *
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         content:
 *           type: string
 *           description: The comment text
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *       example:
 *         id: 5
 *         content: "Bellissimo gatto!"
 *         createdAt: 2025-06-23T12:00:00Z
 *         updatedAt: 2025-06-23T12:00:00Z
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
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT da usare per endpoint protetti
 *       400:
 *         description: Dati non validi
 *       401:
 *         description: Credenziali errate
 */
authenticationRouter.post("/auth", async (req, res) => {
  const parseResult = AuthSchema.safeParse({ ...req.body });
  if (!parseResult.success) {
    const errors = parseResult.error.format();
    return res.status(400).json({ message: "Dati non validi", errors });
  }

  const isAuthenticated = await AuthController.checkCredentials(req);
  if (isAuthenticated) {
    return res.json(AuthController.issueToken(req.body.usr));
  } else {
    return res.status(401).json({ error: "Invalid credentials. Try again." });
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
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dati non validi
 *       409:
 *         description: Utente già esistente
 */
authenticationRouter.post("/signup", async (req, res, next) => {
  const parseResult = AuthSchema.safeParse({ ...req.body });
  if (!parseResult.success) {
    const errors = parseResult.error.format();
    return res.status(400).json({ message: "Dati non validi", errors });
  }

  try {
    const user = await AuthController.saveUser(req);
    return res.status(201).json(user);
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ message: "Username già registrato" });
    }
    return next(err);
  }
});
