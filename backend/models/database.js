import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCatModel } from "./Cat.js";
import { createModel as createCommentModel } from "./Comment.js";

import 'dotenv/config.js'; //read .env file and make it available in process.env

// const {
//   DB_HOST,
//   DB_PORT,
//   DB_NAME,
//   DB_USER,
//   DB_PASS,
//   DB_DIALECT
// } = process.env;

// if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASS || !DB_DIALECT) {
//   throw new Error("Variabili DB non configurate correttamente in .env");
// }

// // Istanzia Sequelize
// const database = new Sequelize({
//   dialect: DB_DIALECT,
//   database: DB_NAME,
//   user: DB_USER,
//   password: DB_PASS,
//   host: DB_HOST,
//   port: Number(DB_PORT),
//   ssl: false
  // logging: false,       // disabilita logging SQL in console; metti true per debug
  // define: {
  //   underscored: true,  // snake_case per nomi colonne e tabelle
  //   freezeTableName: true, // nome modello = nome tabella
  // },
  // pool: {
  //   max: 5,
  //   min: 0,
  //   acquire: 30000,
  //   idle: 10000
  // }
// });

export const database = new Sequelize(
  process.env.DB_CONNECTION_URI, 
  {
    dialect: process.env.DIALECT,
    logging: false
  }
);

// try {
//   await database.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

createCatModel(database);
createUserModel(database);
createCommentModel(database);

export const {User, Cat, Comment} = database.models;

// -- associations configuration --
User.hasMany(Cat, {foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});
Cat.User = Cat.belongsTo(User, {foreignKey: "userId",onDelete: "CASCADE", onUpdate: "CASCADE" }); // Associo il post del gatto con il pubblicatore

User.hasMany(Comment, {foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" }); // Un utente può pubblicare più commenti
Comment.belongsTo(User, {foreignKey: "userId", as: "author", onDelete: "CASCADE", onUpdate: "CASCADE"});

Cat.hasMany(Comment, { foreignKey: "catId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(Cat, { foreignKey: "catId", onDelete: "CASCADE", onUpdate: "CASCADE" });

// -- synchronize schema (creates missing tables) --
// Per ambienti di sviluppo rapido, sync({ alter: true }) ti risparmia il lavoro manuale.
// force: true
// { alter: true}
database.sync().then( () => {
  console.log("Database synced correctly");
}).catch( err => {
  console.error("Error with database synchronization: " + err.message);
});