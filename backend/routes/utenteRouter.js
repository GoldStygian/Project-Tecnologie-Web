import express from "express";
import { UserController } from '../controllers/UserController.js'
import * as authorization from "../middleware/authorization.js";

export const userRouter = new express.Router();

userRouter.get("", (req, res, next) => {

  const username = req.query.username;

  UserController.getAllUsers(username).then(userItems => {
    res.json(userItems)
  }).catch(err => {
    next(err);
  });

});

// deve essere autenticato => req.username = decodedToken.user;
userRouter.delete("", authorization.enforceAuthentication, (req, res, next) => {

  const queryUser = req.query.username;
  if (!queryUser){
    return res.status(400).json({ message: "Devi specificare l'ID dell'utente da eliminare" });
  }

  if(queryUser != req.username){
    return res.status(403).json({ message: "Non sei autorizzato ad eliminare altri utenti" });
  }

  UserController.delUser(queryUser, res.username).then(userItems => {
    if(userItems == 1){
        res.status(204).json({ message: "Utente eliminato con successo" });
    }else{
        res.status(404).json({ message: "Utente non trovato" });
    }
  }).catch(err => {
    console.log(err);
    next(err);
  });

});