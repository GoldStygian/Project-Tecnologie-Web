import { User } from "../models/database.js";
import Jwt from "jsonwebtoken";


export class AuthController {
  /**
   * Handles post requests on /auth. Checks that the given credentials are valid
   * @param {http.IncomingMessage} request 
   * @param {http.ServerResponse} response 
   */
  static async checkCredentials(req, res){
    let user = new User({ //user data specified in the request
      userName: req.body.usr, // usr e pwd sono i nomi dei campi del json inviato
      password: req.body.pwd
    }); // Serve crearlo perche la password deve essere hashata

    let found = await User.findOne({
      where: {
        userName: user.userName,
        password: user.password //password was hashed when creating user
      }
    });

    return found !== null;
  }

  static async saveUser(req){
    //save new user
    const user = await User.create({
      userName: req.body.usr, 
      password: req.body.pwd
    });
    
    return user;

  }

  static issueToken(username){
    return Jwt.sign({user:username}, process.env.TOKEN_SECRET, {expiresIn: `${24*60*60}s`});
  }

  static isTokenValid(token, callback){
    Jwt.verify(token, process.env.TOKEN_SECRET, callback);
  }

  static async canUserModifyCat(userName, catId){
    const cat = await Cat.findByPk(catId, {
      include: [{
        model: User,
        attributes: ['userName']
      }]
    });
    return cat && (cat.User?.userName === userName); //cat must exist and be associated with user
  }
}