import { DataTypes } from "sequelize";

export function createModel(database){
  database.define('Cat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    longitudine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitudine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
    }
    //by default, Sequelize adds the createdAt and updatedAt fields to all models
  });
  
}