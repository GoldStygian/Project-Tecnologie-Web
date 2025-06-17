import { Cat, User, Comment } from "../models/database.js";

export class CatController {
  
    static async getAllCats(){
        return await Cat.findAll();
    }

    static async getSpecificCat(catId){
        return await Cat.findByPk(catId, {include: [User, Comment]});
    }

    static async addCat(jsonCat, username){
        return await Cat.create({ ...jsonCat, userName: username });
    }

    static async delCat(catid){
        return await Cat.destroy({
            where:{
                id: catid
            },
        })
    }
}