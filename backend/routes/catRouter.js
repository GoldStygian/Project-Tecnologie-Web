import express from "express";
import * as authorization from "../middleware/authorization.js";
import { CatController } from "../controllers/CatContoller.js"
import { upload } from "../middleware/upload.js";

import { CatSchema } from "../schemas/Cat.js";
import { CommentSchema } from "../schemas/Comment.js";

export const catRouter = new express.Router();

// tutti possono visualizzare i gatti
catRouter.get("", (req, res, next) => {
  CatController.getAllCats().then(catItems => {
    res.json(catItems)
  }).catch(err => {
    next(err);
  });
});

catRouter.post("", authorization.enforceAuthentication, upload.single('immagine'), (req, res, next) => { // OK

  if (req.file && !req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Il file caricato non è un'immagine valida." });
  }

  const photo = `/upload/${req.file.filename}`;

  const payload = {...req.body, photo}

  const parseResult = CatSchema.safeParse(payload); // con safe non genero errori

  if (!parseResult.success) { // l'utente ha inviato dati non validi
    const errors = parseResult.error.format();
    return res.status(400).json({ message: "Dati non validi", errors });
  }

  CatController.addCat(parseResult.data, req.username)
    .then(newCat => { res.json(newCat)})
    .catch(err => next(err));
});

catRouter.delete("/:id", authorization.enforceAuthentication, authorization.ensureUsersModifyOnlyOwnCats, (req, res, next) => {
  CatController.delCat(req.params.id)
  .then(delRow => {
        if (delRow <= 0) {
          return res.status(404).json({ message: "Nessun gatto trovato da eliminare." });
        }
        return res.status(200).json({ message: "Gatto eliminato con successo." });
  })
  .catch(next); // Inoltra l'errore al middleware di errore
});

// tutti possono visualizzare gatti specifici
catRouter.get("/:id", (req, res, next) => {
  CatController.getSpecificCat(req.params.id, req.username)
    .then(specificCat => {
      if (!specificCat){ return next({status: 404, message: "Cat not found"}) };
      res.json(specificCat);
    })
    .catch(err => next(err));
});

// tutti i logagti possono commentare
catRouter.post("/:id/comments", authorization.enforceAuthentication, (req, res, next) => {
  // userName by JWT
  // JWT assicurato by middleware
  // ID by slug

  const parseResult = CommentSchema.safeParse({...req.body});

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