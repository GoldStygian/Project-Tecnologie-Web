import express from "express";
import sanitizeHtml from 'sanitize-html';
import * as authorization from "../middleware/authorization.js";
import { CatController } from "../controllers/CatContoller.js"
import { upload } from "../middleware/upload.js";

import { CatSchema } from "../schemas/Cat.js";
import { CommentSchema } from "../schemas/Comment.js";

export const catRouter = new express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Cat:
 *       $ref: '#/components/schemas/Cat'
 *     Comment:
 *       $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /cats:
 *   get:
 *     summary: Lista di tutti i gatti registrati
 *     tags: [Cats]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filtra i gatti per nome utente proprietario
 *         required: false
 *     responses:
 *       200:
 *         description: Lista di tutti i gatti registrati (eventualmente filtrati)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cat'
 */

// tutti possono visualizzare i gatti
catRouter.get("", (req, res, next) => {

  const username = req.query.username;

  CatController.getAllCats(username).then(catItems => {
    res.json(catItems)
  }).catch(err => {
    next(err);
  });
});

/**
 * @swagger
 * /cats:
 *   post:
 *     summary: Aggiungi un nuovo gatto
 *     tags: [Cats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Cat'
 *     responses:
 *       200:
 *         description: Gatto aggiunto con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cat'
 *       400:
 *         description: Input non valido
 */

catRouter.post("", authorization.enforceAuthentication, upload.single('immagine'), (req, res, next) => {

  if (!req.file) {
    return res.status(400).json({ message: "Devi caricare almeno un'immagine." });
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Il file caricato non è un'immagine valida." });
  }

  const sanitizedBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [
      key,
      typeof value === 'string' ? sanitizeHtml(value, ) : value
    ])
  );

  if(sanitizedBody.description == "\r\n"){
    return res.status(400).json({ message: "Descrizione vuota o non valida" });
  }

  sanitizedBody.photo = `/uploads/${req.file.filename}`;

  const parseResult = CatSchema.safeParse(sanitizedBody); // con safe non genero errori

  if (!parseResult.success) { // l'utente ha inviato dati non validi
    const errors = parseResult.error.format();
    return res.status(400).json({ message: "Dati non validi", errors });
  }

  CatController.addCat(parseResult.data, req.username)
    .then(newCat => { res.json(newCat)})
    .catch(err => next(err));
});

/**
 * @swagger
 * /cats/{id}:
 *   delete:
 *     summary: Elimina un gatto specifico
 *     tags: [Cats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gatto eliminato con successo
 *       404:
 *         description: Gatto non trovato
 */

catRouter.delete("/:id", authorization.enforceAuthentication, authorization.ensureUsersModifyOnlyOwnCats, (req, res, next) => {

  CatController.delCat(req.params.id)
  .then(delRow => {
        if (delRow!=null && delRow <= 0) {
          return res.status(404).json({ message: "Nessun gatto trovato da eliminare." });
        }
        return res.status(200).json({ message: "Gatto eliminato con successo." });
  })
  .catch(next); // Inoltra l'errore al middleware di errore
});

/**
 * @swagger
 * /cats/{id}:
 *   get:
 *     summary: Gatto specifico
 *     tags: [Cats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gatto trovato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cat'
 *       404:
 *         description: Gatto non trovato
 */

// tutti possono visualizzare gatti specifici
catRouter.get("/:id", (req, res, next) => {
  CatController.getSpecificCat(req.params.id, req.username)
    .then(specificCat => {
      if (!specificCat){ return res.status(404).json({ message: "Gatto non trovato" }); };
      res.json(specificCat);
    })
    .catch(err => {
      console.log("sddddddddde", err);
      next(err);
    });
});

/**
 * @swagger
 * /cats/{id}/comments:
 *   post:
 *     summary: Add a comment to a cat
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Cat not found
 */

// tutti i logagti possono commentare
catRouter.post("/:id/comments", authorization.enforceAuthentication, (req, res, next) => {
  // userName by JWT
  // JWT assicurato by middleware
  // ID by slug

  const sanitizedContent = sanitizeHtml(req.body.content || '');

  const parseResult = CommentSchema.safeParse({ content: sanitizedContent });

  if (!parseResult.success) {
    const errors = parseResult.error.format();
    return res.status(400).json({ message: "Dati non validi", errors });
  }

  console.log(parseResult.data);

  CatController.addComment(req.params.id, parseResult.data.content, req.username)
    .then(comment => {
      if (!comment) { return res.status(404).json({ message: "Gatto non trovato" }); };
      res.status(201).json(comment);
    })
    .catch(err => next(err));
});