import { Cat, User, Comment } from "../models/database.js";
import fs from 'fs/promises';
import path from 'path';

export class CatController {
  
    static async getAllCats(username){
        const queryOptions = {};
        if (username) {
            queryOptions.where = { username: username };
        }
        return Cat.findAll(queryOptions);
    }

    static async getSpecificCat(catId){
        return await Cat.findByPk(catId, {include: [Comment]});
    }

    static async addCat(jsonCat, username){
        return await Cat.create({ ...jsonCat, userName: username });
    }

    static async getCatImgPath(catId) {
        const cat = await Cat.findByPk(catId, { attributes: ['photo'] });
        if (!cat) {
            return null;
        }
        return cat.photo;
    }

    static async delCat(catid){

        const imgPath = await this.getCatImgPath(catid);
        if (imgPath){
            const fullPath = path.join(process.cwd(), imgPath);
            try {
                await fs.unlink(fullPath);
            } catch (e) {
                console.log(`error delete file ${fullPath}:`, e.message);
                return null;
            }

        }else{
            return null;
        }

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