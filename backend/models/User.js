import { DataTypes } from "sequelize";
import { createHash } from "crypto";

export function createModel(database){
  database.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) { //custom setter method
        // Saving passwords in plaintext in a database is a no-no!
        // You should at least store a secure hash of the password (as done here).
        // Even better, you should use a random salt to protect against rainbow tables.
        let hash = createHash("sha256");    
        this.setDataValue('password', hash.update(value).digest("hex"));
      }
    }
    //by default, Sequelize adds the createdAt and updatedAt fields to all models
  });
  
}