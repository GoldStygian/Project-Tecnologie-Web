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
      type: DataTypes.NUMBER,
      allowNull: false
    },
    latitudine: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    //by default, Sequelize adds the createdAt and updatedAt fields to all models
  });
  
}