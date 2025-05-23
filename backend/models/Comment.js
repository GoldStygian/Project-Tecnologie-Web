import { DataTypes } from "sequelize";

export function createModel(database){
  database.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
    }
    //by default, Sequelize adds the createdAt and updatedAt fields to all models
  });
  
}