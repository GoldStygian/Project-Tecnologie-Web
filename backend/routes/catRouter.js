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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               breed:
 *                 type: string
 *               immagine:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Gatto Aggiunto
 *       400:
 *         description: Input non valido
 */

catRouter.post("", authorization.enforceAuthentication, upload.single('immagine'), (req, res, next) => { // OK

  if (req.file && !req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Il file caricato non è un'immagine valida." });
  }

  const sanitizedBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [
      key,
      typeof value === 'string' ? sanitizeHtml(value) : value
    ])
  );

  sanitizedBody.photo = `/uploads/${req.file.filename}`;
  // const photo = `/upload/${req.file.filename}`;

  // const payload = {...req.body, photo}

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
 * /api/cats/{id}:
 *   delete:
 *     summary: Delete a cat by ID
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
 *         description: Cat deleted
 *       404:
 *         description: Cat not found
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
 *     summary: Get a specific cat by ID
 *     tags: [Cats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cat found
 *       404:
 *         description: Cat not found
 */

// tutti possono visualizzare gatti specifici
catRouter.get("/:id", (req, res, next) => {
  CatController.getSpecificCat(req.params.id, req.username)
    .then(specificCat => {
      if (!specificCat){ return next({status: 404, message: "Cat not found"}) };
      res.json(specificCat);
    })
    .catch(err => next(err));
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
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
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

  CatController.addComment(req.params.id, parseResult.data.content, req.username)
    .then(comment => {
      if (!comment) { return next({status: 404, message: "Cat not found"}) };
      res.status(201).json(comment);
    })
    .catch(err => next(err));
});