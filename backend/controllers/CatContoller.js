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

//   static async getTodosForCurrentUser(req){
//     return Todo.findAll({
//       where: {
//         UserUserName: req.username
//       }
//     })
//   }
  
//   static async saveTodo(req){
//     let todo = Todo.build(req.body);
//     todo.UserUserName = req.username;
//     return todo.save();
//   }

//   static async findById(req){
//     return Todo.findByPk(req.params.id);
//   }

//   static async update(id, updated){
//     let todo = await Todo.findByPk(id);
//     todo.set(updated); //update using fields which were passed in request
//     return todo.save();
//   }

//   static async delete(req){
//     return new Promise( (resolve, reject) => {
//       this.findById(req).then( item => {
//         item.destroy().then( () => {resolve(item)})
//       })
//     })
//   }
}