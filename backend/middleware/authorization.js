import { AuthController } from "../controllers/AuthController.js";

/**
 * This middleware ensures that the user is currently authenticated. If not,
 * redirects to login with an error message.
 */
export function enforceAuthentication(req, res, next){
  const authHeader = req.headers['authorization'] // estraggo dall'header il campo authorization
  const token = authHeader?.split(' ')[1]; 
  if(!token){
    next({status: 401, message: "Unauthorized"});
    return;
  }
  AuthController.isTokenValid(token, (err, decodedToken) => {
    if(err){
      next({status: 401, message: "Unauthorized"});
    } else {
      req.username = decodedToken.user;
      console.log("[username jwt] ", req.username)
      next();
    }
  });
}

export async function ensureUsersModifyOnlyOwnCats(req, res, next){
  const userName = req.username;
  const catId = req.params.id;
  const userHasPermission = await AuthController.canUserModifyCat(userName, catId);
  if(userHasPermission){
    next();
  } else {
    next({
      status: 403, 
      message: "Forbidden! You do not have permissions to view or modify this resource"
    });
  }
}