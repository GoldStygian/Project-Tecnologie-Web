import express from "express";
import * as authorization from "../middleware/authorization.js";
import { CatController } from "../controllers/CatContoller.js"
import { createCatSchema } from "../schemas/Cat.js";


export const catRouter = new express.Router();

// cats GET[ok] POST[ok]
// cats/:id GET[ok] PUT DELETE[ok]

// tutti possono visualizzare i gatti
catRouter.get("", (req, res, next) => { // OK
  CatController.getAllCats().then(catItems => {
    res.json(catItems)
  }).catch(err => {
    next(err);
  });
});


catRouter.post("", authorization.enforceAuthentication, (req, res, next) => { // OK
  
  const parseResult = createCatSchema.safeParse(req.body); // con safe non genero errori

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
catRouter.get("/:id", (req, res, next) => { // OK
  CatController.getSpecificCat(req.params.id, req.username)
    .then(specificCat => {
      if (!specificCat){ return next({status: 404, message: "Cat not found"}) };
      res.json(specificCat);
    })
    .catch(err => next(err));
});

// catRouter.get("/:id/comments", (req, res, next) => {

// });

catRouter.post("/:id/comments", authorization.enforceAuthentication, (req, res, next) => {

});