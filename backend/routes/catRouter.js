import express from "express";
import * as authorization from "../middleware/authorization.js";
import { CatController } from "../controllers/CatContoller.js"


export const catRouter = new express.Router();

// tutti possono visualizzare i gatti
catRouter.get("", (req, res, next) => { // OK
  CatController.getAllCats().then(catItems => {
    res.json(catItems)
  }).catch(err => {
    next(err);
  });
});


catRouter.post("", authorization.enforceAuthentication, (req, res, next) => {

});

catRouter.get("/:id", (req, res, next) => { // OK
  CatController.getSpecificCat(req.params.id)
    .then(specificCat => {
      if (!specificCat){ return next({status: 404, message: "Cat not found"}) };
      res.json(specificCat);
    })
    .catch(err => next(err));
});

catRouter.put("/:id", authorization.ensureUsersModifyOnlyOwnCats, (req, res, next) => {

});

catRouter.delete("/:id", authorization.ensureUsersModifyOnlyOwnCats, (req, res, next) => {

});

catRouter.get("/:id/comments", (req, res, next) => {

});

catRouter.post("/:id/comments", authorization.enforceAuthentication, (req, res, next) => {

});