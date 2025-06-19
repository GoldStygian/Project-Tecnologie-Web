import { Cat, User, Comment } from "../models/database.js";

export class CatController {
  
    static async getAllCats(){
        return await Cat.findAll();
    }

    static async getSpecificCat(catId){
        return await Cat.findByPk(catId, {include: [Comment]});
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

    static async addComment(catId, comment, username){
        const cat = await Cat.findByPk(catId);
        if (!cat) {
            return null; // Cat not found
        }
        return await Comment.create({ content: comment, userName: username, catId });
    }
}