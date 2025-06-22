import { User } from "../models/database.js"

export class UserController{

    static async getAllUsers(username){
        const queryOptions = {};
        if (username) {
            queryOptions.where = { username: username };
            return await User.findOne({ where: { username } });
        }
        return await User.findAll(queryOptions);
    }

    static async delUser(username){

        return await User.destroy({
            where:{
                userName: username
            },
        })
    }

}